import { ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface ChatHeaderProps {
  onClose: () => void;
}

export default function ChatHeader({ onClose }: ChatHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-linear-to-r from-orange-400 to-indigo-800 text-white px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img
          src="/RealNoxyIcon.png"
          alt="Noxy"
          className="w-6 h-6 rounded-full"
        />
        <h3 className="text-sm font-semibold">Noxy Assistant</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="px-1" onClick={() => navigate("/AIassistant")}>
                <ExternalLink className="mx-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open in Ai Assistant Tab</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <button
        onClick={onClose}
        className="text-white hover:text-slate-200 text-xl font-bold"
        aria-label="Close chat"
      >
        ✕
      </button>
    </div>
  );
}
