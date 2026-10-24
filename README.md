# 🏛️ BlaSirWaJi (بلا سير واجي)

> **Autonomous Moroccan Administrative Document Routing & Cost Estimation Engine**
> 
> *An AI-powered assistant designed to eliminate bureaucratic back-and-forth by computing recursive document prerequisite trees, official government fees in MAD, processing times, and turn-by-turn Google Maps car driving directions.*

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg)](https://fastapi.tiangolo.com)
[![uv](https://img.shields.io/badge/Package%20Manager-uv-purple.svg)](https://github.com/astral-sh/uv)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB.svg)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Overview & Problem Statement

In Morocco, citizens navigating public administrative procedures often suffer from what is colloquially known as **"Sir Wa Ji"** (*سير واجي* — endless back-and-forth between public offices due to missing sub-documents, unexpected stamp fees, or visiting the wrong municipal annex).

**BlaSirWaJi** solves this challenge through an intelligent combination of AI reasoning and GPS geolocation:
1. **Recursive Sub-Document Chains**: Autonomously determines all prerequisite documents from root requirements (e.g., birth records, photographs, residence certificates, tax clearances) up to the target document.
2. **Official Moroccan Fees (MAD)**: Provides accurate breakdowns of administrative stamps (*Timbre*), fees, and total file costs in Moroccan Dirhams.
3. **Turn-by-Turn Car Driving Directions**: Features a direct **Google Maps Car Navigation** button (`travelmode=driving`) routing the user straight to the closest competent administrative office.
4. **Geolocation Office Matching**: Recommends the specific municipal arrondissement, police district (DGSN), court of first instance, or regional agency matching the citizen's GPS coordinates.

---

## ✨ Key Features

- **🧠 Autonomous AI Reasoning Engine**:
  - Dynamically investigates and resolves *any* document, permit, or certificate — including unlisted, commercial, agricultural, and specialized procedures (e.g., *well drilling permits, cafe operating licenses, marine fishing authorizations, building renovations*).
- **🚗 Turn-by-Turn Google Maps Car Directions**:
  - One-click navigation button calculating driving routes directly to the relevant municipal annex or administrative office from the user's current location.
- **📍 Geolocation-Aware Routing**:
  - Automatically captures GPS coordinates (`Latitude`, `Longitude`) via the browser Geolocation API with graceful fallbacks.
- **💰 Comprehensive Cost Calculation**:
  - Aggregates fees across all sequential steps, computing the exact total expenditure in Moroccan Dirhams (MAD).
- **🎨 Modern Dark Glassmorphic Interface**:
  - Built with React 18 and Tailwind CSS, featuring smooth micro-animations, autocomplete dropdowns, collapsible cards, and full RTL layout support.
- **🛡️ Deterministic Offline Fallback**:
  - Seamlessly falls back to an internal recursive DAG resolver if no API key is set or during network disconnections, guaranteeing zero downtime.

---

## ⚡ Super Easy Setup & Run (Powered by `uv`)

We use **[uv](https://github.com/astral-sh/uv)**, the ultra-fast Python package manager. The project is pre-configured so that **if `uv` or `.env` is missing, it will automatically install/create it for you!**

### 1️⃣ One-Command Setup
Clone the repository and run `make setup`:

```bash
git clone https://github.com/your-username/BlaSirWaJi.git
cd BlaSirWaJi

make setup
```

**What `make setup` does automatically:**
1. Checks for `uv`. If not installed, it automatically downloads and installs `uv` via Astral's installer.
2. Checks for `.env`. If not found, it automatically creates it from `.env.example`.
3. Runs `uv sync` to install all Python backend dependencies in seconds.
4. Installs frontend `npm` packages.

---

### 2️⃣ Configure Your Gemini API Key
Edit the newly created `.env` file and add your Google Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> **🔑 How to get a free API key in 60 seconds:**
> 1. Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)** and sign in with Google.
> 2. Click **"Create API Key"** -> **"Create key in new project"**.
> 3. Copy the key into `.env`.

---

### 3️⃣ One-Command Launch (Run Both Backend & Frontend)

```bash
make dev
```

That's it! Both services will start concurrently:
- **Frontend Web App**: `http://localhost:5173`
- **Backend API Server**: `http://localhost:8000`
- **Interactive Swagger API Docs**: `http://localhost:8000/docs`

---

## 🛠️ Alternative Manual Commands (Without Makefile)

If you prefer to run commands manually using the `uv` and `npm` CLI:

### Backend:
```bash
# Install uv (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Sync Python virtualenv & dependencies
uv sync

# Run FastAPI with auto-reload
uv run blasirwaji
```

### Frontend:
```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server
npm run dev
```

### Production Build:
```bash
# Build frontend production bundle & sync dependencies
make build
# or:
cd frontend && npm run build
```

---

## 🏗️ Project Architecture & Structure

```
BlaSirWaJi/
├── assets/                     # Demo video visuals & promotional stills
│   ├── promo_scene.jpg         # Promo image for pitch deck & AI video
│   └── ui_screenshot.jpg       # App screenshot with car directions
├── frontend/                   # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBox.jsx       # Search input with autocomplete & GPS
│   │   │   ├── ResultsPanel.jsx    # Step cards, cost banner & Car Directions
│   │   │   └── LoadingSpinner.jsx  # Glassmorphic pulse loader
│   │   ├── App.jsx                 # Application layout & state management
│   │   └── index.css               # Design system & Tailwind styling utilities
│   ├── vite.config.js          # Vite config with backend proxy (/api)
│   └── package.json            # Frontend dependencies
├── src/blasirwaji/             # Python Backend (FastAPI + Google GenAI)
│   ├── main.py                 # FastAPI application, lifespan & CORS
│   ├── llm_router.py           # Multi-model AI reasoning engine
│   └── tools.py                # Coordinate tools & self-contained fallback
├── .env.example                # Safe environment variables template
├── pyproject.toml              # Python project configuration (uv / pip)
├── Makefile                    # Developer automation shortcuts (setup, dev, run)
└── README.md                   # Complete project documentation
```

---

## 📡 API Reference

### `POST /api/route-document`
Main orchestration endpoint. Accepts a target document name and GPS coordinates, returning the ordered procedural roadmap.

#### Request Body (JSON)
```json
{
  "document_name": "جواز السفر",
  "lat": 34.020882,
  "lng": -6.841650
}
```

#### Response Body (JSON)
```json
{
  "steps": [
    {
      "document_name": "شهادة السكنى (Residence Certificate)",
      "prerequisites": ["CNIE Copy", "Water/Electricity Bill"],
      "administration_office": "Police District or Gendarmerie",
      "price_mad": 0,
      "processing_time": "24 to 48 hours",
      "google_maps_query": "Commune Urbaine Rabat",
      "nearest_location": "Annexe Administrative Hassan, Rabat"
    },
    {
      "document_name": "بطاقة التعريف الوطنية (CNIE)",
      "prerequisites": ["Birth Certificate", "Residence Certificate", "Photos"],
      "administration_office": "Direction Générale de la Sûreté Nationale (DGSN)",
      "price_mad": 75,
      "processing_time": "7 to 15 days",
      "google_maps_query": "DGSN Commissariat Police Maroc",
      "nearest_location": "DGSN Document Service, Rabat"
    },
    {
      "document_name": "تمبر جواز السفر الإلكتروني (Passport Stamp Duty)",
      "prerequisites": ["National ID Number"],
      "administration_office": "Treasury or Wajibi Payment Portal",
      "price_mad": 500,
      "processing_time": "Instant",
      "google_maps_query": "Tresorerie Generale du Royaume",
      "nearest_location": "Trésorerie Générale, Rabat"
    },
    {
      "document_name": "جواز السفر البيومتري (Biometric Passport)",
      "prerequisites": ["Valid CNIE", "Electronic Stamp Receipt", "Application Form"],
      "administration_office": "Administrative Annexe / Prefecture",
      "price_mad": 0,
      "processing_time": "10 to 15 days",
      "google_maps_query": "Prefecture Service Passeport",
      "nearest_location": "Prefecture of Rabat"
    }
  ],
  "total_cost_mad": 575,
  "total_time_summary": "Approximately 15 to 25 business days"
}
```

---

## 🛠️ Summary of Makefile Commands

| Command | Action |
|---|---|
| `make setup` | **Complete automated setup**: checks/installs `uv`, creates `.env`, syncs Python, installs `npm` |
| `make dev` | **Runs both** Backend (`http://localhost:8000`) and Frontend (`http://localhost:5173`) concurrently |
| `make run` | Runs the FastAPI backend server with hot-reload (`uv run blasirwaji`) |
| `make run-frontend` | Runs the Vite frontend development server |
| `make build` | Builds the frontend production bundle into `frontend/dist/` |
| `make clean` | Removes cache directories, build artifacts, and virtual environments |

---

## 👥 License

This project is licensed under the [MIT License](LICENSE).