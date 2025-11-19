import AdminHeader from "@/components/layout/AdminLayout/AdminHeader";
import HRnav from "@/components/layout/AdminLayout/HRnav";
import { useNavigate } from "react-router-dom";
import {
  CircleCheckBig,
  FileUser,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

type Emp = { name: string; dept: string; pct: number; initials: string };

type Item = { id: string; title: string; employee: string };

const EMPLOYEES: Emp[] = [
  { name: "John Doe", dept: "AADX", pct: 75, initials: "JD" },
  { name: "John Smith", dept: "ERP", pct: 50, initials: "JS" },
  { name: "Sean Combs", dept: "MCF", pct: 69, initials: "SC" },
  { name: "Jeffrey Einstein", dept: "HRC", pct: 9, initials: "JE" },
  { name: "John Doex", dept: "AADX", pct: 75, initials: "JD" },
  { name: "John Smithz", dept: "ERP", pct: 50, initials: "JS" },
  { name: "Seane Combs", dept: "MCF", pct: 69, initials: "SC" },
  { name: "Jeffreyn Stone", dept: "HRC", pct: 9, initials: "JS" },
];

const data: Item[] = [
  { id: "1", title: "Pag-IBIG Registration", employee: "John Doe" },
  { id: "2", title: "PhilHealth Registration", employee: "Jeffrey Einstein" },
  { id: "3", title: "Pag-IBIG Registration", employee: "Sean Combs" },
  { id: "4", title: "Job Description", employee: "John Doe" },
  { id: "5", title: "Department Tools Setup", employee: "Jeffrey Einstein" },
  { id: "6", title: "Employee Handbook Review", employee: "Sean Combs" },
];
export default function HRDashboard() {
  const navigate = useNavigate();
  return (
    <AdminHeader>
      <div className="p-6">
        <HRnav activePage="HRDashboard" />
        <h1 className="text-4xl font-semibold">HR Dashboard</h1>
        <p className="pt-2">
          Monitor employee onboarding progress and manage HR operations
        </p>
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
        <div className="grid grid-cols-2 gap-12 mx-24 ">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Recent Employees</CardTitle>
              <button className="text-indigo-600 text-sm hover:underline">
                View all
              </button>
            </CardHeader>

            <CardContent className="space-y-5">
              {EMPLOYEES.map((e, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 bg-indigo-100 text-indigo-600">
                    <AvatarFallback className="font-medium">
                      {e.initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between">
                      <div className="truncate">
                        <p className="text-sm font-semibold leading-tight truncate">
                          {e.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {e.dept}
                        </p>
                      </div>
                      <span className="ml-3 text-xs text-muted-foreground">
                        {e.pct}%
                      </span>
                    </div>

                    <Progress
                      value={e.pct}
                      className="mt-2 h-1.5 bg-indigo-100"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            {/* Header */}
            <CardHeader className="flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">Pending Documents</CardTitle>
              <button className="text-sm font-medium text-violet-600 hover:text-violet-700">
                View all
              </button>
            </CardHeader>

            {/* List */}
            <CardContent className="space-y-3">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 py-3 px-4"
                >
                  <div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.employee}</p>
                  </div>

                  <button className="rounded-lg border border-violet-300 bg-white px-3 py-1.5 text-sm font-medium text-violet-600 hover:bg-violet-50">
                    Review
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminHeader>
  );
}
