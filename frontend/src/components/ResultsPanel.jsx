import { useState } from 'react'

function StepNumber({ n }) {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/50 flex items-center justify-center text-brand-300 text-sm font-bold">
      {n}
    </div>
  )
}

function CarDirectionsButton({ destination, stepIdx }) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination || 'المقاطعة الحضرية المغرب')}&travelmode=driving`
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      id={`car-directions-btn-${stepIdx}`}
      className="directions-btn"
      aria-label={`فتح مسار القيادة بالسيارة على خرائط جوجل إلى: ${destination}`}
    >
      {/* Car Icon */}
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
      <span>مسار القيادة بالسيارة</span>
    </a>
  )
}

function MapsButton({ query, stepIdx }) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || 'المقاطعة الحضرية المغرب')}`
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      id={`maps-btn-${stepIdx}`}
      className="maps-btn"
      aria-label={`فتح الموقع على خرائط جوجل: ${query}`}
    >
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      <span>موقع الإدارة</span>
    </a>
  )
}

function ProcessingBadge({ time }) {
  const isInstant = time && (time.toLowerCase().includes('instanta') || time.toLowerCase().includes('instant') || time.includes('فوري'))
  return (
    <span className={isInstant ? 'badge-green' : 'badge-amber'}>
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
      {time || 'غير محدد'}
    </span>
  )
}

export default function ResultsPanel({ data }) {
  const [expanded, setExpanded] = useState(null)

  if (!data) return null

  const { steps = [], total_cost_mad = 0, total_time_summary = '' } = data

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 space-y-6 animate-fade-up" id="results-panel" dir="rtl">
      {/* Summary Banner */}
      <div className="glass-card p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-2xl shadow-lg shadow-brand-500/20">
            📋
          </div>
          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">إجمالي الخطوات</p>
            <p className="text-white font-bold text-2xl">{steps.length} <span className="text-white/60 text-base font-normal">وثيقة</span></p>
          </div>
        </div>
        <div className="h-px sm:h-12 sm:w-px bg-white/10 self-stretch sm:self-auto" />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
            💰
          </div>
          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">التكلفة الإجمالية</p>
            <p className="text-white font-bold text-2xl">{total_cost_mad} <span className="text-emerald-400 text-base font-semibold">درهم</span></p>
          </div>
        </div>
        <div className="h-px sm:h-12 sm:w-px bg-white/10 self-stretch sm:self-auto" />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
            ⏱️
          </div>
          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">الوقت الإجمالي</p>
            <p className="text-white font-semibold text-sm leading-tight max-w-[200px]">{total_time_summary}</p>
          </div>
        </div>
      </div>

      {/* Step Cards */}
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const destinationQuery = step.nearest_location || step.google_maps_query || step.administration_office
          return (
            <div
              key={`${step.document_name}-${idx}`}
              id={`step-card-${idx}`}
              className="step-card"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Card Header */}
              <button
                type="button"
                className="flex items-center gap-3 justify-between w-full text-right group cursor-pointer"
                onClick={() => setExpanded(expanded === idx ? null : idx)}
                aria-expanded={expanded === idx}
                aria-controls={`step-details-${idx}`}
                id={`step-toggle-${idx}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <StepNumber n={idx + 1} />
                  <h3 className="text-white font-bold text-lg group-hover:text-brand-200 transition-colors">
                    {step.document_name}
                  </h3>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {step.price_mad > 0 ? (
                    <span className="badge-blue">{step.price_mad} درهم</span>
                  ) : (
                    <span className="badge bg-white/10 text-white/60 border border-white/10">مجاني</span>
                  )}
                  <svg
                    className={`w-4 h-4 text-white/40 transition-transform duration-200 ${expanded === idx ? 'rotate-180 text-brand-300' : ''}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </button>

              {/* Collapsed preview */}
              {expanded !== idx && (
                <div className="flex items-center justify-between gap-3 text-white/50 text-sm pr-11 flex-wrap pt-1">
                  <div className="flex items-center gap-2 truncate">
                    <span>📍</span>
                    <span className="truncate">{step.administration_office}</span>
                    <span className="mx-2 opacity-30">•</span>
                    <ProcessingBadge time={step.processing_time} />
                  </div>
                  <div className="flex items-center gap-2">
                    <CarDirectionsButton destination={destinationQuery} stepIdx={idx} />
                  </div>
                </div>
              )}

              {/* Expanded Details */}
              {expanded === idx && (
                <div
                  id={`step-details-${idx}`}
                  className="space-y-4 pt-3 pr-11 border-t border-white/5 mt-1"
                >
                  {/* Prerequisites */}
                  {step.prerequisites && step.prerequisites.length > 0 && (
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-widest mb-2">📋 الوثائق المطلوبة (الشروط المسبقة)</p>
                      <ul className="space-y-1.5">
                        {step.prerequisites.map((prereq, pi) => (
                          <li key={pi} className="flex items-center gap-2 text-white/80 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                            {prereq}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Office & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
                      <p className="text-white/40 text-xs mb-1">📍 مكتب الإدارة المختصة</p>
                      <p className="text-white/90 text-sm font-medium">{step.administration_office}</p>
                      {step.nearest_location && (
                        <p className="text-white/50 text-xs mt-1.5 leading-relaxed">{step.nearest_location}</p>
                      )}
                    </div>
                    <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
                      <p className="text-white/40 text-xs mb-1">⏱️ مدة المعالجة</p>
                      <div className="mt-1">
                        <ProcessingBadge time={step.processing_time} />
                      </div>
                    </div>
                  </div>

                  {/* Cost & Action row */}
                  <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 text-sm">💰 التكلفة الرسمية:</span>
                      <span className={`font-bold text-lg ${step.price_mad > 0 ? 'text-brand-300' : 'text-emerald-400'}`}>
                        {step.price_mad > 0 ? `${step.price_mad} درهم` : 'مجاني'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CarDirectionsButton destination={destinationQuery} stepIdx={idx} />
                      <MapsButton query={step.google_maps_query || step.administration_office} stepIdx={idx} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}