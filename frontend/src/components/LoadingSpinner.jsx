export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16" id="loading-spinner" aria-live="polite">
      {/* Animated rings */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-brand-400/30 animate-ping" style={{ animationDelay: '200ms' }} />
        <div className="absolute inset-4 rounded-full border-2 border-brand-300/40 animate-spin" style={{ animationDuration: '1.5s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-brand-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-white font-semibold text-lg font-arabic">
          جاري تحليل طلبك...
        </p>
        <p className="text-white/50 text-sm font-arabic">
          نقوم بالبحث عن المتطلبات والمكاتب القريبة منك
        </p>
      </div>

      {/* Shimmer steps placeholder */}
      <div className="w-full max-w-3xl space-y-3 mt-4" dir="rtl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-5" style={{ opacity: 1 - (i - 1) * 0.25 }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full shimmer-bg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded-lg shimmer-bg" />
                <div className="h-3 w-32 rounded-lg shimmer-bg" />
              </div>
              <div className="h-6 w-16 rounded-full shimmer-bg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
