import { useState, useRef, useEffect } from 'react'

const MOROCCAN_DOCUMENTS = [
  'عقد الازدياد',
  'شهادة السكنى',
  'نسخة السجل العدلي',
  'بطاقة التعريف الوطنية',
  'جواز السفر',
  'رخصة السياقة',
  'شهادة التسجيل في الحالة المدنية',
  'شهادة طبية',
]

export default function SearchBox({ onSubmit, isLoading }) {
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [filtered, setFiltered] = useState([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef(null)

  useEffect(() => {
    if (query.trim() === '') {
      setFiltered(MOROCCAN_DOCUMENTS)
    } else {
      setFiltered(MOROCCAN_DOCUMENTS.filter((doc) => doc.includes(query.trim())))
    }
    setActiveIndex(-1)
  }, [query])

  const handleSelect = (doc) => {
    setQuery(doc)
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (!showDropdown) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && filtered[activeIndex]) {
        handleSelect(filtered[activeIndex])
      } else {
        handleSubmit(e)
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const doc = query.trim()
    if (!doc) return
    if (!navigator.geolocation) {
      onSubmit(doc, 34.020882, -6.841650)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => onSubmit(doc, pos.coords.latitude, pos.coords.longitude),
      () => onSubmit(doc, 34.020882, -6.841650),
      { timeout: 5000 }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto" id="search-form">
      <div className="relative">
        <div className="relative flex items-center">
          <span className="absolute right-4 text-brand-400 text-xl pointer-events-none z-10">🔍</span>
          <input
            ref={inputRef}
            id="document-search-input"
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowDropdown(true) }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="مثال: عقد الازدياد، جواز السفر..."
            className="w-full pr-12 pl-32 py-4 rounded-2xl text-right text-lg bg-dark-700/80 backdrop-blur-sm border border-white/10 text-white placeholder-white/30 outline-none focus:border-brand-500/50 focus:bg-dark-700 focus:shadow-lg focus:shadow-brand-500/10 transition-all duration-300 font-arabic"
            dir="rtl"
            autoComplete="off"
            aria-label="ابحث عن وثيقة"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
          />
          <button
            type="submit"
            id="search-submit-btn"
            disabled={isLoading || !query.trim()}
            className="absolute left-2 btn-primary py-2.5 px-5 text-sm"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                جاري...
              </span>
            ) : 'ابحث'}
          </button>
        </div>
        {showDropdown && filtered.length > 0 && (
          <div
            className="autocomplete-dropdown absolute top-full mt-2 w-full z-50 glass-card border border-white/15 overflow-hidden shadow-2xl shadow-black/50"
            role="listbox"
            id="autocomplete-listbox"
          >
            {filtered.map((doc, idx) => (
              <button
                key={doc}
                type="button"
                id={`autocomplete-option-${idx}`}
                role="option"
                aria-selected={activeIndex === idx}
                onMouseDown={() => handleSelect(doc)}
                className={`w-full text-right px-5 py-3 text-sm font-arabic transition-colors duration-150 border-b border-white/5 last:border-0 flex items-center gap-3 justify-end ${
                  activeIndex === idx ? 'bg-brand-500/20 text-white font-semibold' : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{doc}</span>
                <span className="text-white/30 text-xs flex-shrink-0">📄</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </form>
  )
}