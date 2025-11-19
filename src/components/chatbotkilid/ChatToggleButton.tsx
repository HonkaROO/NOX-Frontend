import { ChevronDown } from "lucide-react";

interface ChatToggleButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function ChatToggleButton({ onClick, isOpen }: ChatToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 bg-linear-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center justify-center text-white"
      aria-label={isOpen ? "Close Noxy Assistant" : "Open Noxy Assistant"}
    >
      <div className="relative w-14 h-14 flex items-center justify-center">
        {/* Noxy Icon - visible when closed */}
        <img
          src="/NoxyIcon.png"
          alt="Bot"
          className={`absolute w-14 h-14 rounded-full transition-all duration-500 ${
            isOpen
              ? "opacity-0 rotate-360 "
              : "opacity-100 rotate-0 "
          }`}
        />

        {/* ChevronDown Icon - visible when open */}
        <ChevronDown
          size={54}
          
          className={`absolute transition-all duration-500  ${
            isOpen
              ? "opacity-100 rotate-360 "
              : "opacity-0 rotate-0 "
          }`}
        />
      </div>
    </button>
  );
}
