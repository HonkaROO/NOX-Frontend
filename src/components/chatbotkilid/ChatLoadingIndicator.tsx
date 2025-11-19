export default function ChatLoadingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <img
        src="/RealNoxyIcon.png"
        alt="Noxy"
        className="w-8 h-8 rounded-full shrink-0"
      />
      <div className="text-sm bg-white text-slate-700 border border-slate-200 rounded-lg p-3">
        <div className="flex gap-1">
          <div
            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <div
            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}
