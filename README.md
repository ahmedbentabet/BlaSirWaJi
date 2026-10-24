# 🏛️ BlaSirWaJi (بلا سير واجي)

> **دليلك الإداري الذكي للإجراءات والوثائق المغربية — مدعوم بالذكاء الاصطناعي**
> 
> *End-to-End Moroccan Administrative Routing & Cost Estimation Assistant powered by Google Gemini/Gemma AI, FastAPI, and React + Tailwind CSS.*

---

## 🌟 نبذة عن المشروع (About BlaSirWaJi)

المواطن المغربي غالباً ما يواجه تعقيدات إدارية تُعرف شعبياً بـ **"سير واجي"** (كثرة التنقل بين الإدارات لاكتشاف وثائق ناقصة، رسوم غير متوقعة، أو التوجه إلى المصلحة الخاطئة).

تطبيق **"بلا سير واجي"** يحل هذه المعضلة جذرياً:
بمجرد إدخال اسم أي وثيقة أو رخصة إدارية وتحديد موقعك الجغرافي (GPS)، يقوم الذكاء الاصطناعي تلقائياً بتحليل:
1. **سلسلة الوثائق والشروط المسبقة التكرارية** من الجذور (مثل: عقد الازدياد، شهادة السكنى، الصور، التمبر) حتى الوثيقة النهائية.
2. **التكلفة الإجمالية الدقيقة بالدرهم المغربي (MAD)**.
3. **المدة الزمنية المتوقعة لكل خطوة**.
4. **الإدارة المختصة وموقعها الجغرافي الأقرب إليك** مع زر مباشر لخرائط جوجل (Google Maps).

---

## ✨ المميزات الرئيسية (Key Features)

- **🧠 محرك ذكاء اصطناعي مستقل (Autonomous AI Engine)**:
  - لا يعتمد على قاعدة بيانات جامدة، بل يستنتج الإجراءات والشروط والرسوم القانونية لأي وثيقة، حتى لو كانت رخصة نادرة أو غير مدرجة مسبقاً (مثل: *رخصة حفر بئر، رخصة فتح مقهى، رخصة الصيد، شهادات الاستثمار*).
- **📍 توجيه جغرافي ذكي (Geolocation Routing)**:
  - استخدام إحداثيات المستخدم (Latitude / Longitude) لربطه بالمقاطعة، دائرة الشرطة، المحكمة الابتدائية، أو الوكالة الحضرية الأقرب إليه.
- **💰 احتساب الرسوم الرسمية (MAD Cost Breakdown)**:
  - تفصيل دقيق لرسوم كل وثيقة والتنبر الجبائي (Timbre) واحتساب التكلفة الإجمالية للملف كاملاً.
- **🎨 واجهة مستخدم عصرية وفاخرة (Modern Dark Glassmorphism)**:
  - دعم كامل وأصيل للغة العربية وللاتجاه من اليمين إلى اليسار (RTL) مع خطوط Cairo و Inter.
  - شريط بحث ذكي مع إكمال تلقائي (Autocomplete) للوثائق المغربية الأكثر شيوعاً.
  - بطاقات خطوات تفاعلية قابلة للتوسيع (Collapsible Step Cards).
- **🛡️ وضع عدم الاتصال الحتمي (Offline Fallback Guarantee)**:
  - في حال انقطاع الإنترنت أو عدم توفر مفتاح API، يتحول التطبيق تلقائياً إلى خوارزمية DAG حتمية تضمن عدم توقف الخدمة.

---

## 🏗️ البنية التقنية (Architecture & Tech Stack)

```
BlaSirWaJi/
├── src/blasirwaji/             # 🐍 Backend (FastAPI + Google GenAI)
│   ├── main.py                 # FastAPI application & CORS configuration
│   ├── llm_router.py           # AI reasoning engine & multi-model orchestrator
│   ├── tools.py                # Administrative data helpers & coordinate tools
│   └── moroccan_documents.json # Seed dataset of 18 standard Moroccan procedures
├── frontend/                   # ⚛️ Frontend (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBox.jsx       # Search input with RTL autocomplete & GPS
│   │   │   ├── ResultsPanel.jsx    # Step cards, cost banner & Google Maps links
│   │   │   └── LoadingSpinner.jsx  # Glassmorphic pulse loader
│   │   ├── App.jsx                 # Main layout & state coordinator
│   │   └── index.css               # Design system & Tailwind utilities
│   ├── vite.config.js          # Vite config with backend proxy (/api)
│   └── package.json            # Frontend dependencies
├── .env.example                # Environment variables template
├── pyproject.toml              # Python project configuration (uv / pip)
├── Makefile                    # Automation shortcuts (run, install, dev)
└── README.md                   # Project documentation
```

### التقنيات المستخدمة:
- **الواجهة الأمامية (Frontend)**: React 18, Vite, Tailwind CSS, Lucide / Heroicons SVGs.
- **الخادم الخلفي (Backend)**: Python 3.12+, FastAPI, Uvicorn, Google GenAI SDK (`google-genai`), Pydantic, python-dotenv.
- **مدير الحزم (Package Management)**: `uv` (Ultra-fast Python package manager) & `npm`.

---

## 🔑 كيفية الحصول على مفتاح Gemini API (Get Gemini API Key)

يعتمد التطبيق على واجهة برمجة تطبيقات Google GenAI / Gemini لتشغيل نماذج الذكاء الاصطناعي:

1. توجه إلى منصة **[Google AI Studio](https://aistudio.google.com/app/apikey)** وسجل دخولك بحساب Google.
2. اضغط على الزر الأزرق **"Create API Key"** (إنشاء مفتاح API).
3. اختر مشروعاً موجوداً أو أنشئ مشروعاً جديداً بنقرة واحدة (**"Create key in new project"**).
4. انسخ المفتاح المتولد (يبدأ عادة بـ `AIzaSy...` أو المعرف المخصص لحسابك).
5. احتفظ بالمفتاح سرياً ولا ترفعه أبداً إلى GitHub (ملف `.env` محمي تلقائياً عبر `.gitignore`).

---

## ⚡ التشغيل السريع (Local Setup & Installation)

### المتطلبات المسبقة (Prerequisites)
- **Python**: الإصدار 3.12 أو أحدث.
- **Node.js**: الإصدار 18 أو أحدث (مع `npm`).
- **uv** (اختياري لكن مفضل للسرعة): أو استخدام `pip` التقليدي.

---

### 1️⃣ إعداد المستودع والمتغيرات البيئية (Clone & Env Setup)

```bash
# استنساخ المستودع
git clone https://github.com/your-username/BlaSirWaJi.git
cd BlaSirWaJi

# إنشاء ملف البيئة من النموذج
cp .env.example .env
```

افتح ملف `.env` وضع مفتاحك:
```env
GEMINI_API_KEY=your_copied_api_key_here
```

---

### 2️⃣ إعداد وتشغيل الخادم الخلفي (Backend Setup)

#### الطريقة أ: باستخدام `uv` (الموصى به)
```bash
# تثبيت التبعيات ومزامنة البيئة الافتراضية
uv sync

# تشغيل الخادم
uv run uvicorn blasirwaji.main:app --host 0.0.0.0 --port 8000 --reload
```

#### الطريقة ب: باستخدام `pip` و `venv` العادي
```bash
python3 -m venv .venv
source .venv/bin/activate  # على Linux/macOS/WSL
# أو .venv\Scripts\activate على Windows

pip install -e .
uvicorn blasirwaji.main:app --host 0.0.0.0 --port 8000 --reload
```

الخادم الخلفي يعمل الآن على: **`http://localhost:8000`**  
توثيق Swagger التفاعلي متاح على: **`http://localhost:8000/docs`**

---

### 3️⃣ إعداد وتشغيل الواجهة الأمامية (Frontend Setup)

في نافذة طرفية ثانية (Terminal):

```bash
cd frontend

# تثبيت حزم npm
npm install

# تشغيل خادم التطوير
npm run dev
```

الواجهة الأمامية متاحة الآن على: **`http://localhost:5173`**  
*(خادم Vite يقوم تلقائياً بإعادة توجيه طلبات `/api` إلى خادم FastAPI على المنفذ 8000)*.

---

### 4️⃣ بناء النسخة النهائية للإنتاج (Production Build)

```bash
cd frontend
npm run build
```
سيتم توليد الحزمة المحسنة في مجلد `frontend/dist/`.

---

## 📡 توثيق نقطة النهاية البرمجية (API Reference)

### `POST /api/route-document`
النقطة المركزية لمعالجة وتوجيه الوثيقة عبر الذكاء الاصطناعي.

#### Request Body (JSON):
```json
{
  "document_name": "جواز السفر",
  "lat": 34.020882,
  "lng": -6.841650
}
```

#### Response Body (JSON):
```json
{
  "steps": [
    {
      "document_name": "شهادة السكنى",
      "prerequisites": ["نسخة من بطاقة التعريف", "فاتورة الماء أو الكهرباء"],
      "administration_office": "الدائرة الأمنية أو قيادة الدرك الملكي",
      "price_mad": 0,
      "processing_time": "24 إلى 48 ساعة",
      "google_maps_query": "Commune Urbaine Rabat",
      "nearest_location": "الملحقة الإدارية حسان، الرباط"
    },
    {
      "document_name": "البطاقة الوطنية للتعريف الإلكترونية (CNIE)",
      "prerequisites": ["عقد الازدياد", "شهادة السكنى", "صور فوتوغرافية"],
      "administration_office": "المديرية العامة للأمن الوطني (DGSN)",
      "price_mad": 75,
      "processing_time": "من 7 إلى 15 يوماً",
      "google_maps_query": "DGSN Commissariat Police Maroc",
      "nearest_location": "المديرية العامة للأمن الوطني، الرباط"
    },
    {
      "document_name": "تمبر جواز السفر الإلكتروني",
      "prerequisites": ["رقم بطاقة التعريف الوطنية"],
      "administration_office": "القباضة المالية أو بوابة Wajibi",
      "price_mad": 500,
      "processing_time": "فوري",
      "google_maps_query": "Tresorerie Generale du Royaume",
      "nearest_location": "القباضة المالية، الرباط"
    },
    {
      "document_name": "جواز السفر البيومتري",
      "prerequisites": ["البطاقة الوطنية", "التمبر الإلكتروني", "استمارة الطلب"],
      "administration_office": "الملحقة الإدارية / العمالة",
      "price_mad": 0,
      "processing_time": "10 إلى 15 يوماً",
      "google_maps_query": "Prefecture Service Passeport",
      "nearest_location": "عمالة الرباط"
    }
  ],
  "total_cost_mad": 575,
  "total_time_summary": "من 15 إلى 25 يوماً تقريباً"
}
```

---

## 🛠️ أوامر الاختصار (Makefile Shortcuts)

لراحتك، يمكنك استخدام الأوامر التالية من المجلد الرئيسي:

- `make install`: تثبيت تبعيات الخادم والواجهة.
- `make run`: تشغيل خادم FastAPI في وضع التطوير.
- `make dev-frontend`: تشغيل خادم تطوير Vite.
- `make clean`: حذف البيئات المؤقتة ومجلدات الكاش.

---

## 👥 المساهمون والترخيص (License & Authors)

- **المشروع**: تم تطويره خصيصاً للهاكاثون الوطني لتبسيط الإجراءات الإدارية المغربية.
- **الترخيص**: مرخص تحت رخصة [MIT License](LICENSE).