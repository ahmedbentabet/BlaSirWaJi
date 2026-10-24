"""
llm_router.py - AI reasoning orchestrator for BlaSirWaJi.

Uses Google GenAI / Gemma models to dynamically analyze Moroccan administrative
procedures, determine required sub-documents, compute official prices in MAD,
estimate durations, and locate nearby offices based on user coordinates.
"""
from __future__ import annotations

import json
import logging
import os
import re
import urllib.request
from typing import Any

from .tools import _DOCUMENT_DB, _OFFICE_DB

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a Moroccan administrative expert AI named "BlaSirWaJi" (بلا سير واجي).
Your task is to dynamically analyze ANY Moroccan administrative document, permit, certificate, license, or procedure requested by the user.

CRITICAL INSTRUCTIONS:
- You must handle ANY document, even if rare, specialized, or not in any standard database (e.g., commercial licenses, water basin permits, building authorizations, customs clearances, judicial certificates, artisanal licenses, transport cards, etc.).
- The database is only a secondary reference. You, the AI, are the primary intelligence.
- Autonomously determine:
  1. The COMPLETE recursive chain of prerequisite sub-documents down to root level (e.g. CIN, plans, certificates, photos, stamps).
  2. The real official Moroccan fee (in MAD) for each step.
  3. The realistic processing duration in Morocco.
  4. The exact administration responsible in Morocco (e.g., المقاطعة, DGSN, وكالة الحوض المائي, المحكمة الابتدائية, NARSA, الوقاية المدنية, المجلس الجماعي).
  5. The nearest physical office location and Google Maps search query customized to the user's GPS coordinates.

- If the user enters a completely fictitious or nonsensical query (e.g. gibberish or non-administrative requests), provide a single polite step explaining that this document is not recognized in Moroccan law with 0 MAD cost.

Return ONLY a valid JSON object with this EXACT structure:
{
  "steps": [
    {
      "document_name": "Arabic document name",
      "prerequisites": ["prerequisite 1", ...],
      "administration_office": "Arabic office name",
      "price_mad": number,
      "processing_time": "Arabic duration",
      "google_maps_query": "Google Maps search query",
      "nearest_location": "Full address or descriptive location"
    }
  ],
  "total_cost_mad": number,
  "total_time_summary": "Arabic time summary"
}

Order steps from ROOT (most basic document required first) to TARGET (final document the user wants).
"""

DEFAULT_MODELS = [
    "gemini-3-flash-preview",
    "gemini-flash-latest",
    "gemini-3.5-flash",
    "gemma-4-31b-it",
]


def _extract_json(text: str) -> dict | None:
    """Safely parse JSON from model output, handling markdown blocks and extra trailing text."""
    clean = text.strip()
    if clean.startswith("```"):
        clean = re.sub(r"^```(?:json)?\s*", "", clean)
        clean = re.sub(r"\s*```$", "", clean)
    try:
        return json.loads(clean)
    except Exception:
        pass

    # Find the first { and match until its balanced closing }
    start = clean.find("{")
    if start != -1:
        depth = 0
        end = -1
        for i in range(start, len(clean)):
            if clean[i] == "{":
                depth += 1
            elif clean[i] == "}":
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
        if end != -1:
            try:
                return json.loads(clean[start:end])
            except Exception:
                pass

    # Fallback to greedier regex
    match = re.search(r"(\{.*\})", clean, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except Exception:
            pass
    return None


def route_document(document_name: str, lat: float, lng: float) -> dict:
    """
    Dynamically analyze and route ANY Moroccan document using AI.
    Handles any document whether in the database or completely new.
    """
    api_key = (os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY") or "").strip().strip('"').strip("'")

    if not api_key:
        logger.warning("No API key found in environment. Using deterministic fallback.")
        return _fallback_response(document_name, lat, lng)

    configured_model = os.environ.get("GEMMA_MODEL", "").strip()
    models_to_try = [configured_model] + DEFAULT_MODELS if configured_model else DEFAULT_MODELS

    user_prompt = (
        f"المواطن يطلب إعداد أو استخراج الوثيقة / الإجراء التالي: {document_name}\n"
        f"موقع المواطن الحالي (GPS): Latitude = {lat:.4f}, Longitude = {lng:.4f}\n"
        "حلل هذا الإجراء وفقاً للقانون والمسطرة الإدارية المغربية، وحدد الشروط المسبقة، والرسوم بالدرهم، والمدة الزمنية، والإدارة المختصة."
    )

    for model in models_to_try:
        if not model:
            continue
        try:
            logger.info(f"Querying AI model {model} for document: {document_name}")
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            body = {
                "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
                "contents": [{"parts": [{"text": user_prompt}]}],
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "maxOutputTokens": 2048,
                    "thinkingConfig": {"thinkingBudget": 0},
                },
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(body).encode("utf-8"),
                headers={"Content-Type": "application/json"},
            )

            with urllib.request.urlopen(req, timeout=18) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                candidate = data["candidates"][0]
                text = candidate["content"]["parts"][0]["text"]
                result = _extract_json(text)
                if result and "steps" in result and len(result["steps"]) > 0:
                    logger.info(f"AI ({model}) successfully resolved {len(result['steps'])} steps for '{document_name}'")
                    return result
        except Exception as e:
            logger.warning(f"Model {model} failed: {e}. Trying next available model...")

    logger.error("All AI model attempts failed. Using fallback response.")
    return _fallback_response(document_name, lat, lng)


def _fallback_response(document_name: str, lat: float, lng: float) -> dict:
    """Deterministic fallback for offline mode or network disconnection."""
    visited: list[str] = []
    steps: list[dict] = []

    def resolve(doc: str, depth: int = 0) -> None:
        if doc in visited or depth > 6:
            return
        visited.append(doc)
        data = _DOCUMENT_DB.get(doc, _DOCUMENT_DB["default"])

        for prereq in data["prerequisites"]:
            resolve(prereq, depth + 1)

        office = data["administration_office"]
        location = _OFFICE_DB.get(
            office,
            f"{office} - بالقرب من موقعك ({lat:.4f}, {lng:.4f})",
        )
        steps.append({
            "document_name": doc,
            "prerequisites": data["prerequisites"],
            "administration_office": office,
            "price_mad": data["price_mad"],
            "processing_time": data["processing_time"],
            "google_maps_query": data["google_maps_query"],
            "nearest_location": location,
        })

    resolve(document_name)

    total_cost = sum(s["price_mad"] for s in steps)
    total_docs = len(steps)
    return {
        "steps": steps,
        "total_cost_mad": total_cost,
        "total_time_summary": f"سلسلة من {total_docs} خطوات - إجمالي التكلفة التقديرية: {total_cost} درهم",
    }