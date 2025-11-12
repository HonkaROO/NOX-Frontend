import { useState } from "react";
import type { UserDto } from "@/lib/api";
import type { UserModalType } from "@/components/modals/SuperAdminModals/UserModal";
import { SearchBar } from "./SearchBar";
import { UserTable } from "./UserTable";
import ChatbotAssistant from "@/components/chatbotkilid/ChatbotAssistant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onDeleteUser,
}: UserManagementContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const filteredUsers = users.filter((user) => {
    const fullName =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName;
    const matchesSearch =
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as "all" | "active" | "inactive")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active Users</SelectItem>
              <SelectItem value="inactive">Inactive Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
