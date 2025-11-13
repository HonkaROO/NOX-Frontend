// components/UploadDocumentDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadDocumentDialog({
  open,
  onOpenChange,
}: UploadDocumentDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    dueDate: "",
    steps: [] as string[],
  });

  const handleSubmit = () => {
    console.log("Uploading document:", formData);
    // Handle upload logic here
    onOpenChange(false);
  };

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ""] });
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  const removeStep = (index: number) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: newSteps });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[450px] h-[92vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Upload Document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Document Title */}
          <div>
            <Label htmlFor="title" className="text-sm">
              Document Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1"
            />
          </div>

          {/* Document Type */}
          <div>
            <Label htmlFor="type" className="text-sm">
              Document Type
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Government">Government</SelectItem>
                <SelectItem value="Department">Department</SelectItem>
                <SelectItem value="IT Setup">IT Setup</SelectItem>
                <SelectItem value="HR Policies">HR Policies</SelectItem>
                <SelectItem value="Training Programs">
                  Training Programs
                </SelectItem>
                <SelectItem value="Documentation">Documentation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Short Description */}
          <div>
            <Label htmlFor="description" className="text-sm">
              Short Description
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1"
            />
          </div>

          {/* Due Date */}
          <div>
            <Label htmlFor="dueDate" className="text-sm">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              placeholder="e.g., October 20, 2025"
              className="mt-1"
            />
          </div>

          {/* Steps To Complete */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">Steps To Complete</Label>
              <Button
                size="sm"
                variant="default"
                className="h-7 text-xs"
                onClick={addStep}
              >
                + Add Step
              </Button>
            </div>
            <div className="space-y-2">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    onClick={() => removeStep(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>


          {/* Upload Area */}
          <div>
            <Label className="text-sm">Document Upload</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer mt-1">
              <Upload className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="text-sm text-gray-600">Upload</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="px-6 bg-green-600 hover:bg-green-700"
            >
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}