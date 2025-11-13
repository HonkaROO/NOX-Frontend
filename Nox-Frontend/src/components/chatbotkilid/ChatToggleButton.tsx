interface ChatToggleButtonProps {
  onClick: () => void;
}

export default function ChatToggleButton({ onClick }: ChatToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 bg-linear-to-br from-blue-700 to-indigo-900 hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] rounded-full shadow-lg transition-all flex flex-col items-center justify-center text-white z-50"
      aria-label="Open Noxy Assistant"
    >
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/f3bc07a8c5c425567b5ddbdcf2cc3b48aaca8522?width=72"
        alt="Bot"
        className="w-9 h-9 rounded-full"
      />
      <span className="text-[10px] font-semibold">ASK NOXY</span>
    </button>
  );
}
