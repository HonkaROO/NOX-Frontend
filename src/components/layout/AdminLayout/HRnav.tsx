import { useNavigate } from "react-router-dom";

interface HRnavProps {
  activePage: string;
}

export default function HRnav({ activePage }: HRnavProps) {
  const navigate = useNavigate();

  const navItems = [
    
    { key: "HROverview", label: "Overview", path: "/HROverview" },    
    { key: "HREmployeeManagement", label: "Employee Management", path: "/HREmployeeManagement" },
    { key: "HRDocumentManagement", label: "Document Management", path: "/HRDocumentManagement" },
    
    { key: "HRReports", label: "Reports", path: "/HRReports" },
  ];

  return (
    <>
      <p className="text-sm text-gray-600 mb-1">Welcome back, John Doe</p>
      <div className="flex gap-6 mb-6 border-b border-gray-200">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => navigate(item.path)}
            className={`pb-3 px-1 font-medium ${
              activePage === item.key
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}