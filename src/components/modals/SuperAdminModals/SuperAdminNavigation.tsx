import { useNavigate, useLocation } from "react-router-dom";

export function SuperAdminNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === "/SuperAdminDashboard";
  const isUserManagement = location.pathname === "/SuperAdminUserManagement";

  return (
    <div className="flex items-center justify-center gap-16 px-6 mt-8 mb-8">
      <button
        onClick={() => navigate("/SuperAdminDashboard")}
        className={`pb-3 px-1 font-medium ${
          isDashboard
            ? "text-indigo-600 border-b-2 border-indigo-600"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        Department Management
      </button>
      <button
        onClick={() => navigate("/SuperAdminUserManagement")}
        className={`pb-3 px-1 font-medium ${
          isUserManagement
            ? "text-indigo-600 border-b-2 border-indigo-600"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        User Management
      </button>
    </div>
  );
}