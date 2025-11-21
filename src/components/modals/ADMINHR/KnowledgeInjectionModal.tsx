import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, FileText, Sparkles, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { chromaDBService } from "@/lib/api/ChatBot/InjectionService";

// Azure Blob Storage upload helper (direct upload without database save)
const uploadToAzureDirect = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("token");
  const response = await fetch(
    `${
      import.meta.env.VITE_API_URL || "http://localhost:5164"
    }/api/onboarding/materials/inject-knowledge`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Upload failed" }));
    throw new Error(error.message || "Failed to upload file");
  }

  const data = await response.json();
  return data.url;
};

interface KnowledgeInjectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function KnowledgeInjectionModal({
  open,
  onOpenChange,
}: KnowledgeInjectionModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStep, setUploadStep] = useState<
    "idle" | "injecting" | "complete"
  >("idle");
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [chunksAdded, setChunksAdded] = useState<number>(0);

  // AI-indexable file types (supported by Noxy AI backend)
  const AI_INDEXABLE_TYPES = [".pdf", ".json", ".md"];

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));

    if (!AI_INDEXABLE_TYPES.includes(extension)) {
      toast.error("Invalid file type", {
        description:
          "Only PDF, JSON, and Markdown files are supported for knowledge injection",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast.error("File too large", {
        description: "File size must not exceed 10MB",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setUploadStep("idle");
      setDocumentUrl("");
      setChunksAdded(0);
      toast.success("File selected", {
        description: `${file.name} - Ready for knowledge injection ✨`,
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    // Validation - Either file OR URL must be provided
    if (!selectedFile && !documentUrl.trim()) {
      toast.error("File or URL required", {
        description: "Please either upload a file or provide a document URL",
      });
      return;
    }

    setIsUploading(true);
    setUploadStep("injecting");

    try {
      let urlToInject = documentUrl;

      // If file is selected, upload it first to get Azure URL
      if (selectedFile) {
        toast.info("Uploading file to Azure...");
        urlToInject = await uploadToAzureDirect(selectedFile);
        setDocumentUrl(urlToInject);
        toast.info("File uploaded, now injecting into AI...");
      }

      // Inject the URL into ChromaDB
      const injectionResult = await chromaDBService.injectDocument(urlToInject);

      if (injectionResult.success) {
        setChunksAdded(injectionResult.documents_added);
        setUploadStep("complete");

        toast.success("Knowledge injection complete!", {
          description: `Successfully injected ${injectionResult.documents_added} chunks into AI knowledge base`,
        });

        // Wait a moment to show success state, then close
        setTimeout(() => {
          resetForm();
          onOpenChange(false);
        }, 2000);
      } else {
        throw new Error(injectionResult.message);
      }
    } catch (error: any) {
      setUploadStep("idle");
      toast.error("Knowledge injection failed", {
        description: error.message || "Failed to inject document into AI",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setUploadStep("idle");
    setDocumentUrl("");
    setChunksAdded(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px] max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="text-purple-600" size={24} />
            Knowledge Injection
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Upload a file directly OR paste an existing Azure URL. Documents
            won't appear in user-facing document management.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Area */}
          <div>
            <Label className="text-sm">Upload Document (Option 1)</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer mt-1 ${
                dragActive
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() =>
                !isUploading &&
                document.getElementById("file-upload-injection")?.click()
              }
            >
              <input
                id="file-upload-injection"
                type="file"
                accept=".pdf,.json,.md"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
                disabled={isUploading}
              />
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="text-purple-600" size={32} />
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Sparkles size={12} className="text-purple-600" />
                      <span className="text-xs text-purple-600 font-medium">
                        AI Knowledge Base Ready
                      </span>
                    </div>
                  </div>
                  {!isUploading && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setUploadStep("idle");
                      }}
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <Sparkles
                    className="mx-auto mb-2 text-purple-400"
                    size={32}
                  />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, JSON, or Markdown (Max 10MB)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Document URL Input */}
          <div>
            <Label htmlFor="document-url" className="text-sm">
              Paste Azure Blob Storage URL (Option 2)
            </Label>
            <input
              id="document-url"
              type="url"
              placeholder="https://noxstorageacct01.blob.core.windows.net/..."
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
              disabled={isUploading || !!selectedFile}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              {selectedFile
                ? "File selected for upload - URL field disabled"
                : "Paste an existing Azure Blob Storage URL to inject"}
            </p>
          </div>

          {/* Progress Indicator */}
          {uploadStep !== "idle" && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                {uploadStep === "injecting" && (
                  <>
                    <Loader2
                      className="animate-spin text-purple-600"
                      size={20}
                    />
                    <span className="text-sm font-medium text-purple-900">
                      Injecting into AI knowledge base...
                    </span>
                  </>
                )}
                {uploadStep === "complete" && (
                  <>
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-sm font-medium text-green-900">
                      Knowledge injection complete!
                    </span>
                  </>
                )}
              </div>

              {documentUrl && (
                <div className="text-xs text-gray-600 break-all bg-white rounded p-2">
                  <strong>Document URL:</strong> {documentUrl}
                </div>
              )}

              {chunksAdded > 0 && (
                <div className="text-xs text-purple-700">
                  <strong>{chunksAdded}</strong> chunks added to knowledge base
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              className="px-6"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="px-6 bg-purple-600 hover:bg-purple-700"
              disabled={
                isUploading ||
                uploadStep === "complete" ||
                (!selectedFile && !documentUrl.trim())
              }
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Injecting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  Inject Knowledge
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
