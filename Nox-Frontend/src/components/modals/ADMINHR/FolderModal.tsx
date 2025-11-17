import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { folderService, taskService, type OnboardingFolder, type OnboardingTask } from "@/lib/api/Onboardin/onboardingService";
import { toast } from "sonner";

export type FolderModalType = 'add' | 'edit';

interface FolderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: FolderModalType;
  folder?: OnboardingFolder;
  onSave?: (folder: OnboardingFolder) => void;
}

export function FolderModal({ open, onOpenChange, type, folder, onSave }: FolderModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<{ title: string; description: string }[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  useEffect(() => {
    if (open && type === 'edit' && folder) {
      loadTasks();
    } else if (open && type === 'add') {
      setTasks([]);
    }
  }, [open, type, folder]);

  const loadTasks = async () => {
    if (!folder) return;
    try {
      const existingTasks = await taskService.getByFolderId(folder.id);
      setTasks(existingTasks.map(task => ({ title: task.title, description: task.description })));
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

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

  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([...tasks, { title: newTaskTitle.trim(), description: newTaskDescription.trim() }]);
      setNewTaskTitle('');
      setNewTaskDescription('');
    }
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (tasks.length === 0) {
      toast.error("Please add at least one task");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
      };

      let savedFolder: OnboardingFolder;

      if (type === 'edit' && folder) {
        // Update existing folder
        savedFolder = await folderService.update(folder.id, data);
        toast.success("Folder updated successfully!");
      } else {
        // Create new folder
        savedFolder = await folderService.create(data);
        toast.success("Folder created successfully!");
      }

      // Handle tasks
      if (type === 'edit' && folder) {
        // Delete existing tasks
        const existingTasks = await taskService.getByFolderId(folder.id);
        await Promise.all(existingTasks.map(task => taskService.delete(task.id)));
      }

      // Create new tasks
      await Promise.all(
        tasks.map(task =>
          taskService.create({
            title: task.title,
            description: task.description,
            folderId: savedFolder.id,
          })
        )
      );

      // Call parent onSave callback
      if (onSave) {
        onSave(savedFolder);
      }

      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save folder", {
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <form onSubmit={handleSave}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Folder Title
              </label>
              <input
                name="title"
                type="text"
                defaultValue={type === 'edit' ? folder?.title : ''}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter folder title"
                required
                disabled={isLoading}
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
                placeholder="Enter folder description"
                rows={3}
                required
                disabled={isLoading}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tasks
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task title"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isLoading}
                  />
                  <input
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Task description (optional)"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={addTask}
                    disabled={isLoading || !newTaskTitle.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {tasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{task.title}</span>
                        {task.description && <span className="text-sm text-gray-600 ml-2">- {task.description}</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTask(index)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : type === 'add' ? 'Add Folder' : 'Update Folder'}
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
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