// components/modals/TaskModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GovernmentFormsContent } from "./content/GovernmentFormsContent";
import { HRPoliciesContent } from "./content/HRPoliciesContent";
import { ITSetupContent } from "./content/ITSetupContent";
import { TrainingProgramsContent } from "./content/TrainingProgramsContent";
import { DepartmentOrientationContent } from "./content/DepartmentOrientationContent";
import { DocumentationContent } from "./content/DocumentationContent";

export type TaskCategory =
  | 'government-forms'
  | 'hr-policies'
  | 'it-setup'
  | 'training-programs'
  | 'department-orientation'
  | 'documentation';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: TaskCategory | null;
}

const CATEGORY_TITLES: Record<TaskCategory, string> = {
  'government-forms': 'Government Requirements Progress',
  'hr-policies': 'HR Policies Progress',
  'it-setup': 'IT Setup Progress',
  'training-programs': 'Training Programs Progress',
  'department-orientation': 'Department Orientation Progress',
  'documentation': 'Documentation Progress',
};

export function TaskModal({ open, onOpenChange, category }: TaskModalProps) {
  if (!category) return null;

  const ContentComponent = {
    'government-forms': GovernmentFormsContent,
    'hr-policies': HRPoliciesContent,
    'it-setup': ITSetupContent,
    'training-programs': TrainingProgramsContent,
    'department-orientation': DepartmentOrientationContent,
    'documentation': DocumentationContent,
  }[category];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] w-[98vw] p-0">
        <DialogHeader className="px-8 pt-8  border-b border-gray-200">
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            {CATEGORY_TITLES[category]}
          </DialogTitle>
        </DialogHeader>
        <div className="px-8 pb-8 h-full w-full overflow-hidden">
          <ContentComponent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
