import { SuperAdminStats } from "@/components/modals/SuperAdminModals/SuperAdminStats";
import { SuperAdminNavigation } from "@/components/modals/SuperAdminModals/SuperAdminNavigation";
import { UserModal } from "@/components/modals/SuperAdminModals/UserModal";
import SuperAdminHeader from "@/components/layout/SuperAdminLayout/SuperAdminHeader";
import { UserManagementContent } from "@/components/SuperAdmin";
import { useUserManagement } from "@/hooks/useUserManagement";

export default function SuperAdminUserManagement() {
  const {
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
  } = useUserManagement();

  const activeUsers = users.filter(user => user.isActive);
  const activeDepartments = departments.filter(dept => dept.isActive);

  const stats = [
    {
      icon: (
        <img
          src="SmileEmployees.png"
          alt="Employees Icon"
          className="w-[70px] h-[60px]"
        />
      ),
      label: "Total Employees",
      value: activeUsers.length.toString(),
    },
    {
      icon: (
        <img
          src="departmentsIcon.png"
          alt="Departments Icon"
          className="w-[70px] h-[60px]"
        />
      ),
      label: "Departments",
      value: activeDepartments.length.toString(),
    },
  ];

  if (loading) {
    return (
      <SuperAdminHeader>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </SuperAdminHeader>
    );
  }

  if (error) {
    return (
      <SuperAdminHeader>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </SuperAdminHeader>
    );
  }

  return (
    <SuperAdminHeader>
      <main className="px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
        <SuperAdminStats stats={stats} />
        <SuperAdminNavigation />
        <UserManagementContent
          users={users}
          onAddUser={() => handleUserModalOpen('add')}
          onEditUser={handleUserModalOpen}
          onDeleteUser={handleDeleteUser}
        />
      </main>
      <UserModal
        open={userModalOpen}
        onOpenChange={setUserModalOpen}
        type={userModalType}
        user={selectedUser}
        departments={activeDepartments}
        onSave={handleUserModalSave}
      />
    </SuperAdminHeader>
  );
}
