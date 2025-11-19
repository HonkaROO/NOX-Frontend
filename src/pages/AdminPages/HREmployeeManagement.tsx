import { useState, useEffect } from "react";
import AdminHeader from "@/components/layout/AdminLayout/AdminHeader";
import HRnav from "@/components/layout/AdminLayout/HRnav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CircleCheckBig,
  FileUser,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { EmployeeModal } from "@/components/modals/ADMINHR/EmployeeModal";
import ChatbotAssistant from "@/components/chatbotkilid/ChatbotAssistant";

import { apiClient, type UserDto, type DepartmentDto } from "@/lib/api";

const EMPLOYEES: UserDto[] = [];

export default function HREmployeeManagement() {
  const navigate = useNavigate();
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [employeeModalType, setEmployeeModalType] = useState<"add" | "edit">(
    "add"
  );
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [users, setUsers] = useState<UserDto[]>(EMPLOYEES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);

  const handleEmployeeModalOpen = (type: "add" | "edit", employee?: any) => {
    setEmployeeModalType(type);
    setSelectedEmployee(employee || null);
    setEmployeeModalOpen(true);
  };

  const handleEmployeeModalSave = async (data: any) => {
    try {
      // Add new employee
      if (employeeModalType === "add") {
        // If the modal indicated this is an existing employee, try to link/update the existing account
        if (data.isExisting === "true" || data.isExisting === true) {
          // Find existing user by email or username
          const allUsers = await apiClient.getAllUsers();
          const existing = allUsers.find(
            (u) =>
              (u.email &&
                data.email &&
                u.email.toLowerCase() === data.email.toLowerCase()) ||
              (u.userName &&
                data.userName &&
                u.userName.toLowerCase() === data.userName.toLowerCase())
          );

          if (!existing) {
            const msg = "No existing user found with that email or username.";
            setError(msg);
            throw new Error(msg);
          }

          if (
            !window.confirm(
              `User with email ${existing.email} already exists. Assign them to the selected department?`
            )
          ) {
            return;
          }

          const updateRequest: any = {
            departmentId: data.departmentId
              ? parseInt(data.departmentId)
              : undefined,
            employeeId: data.employeeId || undefined,
            startDate: data.startDate || undefined,
            phone: data.phone || undefined,
            address: data.address || undefined,
          };

          const updated = await apiClient.updateUser(
            existing.id,
            updateRequest
          );
          setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
        } else {
          const createRequest = {
            userName: data.userName,
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone || undefined,
            address: data.address || undefined,
            departmentId: data.departmentId
              ? parseInt(data.departmentId)
              : undefined,
            startDate: data.startDate || undefined,
            employeeId: data.employeeId || undefined,
            role: "User",
          };

          const newUser = await apiClient.createUser(createRequest);
          setUsers([...users, newUser]);
        }
      } else if (employeeModalType === "edit" && selectedEmployee) {
        const updateRequest = {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || undefined,
          address: data.address || undefined,
          departmentId: data.departmentId
            ? parseInt(data.departmentId)
            : undefined,
          startDate: data.startDate || undefined,
          employeeId: data.employeeId || undefined,
        };

        const updatedUser = await apiClient.updateUser(
          selectedEmployee.id,
          updateRequest
        );
        setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      }

      setEmployeeModalOpen(false);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      // Re-throw so modal shows message via catch in modal if provided
      throw err;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [usersData, departmentsData] = await Promise.all([
          apiClient.getAllUsers(),
          apiClient.getAllDepartments(),
        ]);

        setUsers(usersData || []);
        // Filter to active departments so the select doesn't show inactive ones
        const activeDepartments = (departmentsData || []).filter(
          (d) => d.isActive
        );
        setDepartments(activeDepartments);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeUsers = users.filter((u) => u.isActive);
  const totalEmployees = activeUsers.length;

  const now = new Date();
  const newThisMonth = activeUsers.filter((u) => {
    if (!u.createdAt) return false;
    const created = new Date(u.createdAt);
    return (
      created.getFullYear() === now.getFullYear() &&
      created.getMonth() === now.getMonth()
    );
  }).length;

  // Use emailConfirmed as a rudimentary onboarding flag: not confirmed = onboarding, confirmed = completed
  const onboardingCount = activeUsers.filter((u) => !u.emailConfirmed).length;
  const completedCount = activeUsers.filter((u) => u.emailConfirmed).length;
  return (
    <AdminHeader>
      <div className="p-6">
        <HRnav activePage="HREmployeeManagement" />

        <h1 className="text-4xl font-semibold">Employee Management</h1>
        <p className="pt-2">Manage employee accounts and onboarding progress</p>

        <div className="grid grid-cols-4 gap-6 pt-12 px-6">
          {error && (
            <div className="col-span-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <UsersRound size={40} className="text-blue-600" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">Total Employees</span>
              <span className="text-2xl font-semibold text-gray-900">
                {loading ? "..." : totalEmployees}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <UserRoundPlus size={40} className="text-green-600" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">New This Month</span>
              <span className="text-2xl font-semibold text-gray-900">
                {loading ? "..." : newThisMonth}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <FileUser size={40} className="text-gray-800" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">Onboarding</span>
              <span className="text-2xl font-semibold text-gray-900">
                {loading ? "..." : onboardingCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <CircleCheckBig size={40} className="text-green-600" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">Completed</span>
              <span className="text-2xl font-semibold text-gray-900">
                {loading ? "..." : completedCount}
              </span>
            </div>
          </div>
        </div>
        <Separator className="my-12" />
        <div className="flex justify-center items-center gap-4 mt-12">
          <Card className="rounded-2xl shadow-lg max-w-7xl w-4xl p-6">
            {/* Header */}
            <CardHeader className="flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">Employee List</CardTitle>
              <CardAction>
                <Button
                  onClick={() => handleEmployeeModalOpen("add")}
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                >
                  + Add Employee
                </Button>
              </CardAction>
            </CardHeader>

            {/* Table */}
            <CardContent>
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-100 text-sm text-slate-600">
                      <th className="p-6">EMPLOYEE</th>
                      <th className="p-4">DEPARTMENT</th>
                      <th className="p-4">ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(loading ? EMPLOYEES : users).map((emp, index) => {
                      const name =
                        `${emp.firstName || ""} ${emp.lastName || ""}`.trim() ||
                        emp.userName ||
                        emp.email;
                      const initials = name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();

                      return (
                        <tr
                          key={emp.id || index}
                          className="border-t text-sm hover:bg-slate-50"
                        >
                          {/* Employee */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 bg-violet-100 text-violet-600">
                                <AvatarFallback className="font-medium">
                                  {initials}
                                </AvatarFallback>
                              </Avatar>

                              <div>
                                <p className="font-semibold text-slate-900">
                                  {name}
                                </p>
                                <p className="text-xs text-slate-600">
                                  {emp.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Department */}
                          <td className="p-4">
                            <p className="font-semibold text-slate-900">
                              {emp.departmentName || "-"}
                            </p>
                            <p className="text-xs text-slate-600">
                              {emp.roles?.[0] || ""}
                            </p>
                          </td>

                          {/* Actions */}
                          <td className="p-4">
                            <div className="flex items-center gap-3 text-slate-700">
                              <button className="hover:text-violet-600">
                                <Pencil className="h-5 w-5" />
                              </button>
                              <button className="hover:text-red-600">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        <ChatbotAssistant />
        <EmployeeModal
          open={employeeModalOpen}
          onOpenChange={setEmployeeModalOpen}
          type={employeeModalType}
          employee={selectedEmployee}
          departments={departments}
          onSave={handleEmployeeModalSave}
        />
      </div>
    </AdminHeader>
  );
}
