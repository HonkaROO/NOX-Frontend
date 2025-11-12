import type { UserDto } from "@/lib/api";
import type { UserModalType } from "@/components/modals/SuperAdminModals/UserModal";
import { UserTableRow } from "./UserTableRow";

interface UserTableProps {
  users: UserDto[];
  onEdit: (type: UserModalType, user: UserDto) => void;
  onDelete: (userId: string) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-800 uppercase tracking-wide">
                User
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-800 uppercase tracking-wide">
                Department
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-800 uppercase tracking-wide">
                Role
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-800 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
