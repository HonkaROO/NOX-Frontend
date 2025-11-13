import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type FolderModalType = 'add' | 'edit';

interface FolderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: FolderModalType;
  folder?: any;
  onSave?: (data: any) => void;
}

export function FolderModal({ open, onOpenChange, type, folder, onSave }: FolderModalProps) {
  const getTitle = () => {
    switch (type) {
      case 'add':
        return 'Add New Folder';
      case 'edit':
        return 'Edit Folder';
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
              description: formData.get('description') as string,
            };
            handleSave(data);
          }}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Folder Name
              </label>
              <input
                name="name"
                type="text"
                defaultValue={type === 'edit' ? folder?.name : ''}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter folder name"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={type === 'edit' ? folder?.description || '' : ''}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter folder description (optional)"
                rows={3}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {type === 'add' ? 'Add' : 'Update'} Folder
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