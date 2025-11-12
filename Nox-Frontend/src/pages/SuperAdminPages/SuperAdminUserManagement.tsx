import { useState } from "react";
import { Plus, Edit, Trash2, Users, Settings } from "lucide-react";
import { SuperAdminStats } from "@/components/modals/SuperAdminModals/SuperAdminStats";
import { SuperAdminNavigation } from "@/components/modals/SuperAdminModals/SuperAdminNavigation";
import { UserModal, type UserModalType } from "@/components/modals/SuperAdminModals/UserModal";
import SuperAdminHeader from "@/components/layout/SuperAdminLayout/SuperAdminHeader";
import { useNavigate } from "react-router-dom";
import ChatbotAssistant from "@/components/chatbotkilid/ChatbotAssistant";

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  jobTitle: string;
  userRole: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.smith@npax.com",
    department: "Advance Analytics",
    jobTitle: "Data Analyst",
    role: "Employee",
    userRole: "Employee",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john.smith@npax.com",
    department: "ERP",
    jobTitle: "System Administrator",
    role: "Employee",
    userRole: "Employee",
  },
  {
    id: "3",
    name: "John Doe",
    email: "john.smith@npax.com",
    department: "Manufacturing",
    jobTitle: "Production Manager",
    role: "Employee",
    userRole: "Employee",
  },
  {
    id: "4",
    name: "John Doe",
    email: "john.smith@npax.com",
    department: "HR Companion",
    jobTitle: "HR Specialist",
    role: "HR",
    userRole: "HR",
  },
  {
    id: "5",
    name: "John Doe",
    email: "john.smith@npax.com",
    department: "Advance Analytics",
    jobTitle: "Data Quality Analyst",
    role: "Super Admin",
    userRole: "Super Admin",
  },
];

function UserManagementTabs() {
  const [activeTab, setActiveTab] = useState("user-management");

  return (
    <div className="flex gap-6 px-6 md:px-12 lg:px-20 mb-4">
      <button
        onClick={() => setActiveTab("user-management")}
        className={`text-[8px] font-normal relative pb-2 ${
          activeTab === "user-management" ? "text-brand-purple" : "text-black"
        }`}
      >
        User Management
        {activeTab === "user-management" && (
          <div className="absolute -bottom-0 left-0 w-full h-[2px] bg-black" />
        )}
      </button>
      <button
        onClick={() => setActiveTab("role-management")}
        className={`text-[8px] font-normal ${
          activeTab === "role-management" ? "text-brand-purple" : "text-black"
        }`}
      >
        Role Management
      </button>
      <button
        onClick={() => setActiveTab("departments")}
        className={`text-[8px] font-normal ${
          activeTab === "departments" ? "text-brand-purple" : "text-black"
        }`}
      >
        Departments
      </button>
    </div>
  );
}

function UserTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users] = useState<User[]>(mockUsers);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-6 md:px-12 lg:px-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="relative w-full sm:w-auto">
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/bee2bddeb15453fa8c7a40e256b577322e4156d2?width=14"
              alt="Search"
              className="w-[7px] h-2 object-contain"
            />
          </div>
          <input
            type="text"
            placeholder="Search users.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[123px] h-[17px] pl-6 pr-2 text-[9px] font-normal text-black placeholder:text-black/22 border border-black/35 rounded bg-[#D9D9D9] focus:outline-none focus:ring-1 focus:ring-brand-purple"
          />
        </div>
        <button className="bg-brand-purple-dark hover:bg-brand-purple border border-brand-purple-dark rounded text-white text-[10px] font-semibold px-3 py-[3px] transition-colors">
          + Add User
        </button>
      </div>

      <div className="bg-white rounded-[7px] border border-black/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-black/21">
                <th className="text-left px-4 py-3 text-[8px] font-light text-black uppercase">
                  User
                </th>
                <th className="text-left px-4 py-3 text-[8px] font-light text-black uppercase">
                  Department
                </th>
                <th className="text-left px-4 py-3 text-[8px] font-light text-black uppercase">
                  Role
                </th>
                <th className="text-left px-4 py-3 text-[8px] font-light text-black uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className={index < filteredUsers.length - 1 ? "border-b border-black/21" : ""}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-[18px] h-[17px] rounded-full bg-brand-purple flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[8px] font-light">JD</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-black leading-[15px]">
                          {user.name}
                        </span>
                        <span className="text-[8px] font-extralight text-black leading-[15px]">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-black leading-[15px]">
                        {user.department}
                      </span>
                      <span className="text-[8px] font-extralight text-black leading-[15px]">
                        {user.jobTitle}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[8px] font-medium text-black leading-[15px]">
                      {user.userRole}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="hover:opacity-70 transition-opacity">
                        <img
                          src="https://api.builder.io/api/v1/image/assets/TEMP/f079066e47a6931b4269639becd55ac0dda731ae?width=40"
                          alt="Edit"
                          className="w-5 h-[15px] object-contain"
                        />
                      </button>
                      <button className="hover:opacity-70 transition-opacity">
                        <img
                          src="https://api.builder.io/api/v1/image/assets/TEMP/b1c436480f62a0ce842b61520e5b680ffa2600ea?width=26"
                          alt="Delete"
                          className="w-[13px] h-[13px] object-contain"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminUserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalType, setUserModalType] = useState<UserModalType>('add');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Get departments from SuperAdminDashboard (shared state would be better, but for now we'll define them here)
  const departments = [
    { id: 1, name: "Advanced Analytics Digital Transformation", users: 25 },
    { id: 2, name: "Enterprise Resource Planning", users: 28 },
    { id: 3, name: "Manufacturing Communication Frame", users: 34 },
    { id: 4, name: "Human Resource Companion", users: 36 },
  ];

  const totalEmployees = users.length;
  const activeUsers = users.filter(u => u.userRole !== 'Inactive').length;
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


  const handleUserModalOpen = (type: UserModalType, user?: any) => {
    setUserModalType(type);
    setSelectedUser(user || null);
    setUserModalOpen(true);
  };

  const handleUserModalSave = (data: any) => {
    if (userModalType === 'add') {
      const newUser: User = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        department: data.department,
        jobTitle: data.jobTitle,
        role: data.userRole,
        userRole: data.userRole,
      };
      setUsers([...users, newUser]);

      // In a real implementation, you would call the backend API here
      console.log('Creating new user:', { ...newUser, password: data.password });
    } else if (userModalType === 'edit' && selectedUser) {
      const updatedUser = { ...selectedUser, ...data, role: data.userRole };
      setUsers(users.map(user =>
        user.id === selectedUser.id ? updatedUser : user
      ));

      // In a real implementation, you would call the backend API here
      if (data.password) {
        console.log('Updating user password for:', selectedUser.email);
      }
      console.log('Updating user:', updatedUser);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

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
        departments={departments}
        onSave={handleUserModalSave}
      />
    </SuperAdminHeader>
  );
}

function UserManagementContent({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser
}: {
  users: User[];
  onAddUser: () => void;
  onEditUser: (type: UserModalType, user: any) => void;
  onDeleteUser: (userId: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDeleteUser(userId);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/bee2bddeb15453fa8c7a40e256b577322e4156d2?width=14"
              alt="Search"
              className="w-[7px] h-2 object-contain"
            />
          </div>
          <input
            type="text"
            placeholder="Search users.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[200px] h-[36px] pl-8 pr-4 text-sm font-normal text-black placeholder:text-black/60 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          onClick={onAddUser}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add User
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-800 uppercase tracking-wide">
                  User
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-800 uppercase tracking-wide">
                  Department
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-800 uppercase tracking-wide">
                  Role
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-800 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-slate-600">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-800">
                          {user.name}
                        </span>
                        <span className="text-sm text-slate-500">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-800">
                        {user.department}
                      </span>
                      <span className="text-sm text-slate-500">
                        {user.jobTitle}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-800">
                      {user.userRole}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditUser('edit', user)}
                        className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ChatbotAssistant />
    </div>
    
  );
}
