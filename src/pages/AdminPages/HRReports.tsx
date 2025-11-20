import AdminHeader from "@/components/layout/AdminLayout/AdminHeader";
import HRnav from "@/components/layout/AdminLayout/HRnav";
import { Button } from "@/components/ui/button";
import {
  CircleCheckBig,
  ClockAlert,
  ClockCheck,
  Plus,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import ChatbotAssistant from "@/components/chatbotkilid/ChatbotAssistant";

type Employee = {
  name: string;
  email: string;
  initials: string;
  dept: string;
  documents: string;
  status: "Complete" | "Pending" | "At Risk";
};

const EMPLOYEES: Employee[] = [
  {
    name: "John Doe",
    email: "john.smith@npax.com",
    initials: "JD",
    dept: "AADX",
    documents: "8/10",
    status: "Complete",
  },
  {
    name: "John Doe",
    email: "john.smith@npax.com",
    initials: "JD",
    dept: "ERP",
    documents: "5/10",
    status: "Pending",
  },
  {
    name: "John Doe",
    email: "john.smith@npax.com",
    initials: "JD",
    dept: "MCF",
    documents: "9/10",
    status: "Complete",
  },
  {
    name: "John Doe",
    email: "john.smith@npax.com",
    initials: "JD",
    dept: "HRC",
    documents: "3/10",
    status: "At Risk",
  },
  {
    name: "John Doe",
    email: "john.smith@npax.com",
    initials: "JD",
    dept: "AADX",
    documents: "6/10",
    status: "Pending",
  },
];

export default function HRReports() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    dateRange: "last30",
    department: "all",
    status: "all",
    sortBy: "progress",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      case "At Risk":
        return "bg-amber-700 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AdminHeader>
      <div className="p-6">
        <HRnav activePage="HRReports" />

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-semibold">Reports</h1>
            <p className="pt-2">Monitor onboarding compliance</p>
          </div>
          <div className="flex items-center">
            <Button className="bg-white border border-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Convert to CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 pt-12 px-6">
          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <UsersRound size={40} className="text-blue-600" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">Total Employees</span>
              <span className="text-2xl font-semibold text-gray-900">123</span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <ClockAlert size={40} className="text-red-600" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">At Risk</span>
              <span className="text-2xl font-semibold text-gray-900">8</span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <ClockCheck size={40} className="text-gray-800" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">In Progress</span>
              <span className="text-2xl font-semibold text-gray-900">20</span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <CircleCheckBig size={40} className="text-green-600" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">Completed</span>
              <span className="text-2xl font-semibold text-gray-900">100</span>
            </div>
          </div>
        </div>
        

        {/* Employee Table */}
        <div className="px-6 mt-10">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-100 text-sm text-slate-600">
                      <th className="p-4">EMPLOYEE</th>
                      <th className="p-4">DEPARTMENT</th>
                      <th className="p-4">DOCUMENTS</th>
                      <th className="p-4">STATUS</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    {EMPLOYEES.map((emp, index) => (
                      <tr
                        key={index}
                        className="border-t text-sm hover:bg-slate-50"
                      >
                        {/* Employee */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white">
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
                          <p className="font-medium text-slate-900">
                            {emp.dept}
                          </p>
                        </td>

                        {/* Documents */}
                        <td className="p-4">
                          <p className="font-medium text-slate-900">
                            {emp.documents}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                              emp.status
                            )}`}
                          >
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ChatbotAssistant />
    </AdminHeader>
  );
}
