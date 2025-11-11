import { useNavigate } from "react-router-dom";

export function SuperAdminNavigation() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center gap-16 px-6 mt-8 mb-8">
      <button
        onClick={() => navigate("/SuperAdminDashboard")}
        className="pb-3 px-1 text-indigo-600 border-b-2 border-indigo-600 font-medium"
      >
        Department Management
      </button>
      <button
        onClick={() => navigate("/SuperAdminUserManagement")}
        className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium"
      >
        User Management
      </button>
    </div>
  );
}