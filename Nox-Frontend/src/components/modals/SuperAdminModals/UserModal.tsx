import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type UserModalType = 'add' | 'edit';

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: UserModalType;
  user?: any;
  departments?: any[];
  onSave?: (data: any) => void;
}

export function UserModal({ open, onOpenChange, type, user, departments = [], onSave }: UserModalProps) {
  const getTitle = () => {
    switch (type) {
      case 'add':
        return 'Add New User';
      case 'edit':
        return 'Edit User';
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
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const data = {
              name: formData.get('name') as string,
              email: formData.get('email') as string,
              department: formData.get('department') as string,
              jobTitle: formData.get('jobTitle') as string,
              userRole: formData.get('userRole') as string,
            };
            handleSave(data);
          }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  defaultValue={type === 'edit' ? user?.name : ''}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  defaultValue={type === 'edit' ? user?.email : ''}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>

            {/* Password Field - only visible in Add mode */}
            {type === "add" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter password"
                  required
                />
              </div>
            )}





            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department
                </label>
                <select
                  name="department"
                  defaultValue={type === 'edit' ? user?.department : ''}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Job Title
                </label>
                <input
                  name="jobTitle"
                  type="text"
                  defaultValue={type === 'edit' ? user?.jobTitle : ''}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter job title"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role
              </label>
              <select
                name="userRole"
                defaultValue={type === 'edit' ? user?.userRole : ''}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select Role</option>
                <option value="Employee">Employee</option>
                <option value="HR">HR</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {type === 'add' ? 'Add' : 'Update'} User
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
        </div>
      </DialogContent>
    </Dialog>
  );
}