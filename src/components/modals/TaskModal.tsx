// components/modals/TaskModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskProgressContent } from "./content/TaskProgressContent";

export type TaskCategory =
  | "government-forms"
  | "hr-policies"
  | "it-setup"
  | "training-programs"
  | "department-orientation"
  | "documentation";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: TaskCategory | null;
  folderId?: number;
  folderTitle?: string;
}

const CATEGORY_TITLES: Record<TaskCategory, string> = {
  "government-forms": "Government Requirements Progress",
  "hr-policies": "HR Policies Progress",
  "it-setup": "IT Setup Progress",
  "training-programs": "Training Programs Progress",
  "department-orientation": "Department Orientation Progress",
  documentation: "Documentation Progress",
};

export function TaskModal({
  open,
  onOpenChange,
  category,
  folderId,
  folderTitle,
}: TaskModalProps) {
  if (!category) return null;

  const title = folderTitle || CATEGORY_TITLES[category];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] w-[98vw] p-0 max-w-[98vw]">
        <DialogHeader className="px-8 pt-8 pb-4 border-b border-gray-200">
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="px-8 pb-8 h-[calc(90vh-6rem)] overflow-hidden">
          {folderId ? (
            <TaskProgressContent folderId={folderId} folderTitle={title} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No folder selected</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
