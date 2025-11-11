import { useState } from "react";
import { Plus, Edit, Trash2, Users, Settings } from "lucide-react";
import { DepartmentModal, type DepartmentModalType } from "@/components/modals/SuperAdminModals/DepartmentModal";
import { SuperAdminStats } from "@/components/modals/SuperAdminModals/SuperAdminStats";
import { SuperAdminNavigation } from "@/components/modals/SuperAdminModals/SuperAdminNavigation";
import SuperAdminHeader from "@/components/layout/SuperAdminLayout/SuperAdminHeader";
import { useNavigate } from "react-router-dom";


export default function Index() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Advanced Analytics Digital Transformation",
      abbr: "AADX",
      users: 25,
      color: "bg-purple-500",
    },
    {
      id: 2,
      name: "Enterprise Resource Planning",
      abbr: "ERP",
      users: 28,
      color: "bg-green-500",
    },
    {
      id: 3,
      name: "Manufacturing Communication Frame",
      abbr: "MCF",
      users: 34,
      color: "bg-red-500",
    },
    {
      id: 4,
      name: "Human Resource Companion",
      abbr: "HRC",
      users: 36,
      color: "bg-yellow-500",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<DepartmentModalType>('add');
  const [selectedDept, setSelectedDept] = useState<any>(null);

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
      value: "123",
    },
    {
      icon: (
        <img
          src="activeUserIcon.png"
          alt="Active Users"
          className="w-[70px] h-[60px]"
        />
      ),
      label: "Active Users",
      value: "40",
    },
    {
      icon: (
        <img
          src="departmentsIcon.png"
          alt=""
          className="w-[70px] h-[60px]"
        />
      ),
      label: "Departments",
      value: "4",
    },
  ];





  const handleModalOpen = (type: DepartmentModalType, dept?: any) => {
    setModalType(type);
    setSelectedDept(dept || null);
    setModalOpen(true);
  };

  const handleModalSave = (data: any) => {
    if (modalType === 'add') {
      const newDept = {
        id: Date.now(),
        name: data.name,
        abbr: data.name.split(' ').map((word: string) => word[0]).join('').slice(0, 4).toUpperCase(),
        users: 0,
        color: `bg-${['purple', 'green', 'red', 'yellow', 'blue', 'indigo'][Math.floor(Math.random() * 6)]}-500`,
      };
      setDepartments([...departments, newDept]);
    } else if (modalType === 'edit' && selectedDept) {
      setDepartments(departments.map(dept =>
        dept.id === selectedDept.id
          ? { ...dept, name: data.name, abbr: data.name.split(' ').map((word: string) => word[0]).join('').slice(0, 4).toUpperCase() }
          : dept
      ));
    }
  };

  const handleDeleteDepartment = (id: any) => {
    setDepartments(departments.filter(dept => dept.id !== id));
  };

 
  return (
    <SuperAdminHeader>
      

      <main className="px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
        <SuperAdminStats stats={stats} />
        <SuperAdminNavigation />




        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Department Management
            </h2>
            <button
              onClick={() => handleModalOpen('add')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Department
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => (
              <div key={dept.id} className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div
                  className={`w-12 h-12 rounded-full ${dept.color} flex items-center justify-center flex-shrink-0 shadow-sm`}
                >
                  <span className="text-white text-sm font-semibold">
                    {dept.abbr}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="text-base font-semibold text-slate-800 leading-tight">
                    {dept.name}
                  </div>
                  <div className="text-sm text-slate-600">
                    {dept.users} users
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleModalOpen('view-users', dept)}
                    className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="View Users"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleModalOpen('edit', dept)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Department"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDepartment(dept.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Department"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant Button (Bottom Right) */}


      <button  onClick={() => navigate("/AIassistant")} className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-700 to-indigo-900 hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] rounded-full shadow-lg transition-all flex flex-col items-center justify-center text-white">
        <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/f3bc07a8c5c425567b5ddbdcf2cc3b48aaca8522?width=72"
                  alt="Bot"
                  className="w-9 h-9 rounded-full"
                />
        

        <span className="text-[10px] font-semibold">ASK NOXY</span>
      </button>

        <DepartmentModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          type={modalType}
          department={selectedDept}
          onSave={handleModalSave}
        />
      </main>



    </SuperAdminHeader>
  );
}
