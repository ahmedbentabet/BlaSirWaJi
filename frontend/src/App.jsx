import { useState } from 'react'
import SearchBox from './components/SearchBox'
import ResultsPanel from './components/ResultsPanel'
import LoadingSpinner from './components/LoadingSpinner'

const API_BASE = '/api'

export default function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [lastQuery, setLastQuery] = useState('')

  const handleSearch = async (documentName, lat, lng) => {
    setIsLoading(true)
    setError(null)
    setResults(null)
    setLastQuery(documentName)

    try {
      const response = await fetch(`${API_BASE}/route-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_name: documentName, lat, lng }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || 'حدث خطأ أثناء معالجة الطلب')
      }

      const data = await response.json()
      setResults(data)

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      setError(err.message || 'حدث خطأ غير متوقع. يرجى المحاولة مجدداً.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-dark-900/80" id="main-header">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/30 text-lg">
              🏛️
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight gradient-text font-arabic">بلا سير واجي</h1>
              <p className="text-white/40 text-xs font-arabic">دليلك الإداري الذكي</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-blue text-xs">Beta</span>
            <span className="hidden sm:inline text-white/30 text-xs font-arabic">مدعوم بـ Gemma 4</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <section className="text-center py-16 space-y-6" aria-label="قسم البحث الرئيسي">
            <div className="inline-flex items-center gap-2 badge-blue mb-4" id="hero-badge">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-slow" />
              <span className="font-arabic text-sm">الإجراءات الإدارية المغربية — مبسّطة</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-arabic leading-tight">
              <span className="text-white">أي وثيقة تريد؟</span>
              <br />
              <span className="gradient-text">بلا سير واجي</span>
            </h2>

            <p className="text-white/50 text-lg font-arabic max-w-xl mx-auto leading-relaxed">
              أدخل اسم الوثيقة التي تحتاجها، وسنرشدك خطوة بخطوة إلى جميع المتطلبات والمكاتب القريبة منك.
            </p>

            {/* Search Box */}
            <div className="pt-4">
              <SearchBox onSubmit={handleSearch} isLoading={isLoading} />
            </div>

            {/* Quick suggestions */}
            {!results && !isLoading && (
              <div className="flex flex-wrap gap-2 justify-center pt-2" id="quick-suggestions">
                {['عقد الازدياد', 'جواز السفر', 'رخصة السياقة', 'شهادة السكنى'].map((doc) => (
                  <button
                    key={doc}
                    id={`suggestion-${doc}`}
                    onClick={() => handleSearch(doc, 34.020882, -6.841650)}
                    className="px-4 py-2 rounded-full text-sm font-arabic text-white/60 border border-white/10 hover:border-white/20 hover:text-white/90 hover:bg-white/5 transition-all duration-200"
                  >
                    {doc}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Error */}
          {error && (
            <div
              className="max-w-2xl mx-auto glass-card border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3 text-right animate-fade-up"
              id="error-message"
              role="alert"
              dir="rtl"
            >
              <span className="text-2xl flex-shrink-0">⚠️</span>
              <div>
                <p className="text-red-300 font-semibold font-arabic">{error}</p>
                <p className="text-red-400/70 text-sm mt-1 font-arabic">تأكد من تشغيل الخادم الخلفي وصحة الاتصال</p>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && <LoadingSpinner />}

          {/* Results */}
          {results && !isLoading && (
            <div>
              <div className="text-center mb-6" dir="rtl">
                <p className="text-white/40 text-sm font-arabic">
                  نتائج البحث عن: <span className="text-brand-300 font-semibold">"{lastQuery}"</span>
                </p>
              </div>
              <ResultsPanel data={results} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 px-4 text-center" id="main-footer">
        <p className="text-white/25 text-xs font-arabic">
          BlaSirWaJi © 2025 — هاكاثون المغرب — مدعوم بـ Google Gemma 4
        </p>
      </footer>
    </div>
  )
}