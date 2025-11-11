import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type DepartmentModalType = 'add' | 'edit' | 'view-users';

interface DepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: DepartmentModalType;
  department?: any;
  onSave?: (data: any) => void;
}

export function DepartmentModal({ open, onOpenChange, type, department, onSave }: DepartmentModalProps) {
  const getTitle = () => {
    switch (type) {
      case 'add':
        return 'Add New Department';
      case 'edit':
        return 'Edit Department';
      case 'view-users':
        return `Users in ${department?.name || 'Department'}`;
      default:
        return '';
    }
  };

  const handleSave = (data: any) => {
    if (onSave) {
      onSave(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
       {/* Resizing the modal size is this DialogContent*/}
      <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {type === 'view-users' ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Array.from({ length: department?.users || 0 }, (_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-slate-200">
                  <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-slate-600">
                      {String.fromCharCode(65 + (i % 26))}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800">
                      User {i + 1}
                    </div>
                    <div className="text-xs text-slate-500">
                      user{i + 1}@company.com
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    Active
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const data = {
                name: formData.get('name') as string,
              };
              handleSave(data);
            }}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department Name
                </label>
                <input
                  name="name"
                  type="text"
                  defaultValue={type === 'edit' ? department?.name : ''}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter department name"
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {type === 'add' ? 'Add' : 'Update'} Department
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}