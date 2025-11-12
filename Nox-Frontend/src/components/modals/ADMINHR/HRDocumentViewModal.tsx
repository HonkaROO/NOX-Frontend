import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Check, X, Eye, FileText } from "lucide-react";

interface Document {
  id: number;
  name: string;
  uploadedBy: string;
  date: string;
  size: string;
  categories: string[];
  status: string;
}

interface HRDocumentViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onApprove?: (document: Document) => void;
  onReject?: (document: Document) => void;
}

export default function HRDocumentViewModal({
  open,
  onOpenChange,
  document,
  onApprove,
  onReject,
}: HRDocumentViewModalProps) {
  const [showConfirmApprove, setShowConfirmApprove] = useState(false);
  const [showConfirmReject, setShowConfirmReject] = useState(false);

  if (!document) return null;

  const handleDownload = () => {
    // Mock download functionality
    console.log("Downloading document:", document.name);
    // In a real app, this would trigger a file download
  };

  const handleApproveClick = () => {
    setShowConfirmApprove(true);
  };

  const handleRejectClick = () => {
    setShowConfirmReject(true);
  };

  const confirmApprove = () => {
    onApprove?.(document);
    setShowConfirmApprove(false);
    onOpenChange(false);
  };

  const confirmReject = () => {
    onReject?.(document);
    setShowConfirmReject(false);
    onOpenChange(false);
  };

  const cancelConfirm = () => {
    setShowConfirmApprove(false);
    setShowConfirmReject(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[600px] h-[92vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Eye size={24} />
            Document Preview: {document.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Document Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Uploaded by:</span> {document.uploadedBy}
              </div>
              <div>
                <span className="font-medium">Date:</span> {document.date}
              </div>
              <div>
                <span className="font-medium">Size:</span> {document.size}
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  document.status === "approved"
                    ? "bg-green-100 text-green-600"
                    : document.status === "pending"
                    ? "bg-pink-100 text-pink-600"
                    : "bg-orange-100 text-orange-600"
                }`}>
                  {document.status}
                </span>
              </div>
            </div>
            <div className="mt-2">
              <span className="font-medium">Categories:</span>
              <div className="flex gap-1 mt-1">
                {document.categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <div className="border border-gray-200 rounded-lg h-96 bg-white">
            <div className="p-8 text-center text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Document Preview</p>
              <p className="text-sm">This is a placeholder for the document preview.</p>
              <p className="text-sm">In a real application, this would display the actual document content.</p>
            </div>
          </div>

          {/* Confirmation Dialog */}
          {(showConfirmApprove || showConfirmReject) && (
            <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800 mb-4">
                Are you sure you want to {showConfirmApprove ? "approve" : "reject"} "{document.name}"?
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={cancelConfirm}
                  className="px-4"
                >
                  Cancel
                </Button>
                <Button
                  onClick={showConfirmApprove ? confirmApprove : confirmReject}
                  className={`px-4 ${
                    showConfirmApprove
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {showConfirmApprove ? "Approve" : "Reject"}
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!(showConfirmApprove || showConfirmReject) && (
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Download Document
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="px-6"
                >
                  Close
                </Button>
                {document.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleRejectClick}
                      className="px-6 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X size={16} className="mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={handleApproveClick}
                      className="px-6 bg-green-600 hover:bg-green-700"
                    >
                      <Check size={16} className="mr-2" />
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}