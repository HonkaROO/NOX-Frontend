import { useState, useEffect } from "react";
import { apiClient, type UserDto, type DepartmentDto } from "@/lib/api";
import type { UserModalType } from "@/components/modals/SuperAdminModals/UserModal";

export function useUserManagement() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalType, setUserModalType] = useState<UserModalType>("add");
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  // Fetch users and departments on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, departmentsData] = await Promise.all([
        apiClient.getAllUsers(),
        apiClient.getAllDepartments(),
      ]);
      setUsers(usersData);
      setDepartments(departmentsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserModalOpen = (type: UserModalType, user?: UserDto) => {
    setUserModalType(type);
    setSelectedUser(user || null);
    setUserModalOpen(true);
  };

  const handleUserModalSave = async (data: any) => {
    if (userModalType === "add") {
      const createRequest = {
        userName: data.userName,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        address: data.address || undefined,
        departmentId: parseInt(data.departmentId),
        startDate: data.startDate || undefined,
        employeeId: data.employeeId || undefined,
        role: data.role || undefined,
      };

      const newUser = await apiClient.createUser(createRequest);
      setUsers([...users, newUser]);
    } else if (userModalType === "edit" && selectedUser) {
      const updateRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        address: data.address || undefined,
        departmentId: parseInt(data.departmentId),
        startDate: data.startDate || undefined,
        employeeId: data.employeeId || undefined,
        role: data.role || undefined,
      };

      const updatedUser = await apiClient.updateUser(
        selectedUser.id,
        updateRequest
      );

      // If the API response doesn't include roles, manually add them
      if (
        data.role &&
        (!updatedUser.roles || !updatedUser.roles.includes(data.role))
      ) {
        updatedUser.roles = [data.role];
      }

      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? updatedUser : user
        )
      );
    }

    setUserModalOpen(false);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await apiClient.deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  return {
    users,
    departments,
    loading,
    error,
    userModalOpen,
    userModalType,
    selectedUser,
    setUserModalOpen,
    handleUserModalOpen,
    handleUserModalSave,
    handleDeleteUser,
  };
}
