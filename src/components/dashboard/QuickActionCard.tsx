// components/dashboard/QuickActionCard.tsx
interface QuickActionCardProps {
  title: string;
  description: string;
  progress: number;
  onClick: () => void;
}

export function QuickActionCard({ title, description, progress, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-left w-full"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
        {title} Progress
      </h3>
      <p className="text-sm text-gray-600 mb-4 text-center">
        {description}
      </p>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-700">{progress}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-indigo-600 h-1.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </button>
  );
}
