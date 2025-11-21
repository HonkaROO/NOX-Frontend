import { FileText, Sparkles, Loader2 } from "lucide-react";
import type { OnboardingMaterial } from "@/lib/api/Onboardin/onboardingService";

const isAiIndexable = (fileName: string): boolean => {
  const aiIndexableTypes = [".pdf", ".json", ".md"];
  const fileExt = "." + fileName.split(".").pop()?.toLowerCase();
  return aiIndexableTypes.includes(fileExt);
};

interface DocumentStatsCardsProps {
  materials: OnboardingMaterial[];
  isLoading: boolean;
}

export function DocumentStatsCards({
  materials,
  isLoading,
}: DocumentStatsCardsProps) {
  const stats = [
    {
      icon: FileText,
      iconColor: "text-blue-600",
      label: "Total Documents",
      value: materials.length,
    },
    {
      icon: Sparkles,
      iconColor: "text-purple-600",
      label: "AI-Searchable",
      value: materials.filter((m) => isAiIndexable(m.fileName)).length,
    },
    {
      icon: FileText,
      iconColor: "text-amber-600",
      label: "Storage Only",
      value: materials.filter((m) => !isAiIndexable(m.fileName)).length,
    },
    {
      icon: FileText,
      iconColor: "text-green-600",
      label: "PDF Files",
      value: materials.filter((m) => m.fileName.endsWith(".pdf")).length,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 pt-12 px-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <Icon size={40} className={stat.iconColor} />
            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">{stat.label}</span>
              <span className="text-2xl font-semibold text-gray-900">
                {isLoading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  stat.value
                )}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
