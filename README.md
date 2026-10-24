# 🏛️ BlaSirWaJi

> **Autonomous Moroccan Administrative Document Routing & Cost Estimation Engine**
> 
> *A full-stack, AI-powered assistant designed to eliminate bureaucratic back-and-forth by computing recursive document prerequisite trees, official government fees in MAD, processing times, and real-time Google Maps driving directions.*

---

## 🌟 Overview & Problem Statement

In Morocco, citizens navigating public administrative procedures often suffer from what is colloquially known as **"Sir Wa Ji"** (*سير واجي* — endless back-and-forth between public offices due to missing sub-documents, unexpected stamp fees, or visiting the wrong municipal annex).

**BlaSirWaJi** solves this challenge through an intelligent pair of AI reasoning and GPS geolocation:
1. **Recursive Sub-Document Chains**: Autonomously determines all prerequisite documents from root requirements (e.g., birth records, photographs, residence certificates, tax clearances) up to the target document.
2. **Real Official Moroccan Fees (MAD)**: Provides accurate breakdowns of administrative stamps (*Timbre*), fees, and total file costs in Moroccan Dirhams.
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

## 🏗️ Architecture & Tech Stack

```
BlaSirWaJi/
├── src/blasirwaji/             # Python Backend (FastAPI + Google GenAI)
│   ├── main.py                 # FastAPI application, lifespan & CORS
│   ├── llm_router.py           # Multi-model AI reasoning engine
│   ├── tools.py                # Administrative data helpers & coordinate tools
├── frontend/                   # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBox.jsx       # Search input with autocomplete & GPS detection
│   │   │   ├── ResultsPanel.jsx    # Step cards, cost banner & Car Directions button
│   │   │   └── LoadingSpinner.jsx  # Glassmorphic pulse loader
│   │   ├── App.jsx                 # Application layout & state management
│   │   └── index.css               # Design system & Tailwind styling utilities
│   ├── vite.config.js          # Vite configuration with backend proxy (/api)
│   └── package.json            # Frontend dependencies
├── .env.example                # Environment variables template
├── pyproject.toml              # Python project configuration (uv / pip)
├── Makefile                    # Automation shortcuts (run, install, dev)
└── README.md                   # Project documentation
```

### Technologies:
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide/Heroicons SVG components.
- **Backend**: Python 3.12+, FastAPI, Uvicorn, Google GenAI SDK (`google-genai`), Pydantic, python-dotenv.
- **Package Management**: `uv` (high-performance Python package manager) and `npm`.

---

## 🔑 How to Get a Google Gemini API Key

The application utilizes Google GenAI / Gemini models for dynamic administrative reasoning:

1. Visit **[Google AI Studio](https://aistudio.google.com/app/apikey)** and sign in with your Google account.
2. Click the **"Create API Key"** button.
3. Select an existing Google Cloud project or choose **"Create key in new project"**.
4. Copy the generated API key.
5. Create your `.env` file and paste the key:
   ```bash
   cp .env.example .env
   ```
   Add your key inside `.env`:
   ```env
   GEMINI_API_KEY=your_copied_api_key_here
   ```
   *(Note: `.env` is listed in `.gitignore` and is never committed to GitHub).*

---

## ⚡ Quickstart Guide (Local Setup & Run)

### Prerequisites
- **Python**: Version 3.12 or newer.
- **Node.js**: Version 18 or newer (with `npm`).
- **uv** (recommended for speed) or standard `pip`.

---

### Step 1: Clone the Repository & Configure Environment

```bash
git clone https://github.com/your-username/BlaSirWaJi.git
cd BlaSirWaJi

cp .env.example .env
```

Edit `.env` to include your `GEMINI_API_KEY`.

---

### Step 2: Backend Setup & Launch

#### Option A: Using `uv` (Recommended)
```bash
# Sync dependencies in a dedicated virtual environment
uv sync

# Launch the FastAPI backend server
uv run uvicorn blasirwaji.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Option B: Using standard `pip` & `venv`
```bash
python3 -m venv .venv
source .venv/bin/activate  # On Linux/macOS/WSL
# or .venv\Scripts\activate on Windows

pip install -e .
uvicorn blasirwaji.main:app --host 0.0.0.0 --port 8000 --reload
```

- **Backend API**: `http://localhost:8000`
- **Interactive Swagger Documentation**: `http://localhost:8000/docs`

---

### Step 3: Frontend Setup & Launch

In a second terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- *(The Vite dev server automatically proxies all `/api` requests to `http://localhost:8000`)*.

---

### Step 4: Production Build (Optional)

```bash
cd frontend
npm run build
```
Optimized static bundles will be compiled to `frontend/dist/`.

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

## 🛠️ Makefile Shortcuts

For convenience, you can execute common operations from the project root:

- `make install`: Install both backend and frontend dependencies.
- `make run`: Run the FastAPI backend in development mode with auto-reload.
- `make dev-frontend`: Run the Vite frontend development server.
- `make clean`: Remove cached bytecode and temporary virtual environment artifacts.

---

## 👥 License

This project is licensed under the [MIT License](LICENSE).