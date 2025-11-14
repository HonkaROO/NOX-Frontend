import { useState } from "react";
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

const EMPLOYEES = [
  {
    name: "John Doe",
    email: "john.smith@npax.com",
    dept: "Advance Analytics",
    role: "Data Analyst",
    initials: "JD",
  },
  {
    name: "John Doe",
    email: "john.smith@npax.com",
    dept: "ERP",
    role: "System Administrator",
    initials: "JD",
  },
  {
    name: "John Doe",
    email: "john.smith@npax.com",
    dept: "Manufacturing",
    role: "Production Manager",
    initials: "JD",
  },
  {
    name: "John Doe",
    email: "john.smith@npax.com",
    dept: "HR Companion",
    role: "HR Specialist",
    initials: "JD",
  },
  {
    name: "John Doe",
    email: "john.smith@npax.com",
    dept: "Advance Analytics",
    role: "Data Quality Analyst",
    initials: "JD",
  },
];

export default function HREmployeeManagement() {
  const navigate = useNavigate();
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [employeeModalType, setEmployeeModalType] = useState<"add" | "edit">("add");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const handleEmployeeModalOpen = (type: "add" | "edit", employee?: any) => {
    setEmployeeModalType(type);
    setSelectedEmployee(employee || null);
    setEmployeeModalOpen(true);
  };

  const handleEmployeeModalSave = async (data: any) => {
    // TODO: Implement save logic, probably using apiClient.createUser or similar
    console.log("Saving employee:", data);
    // For now, just close
  };
  return (
    <AdminHeader>
      <div className="p-6">
        <HRnav activePage="HREmployeeManagement" />

        <h1 className="text-4xl font-semibold">Employee Management</h1>
        <p className="pt-2">Manage employee accounts and onboarding progress</p>

        <div className="grid grid-cols-4 gap-6 pt-12 px-6">
          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <UsersRound size={40} className="text-blue-600" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">Total Employees</span>
              <span className="text-2xl font-semibold text-gray-900">123</span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <UserRoundPlus size={40} className="text-green-600" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">New This Month</span>
              <span className="text-2xl font-semibold text-gray-900">123</span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <FileUser size={40} className="text-gray-800" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">Onboarding</span>
              <span className="text-2xl font-semibold text-gray-900">123</span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <CircleCheckBig size={40} className="text-green-600" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">Completed</span>
              <span className="text-2xl font-semibold text-gray-900">123</span>
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
                    {EMPLOYEES.map((emp, index) => (
                      <tr
                        key={index}
                        className="border-t text-sm hover:bg-slate-50"
                      >
                        {/* Employee */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 bg-violet-100 text-violet-600">
                              <AvatarFallback className="font-medium">
                                {emp.initials}
                              </AvatarFallback>
                            </Avatar>

                            <div>
                              <p className="font-semibold text-slate-900">
                                {emp.name}
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
                            {emp.dept}
                          </p>
                          <p className="text-xs text-slate-600">{emp.role}</p>
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
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        <EmployeeModal
          open={employeeModalOpen}
          onOpenChange={setEmployeeModalOpen}
          type={employeeModalType}
          employee={selectedEmployee}
          departments={[]} // TODO: Fetch departments
          onSave={handleEmployeeModalSave}
        />
      </div>
    </AdminHeader>
  );
}
