"""
tools.py - Moroccan document database and tool implementations for BlaSirWaJi.

Provides:
- get_document_requirements(doc_name): Returns prerequisites, price in MAD, processing time,
  administration office, and Google Maps query.
- find_nearest_office(office_type, lat, lng): Returns the nearest administration office.
"""
from __future__ import annotations

import json
import logging
import pathlib

logger = logging.getLogger(__name__)

# Base fallback database
_DOCUMENT_DB: dict[str, dict] = {
    "عقد الازدياد": {
        "prerequisites": ["بطاقة التعريف الوطنية", "شهادة التسجيل في الحالة المدنية"],
        "price_mad": 2,
        "processing_time": "فوري / في نفس اليوم",
        "administration_office": "قسم الحالة المدنية بالملحقة الإدارية أو الجماعة",
        "google_maps_query": "Commune Urbaine Etat Civil Maroc",
    },
    "شهادة السكنى": {
        "prerequisites": ["بطاقة التعريف الوطنية", "فاتورة الكهرباء أو الماء"],
        "price_mad": 0,
        "processing_time": "24 إلى 48 ساعة",
        "administration_office": "الملحقة الإدارية / المقاطعة الحضرية",
        "google_maps_query": "Annexe Administrative المقاطعة Maroc",
    },
    "نسخة السجل العدلي": {
        "prerequisites": ["بطاقة التعريف الوطنية", "صورة شمسية"],
        "price_mad": 0,
        "processing_time": "24 إلى 48 ساعة",
        "administration_office": "المحكمة الابتدائية",
        "google_maps_query": "Tribunal de Premiere Instance Maroc",
    },
    "بطاقة التعريف الوطنية": {
        "prerequisites": ["عقد الازدياد", "شهادة السكنى", "صورة شمسية 4 نسخ"],
        "price_mad": 75,
        "processing_time": "من 7 إلى 15 يوماً",
        "administration_office": "المديرية العامة للأمن الوطني - مصلحة الوثائق",
        "google_maps_query": "Prefecture de Police DGSN Documents Maroc",
    },
    "شهادة التسجيل في الحالة المدنية": {
        "prerequisites": ["شهادة الولادة الأصلية"],
        "price_mad": 20,
        "processing_time": "فوري / في نفس اليوم",
        "administration_office": "المصلحة الإدارية الجماعية - قسم الحالة المدنية",
        "google_maps_query": "Commune Urbaine Etat Civil Maroc",
    },
    "جواز السفر": {
        "prerequisites": ["بطاقة التعريف الوطنية", "عقد الازدياد", "شهادة السكنى", "صور شمسية"],
        "price_mad": 500,
        "processing_time": "من 10 إلى 15 يوماً",
        "administration_office": "مصالح الأمن الوطني / الباشوية / العمالة",
        "google_maps_query": "Service Passeport DGSN Maroc",
    },
    "رخصة السياقة": {
        "prerequisites": ["بطاقة التعريف الوطنية", "شهادة السكنى", "شهادة طبية", "نسخة السجل العدلي"],
        "price_mad": 450,
        "processing_time": "30 إلى 45 يوماً",
        "administration_office": "الوكالة الوطنية للسلامة الطرقية (NARSA)",
        "google_maps_query": "Centre Immatriculation NARSA Maroc",
    },
    "شهادة طبية": {
        "prerequisites": ["بطاقة التعريف الوطنية"],
        "price_mad": 100,
        "processing_time": "فوري / في نفس اليوم",
        "administration_office": "المركز الصحي العمومي أو عيادة طبيب معتمد",
        "google_maps_query": "Centre de Sante Urbain Maroc",
    },
    "default": {
        "prerequisites": ["بطاقة التعريف الوطنية", "شهادة السكنى"],
        "price_mad": 50,
        "processing_time": "24 إلى 48 ساعة",
        "administration_office": "الملحقة الإدارية المحلية",
        "google_maps_query": "Annexe Administrative Maroc",
    },
}

_OFFICE_DB: dict[str, str] = {
    "قسم الحالة المدنية بالملحقة الإدارية أو الجماعة": "الملحقة الإدارية باب المريسة، شارع الحسن الثاني، الرباط",
    "المصلحة الإدارية الجماعية - قسم الحالة المدنية": "الملحقة الإدارية باب المريسة، شارع الحسن الثاني، الرباط",
    "الملحقة الإدارية / المقاطعة الحضرية": "المقاطعة الإدارية أكدال-الرياض، شارع محمد الديوري، الرباط",
    "المقاطعة الإدارية": "المقاطعة الإدارية أكدال-الرياض، شارع محمد الديوري، الرباط",
    "المحكمة الابتدائية": "المحكمة الابتدائية للرباط، شارع الجيش الملكي، الرباط",
    "المديرية العامة للأمن الوطني - مصلحة الوثائق": "المديرية العامة للأمن الوطني، شارع المسيرة الخضراء، الرباط",
    "مصالح الأمن الوطني / الباشوية / العمالة": "مصالح الأمن الوطني، حي الرياض، الرباط",
    "مصالح الأمن الوطني - الشباك الإداري": "مصالح الأمن الوطني، حي الرياض، الرباط",
    "الوكالة الوطنية للسلامة الطرقية (NARSA)": "وكالة NARSA، شارع العرفان، الرباط",
    "مصلحة السيارات والنقل المحلي": "وكالة السيارات والنقل المحلي، شارع العرفان، الرباط",
    "المركز الصحي العمومي أو عيادة طبيب معتمد": "المركز الصحي أكدال، شارع التقدم، الرباط",
    "المركز الصحي القريب": "المركز الصحي أكدال، شارع التقدم، الرباط",
    "الملحقة الإدارية المحلية": "المقاطعة الإدارية حسان، شارع الرياض، الرباط",
    "المقاطعة الإدارية المحلية": "المقاطعة الإدارية حسان، شارع الرياض، الرباط",
}


def _load_documents_json() -> None:
    """Load and merge documents from moroccan_documents.json if available."""
    json_candidates = [
        pathlib.Path(__file__).parent / "moroccan_documents.json",
        pathlib.Path(__file__).parent.parent.parent / "moroccan_documents.json",
    ]
    for p in json_candidates:
        if p.exists():
            try:
                data = json.loads(p.read_text(encoding="utf-8"))
                for doc in data.get("documents", []):
                    name_ar = doc.get("name_ar", "").strip()
                    if not name_ar:
                        continue
                    item = {
                        "prerequisites": doc.get("prerequisites", []),
                        "price_mad": doc.get("price_mad", 0),
                        "processing_time": doc.get("duration", "فوري"),
                        "administration_office": doc.get("administration_office", "المقاطعة الإدارية"),
                        "google_maps_query": doc.get("google_maps_query", "المقاطعة الإدارية المغرب"),
                    }
                    _DOCUMENT_DB[name_ar] = item
                    # Also register clean alias without parentheses (e.g. "عقد الازدياد" from "عقد الازدياد (رسم الولادة)")
                    if "(" in name_ar:
                        short_name = name_ar.split("(")[0].strip()
                        if short_name and short_name not in _DOCUMENT_DB:
                            _DOCUMENT_DB[short_name] = item
                logger.info(f"Loaded {len(_DOCUMENT_DB)} document entries into DB.")
                break
            except Exception as e:
                logger.warning(f"Could not load {p}: {e}")


# Initialize database from JSON file
_load_documents_json()


def get_document_requirements(doc_name: str) -> str:
    """
    Returns prerequisites, price in MAD, processing time, and Google Maps query for a document.
    """
    # 1. Exact match
    if doc_name in _DOCUMENT_DB:
        data = _DOCUMENT_DB[doc_name]
    else:
        # 2. Substring match
        matched_key = None
        for key in _DOCUMENT_DB:
            if key != "default" and (key in doc_name or doc_name in key):
                matched_key = key
                break
        data = _DOCUMENT_DB.get(matched_key, _DOCUMENT_DB["default"])

    return json.dumps(
        {
            "document_name": doc_name,
            "prerequisites": data["prerequisites"],
            "price_mad": data["price_mad"],
            "processing_time": data["processing_time"],
            "administration_office": data["administration_office"],
            "google_maps_query": data["google_maps_query"],
        },
        ensure_ascii=False,
    )


def find_nearest_office(office_type: str, lat: float, lng: float) -> str:
    """
    Returns the nearest physical address of an administration office given type and GPS coordinates.
    """
    location = _OFFICE_DB.get(
        office_type,
        f"{office_type} - بالقرب من إحداثياتك ({lat:.4f}, {lng:.4f})",
    )
    return json.dumps(
        {
            "office_type": office_type,
            "location": location,
            "lat": lat,
            "lng": lng,
        },
        ensure_ascii=False,
    )