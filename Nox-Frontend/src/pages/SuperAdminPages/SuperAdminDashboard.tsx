import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Users, Settings } from "lucide-react";
import { DepartmentModal, type DepartmentModalType } from "@/components/modals/SuperAdminModals/DepartmentModal";
import { SuperAdminStats } from "@/components/modals/SuperAdminModals/SuperAdminStats";
import { SuperAdminNavigation } from "@/components/modals/SuperAdminModals/SuperAdminNavigation";
import SuperAdminHeader from "@/components/layout/SuperAdminLayout/SuperAdminHeader";
import ChatbotAssistant from "@/components/chatbotkilid/ChatbotAssistant";
import { useNavigate } from "react-router-dom";
import { apiClient, type DepartmentDto } from "@/lib/api";


export default function Index() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState<DepartmentDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<DepartmentModalType>('add');
    const [selectedDept, setSelectedDept] = useState<DepartmentDto | null>(null);

    useEffect(() => {
      const fetchDepartments = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await apiClient.getAllDepartments();
          // Filter to show only active departments and sort by creation date (oldest first)
          const activeDepartments = data
            .filter(dept => dept.isActive)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          setDepartments(activeDepartments);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch departments');
        } finally {
          setLoading(false);
        }
      };

      fetchDepartments();
    }, []);

  const totalEmployees = departments.reduce((sum, dept) => sum + dept.userCount, 0);
  const totalDepartments = departments.length;

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
      value: totalEmployees.toString(),
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
      value: totalDepartments.toString(),
    },
  ];





  const handleModalOpen = (type: DepartmentModalType, dept?: any) => {
    setModalType(type);
    setSelectedDept(dept || null);
    setModalOpen(true);
  };

  const handleModalSave = async (data: any) => {
    try {
      if (modalType === 'add') {
        const newDept = await apiClient.createDepartment({
          name: data.name,
          description: data.description,
        });
        setDepartments([...departments, newDept]);
      } else if (modalType === 'edit' && selectedDept) {
        const updatedDept = await apiClient.updateDepartment(selectedDept.id, {
          name: data.name,
          description: data.description,
        });
        setDepartments(departments.map(dept =>
          dept.id === selectedDept.id ? updatedDept : dept
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save department');
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await apiClient.deleteDepartment(id);
        // Refresh the departments list to get updated data from backend
        const data = await apiClient.getAllDepartments();
        const activeDepartments = data
          .filter(dept => dept.isActive)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setDepartments(activeDepartments);
        setError(null); // Clear any previous errors
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete department');
        // Don't modify local state if API call fails
      }
    }
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
               disabled={loading}
             >
               <Plus className="w-4 h-4" />
               Add Department
             </button>
           </div>
           {error && (
             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
               <p className="text-red-800 text-sm">{error}</p>
             </div>
           )}
           {loading ? (
             <div className="flex items-center justify-center py-8">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
               <span className="ml-2 text-slate-600">Loading departments...</span>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => {
              const abbr = dept.name.split(' ').map(word => word[0]).join('').slice(0, 4).toUpperCase();
              const colors = ['bg-purple-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-indigo-500'];
              const color = colors[dept.id % colors.length];

              return (
                <div key={dept.id} className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div
                    className={`w-12 h-12 rounded-full ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}
                  >
                    <span className="text-white text-sm font-semibold">
                      {abbr}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="text-base font-semibold text-slate-800 leading-tight">
                      {dept.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      {dept.userCount} users
                    </div>
                    {dept.description && (
                      <div className="text-xs text-slate-500 mt-1">
                        {dept.description}
                      </div>
                    )}
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
            );
            })}
            </div>
          )}
        </div>
        <ChatbotAssistant />



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
