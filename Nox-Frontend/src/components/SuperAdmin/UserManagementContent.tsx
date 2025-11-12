import { useState } from "react";
import type { UserDto } from "@/lib/api";
import type { UserModalType } from "@/components/modals/SuperAdminModals/UserModal";
import { SearchBar } from "./SearchBar";
import { UserTable } from "./UserTable";
import ChatbotAssistant from "@/components/chatbotkilid/ChatbotAssistant";

interface UserManagementContentProps {
  users: UserDto[];
  onAddUser: () => void;
  onEditUser: (type: UserModalType, user: UserDto) => void;
  onDeleteUser: (userId: string) => void;
}

export function UserManagementContent({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser
}: UserManagementContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName;
    return fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <button
          onClick={onAddUser}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add User
        </button>
      </div>

      <UserTable
        users={filteredUsers}
        onEdit={onEditUser}
        onDelete={onDeleteUser}
      />

      <ChatbotAssistant />
    </div>
  );
}
