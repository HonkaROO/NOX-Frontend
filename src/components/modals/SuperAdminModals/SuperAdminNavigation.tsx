import { useNavigate, useLocation } from "react-router-dom";

export function SuperAdminNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === "/SuperAdminDashboard";
  const isUserManagement = location.pathname === "/SuperAdminUserManagement";
  const isOnboardingManagement =
    location.pathname === "/SuperAdminOnboardingOverview";
  const isDocumentManagement =
    location.pathname === "/SuperAdminDocumentManagement";

  return (
    <div className="flex items-center justify-start md:justify-center gap-6 md:gap-16 px-4 md:px-6 mt-4 md:mt-8 mb-4 md:mb-8 overflow-x-auto scrollbar-hide">
      <button
        onClick={() => navigate("/SuperAdminDashboard")}
        className={`pb-2 md:pb-3 px-2 md:px-1 font-medium text-sm md:text-base whitespace-nowrap ${
          isDashboard
            ? "text-indigo-600 border-b-2 border-indigo-600"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        Department Management
      </button>
      <button
        onClick={() => navigate("/SuperAdminUserManagement")}
        className={`pb-2 md:pb-3 px-2 md:px-1 font-medium text-sm md:text-base whitespace-nowrap ${
          isUserManagement
            ? "text-indigo-600 border-b-2 border-indigo-600"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        User Management
      </button>
      <button
        onClick={() => navigate("/SuperAdminOnboardingOverview")}
        className={`pb-2 md:pb-3 px-2 md:px-1 font-medium text-sm md:text-base whitespace-nowrap ${
          isOnboardingManagement
            ? "text-indigo-600 border-b-2 border-indigo-600"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        Onboarding Management
      </button>
      <button
        onClick={() => navigate("/SuperAdminDocumentManagement")}
        className={`pb-2 md:pb-3 px-2 md:px-1 font-medium text-sm md:text-base whitespace-nowrap ${
          isDocumentManagement
            ? "text-indigo-600 border-b-2 border-indigo-600"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        Document Management
      </button>
    </div>
  );
}
