import { Edit, Trash2 } from "lucide-react";
import type { UserDto } from "@/lib/api";
import type { UserModalType } from "@/components/modals/SuperAdminModals/UserModal";

interface UserTableRowProps {
  user: UserDto;
  onEdit: (type: UserModalType, user: UserDto) => void;
  onDelete: (userId: string) => void;
}

export function UserTableRow({ user, onEdit, onDelete }: UserTableRowProps) {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName;
  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user.userName.slice(0, 2).toUpperCase();

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDelete(user.id);
    }
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-slate-600">
              {initials}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800">
              {fullName}
            </span>
            <span className="text-sm text-slate-500">
              {user.email}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-800">
            {user.departmentName || 'N/A'}
          </span>
          <span className="text-sm text-slate-500">
            {user.employeeId || 'N/A'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-medium text-slate-800">
          {user.roles?.join(', ') || 'User'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit('edit', user)}
            className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Edit user"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete user"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
