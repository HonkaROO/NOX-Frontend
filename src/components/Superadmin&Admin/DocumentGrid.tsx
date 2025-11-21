import { FileText, Sparkles, Loader2 } from "lucide-react";
import type { OnboardingMaterial } from "@/lib/api/Onboardin/onboardingService";

const isAiIndexable = (fileName: string): boolean => {
  const aiIndexableTypes = [".pdf", ".json", ".md"];
  const fileExt = "." + fileName.split(".").pop()?.toLowerCase();
  return aiIndexableTypes.includes(fileExt);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
};

interface DocumentGridProps {
  materials: OnboardingMaterial[];
  isLoading: boolean;
  onDelete: (materialId: number) => void;
}

export function DocumentGrid({
  materials,
  isLoading,
  onDelete,
}: DocumentGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 px-4 md:px-6">
        <div className="col-span-full flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 px-4 md:px-6">
        <div className="col-span-full text-center py-12 text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No documents found</p>
          <p className="text-sm">Upload a document to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 px-4 md:px-6">
      {materials.map((material) => (
        <div
          key={material.id}
          className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col"
        >
          <div className="flex items-start gap-3 mb-3">
            <div
              className={`p-2 rounded ${
                isAiIndexable(material.fileName)
                  ? "bg-purple-100"
                  : "bg-gray-100"
              }`}
            >
              <FileText
                className={
                  isAiIndexable(material.fileName)
                    ? "text-purple-600"
                    : "text-gray-600"
                }
                size={24}
              />
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                {material.fileType}
              </span>
              {isAiIndexable(material.fileName) ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 flex items-center gap-1">
                  <Sparkles size={10} />
                  AI-Searchable
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
                  Storage Only
                </span>
              )}
            </div>
          </div>

          <h3
            className="font-semibold text-sm mb-1 truncate"
            title={material.fileName}
          >
            {material.fileName}
          </h3>
          <p className="text-xs text-gray-600 mb-1">
            Uploaded: {formatDate(material.createdAt)}
          </p>
          {material.updatedAt && (
            <p className="text-xs text-gray-600 mb-1">
              Updated: {formatDate(material.updatedAt)}
            </p>
          )}

          <div className="flex gap-2 mt-auto pt-3">
            <a
              href={material.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded hover:bg-indigo-700 text-center"
            >
              View
            </a>
            <button
              onClick={() => onDelete(material.id)}
              className="px-3 bg-red-600 text-white text-sm py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
