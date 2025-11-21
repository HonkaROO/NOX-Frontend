import { useNavigate } from "react-router-dom";

interface HRnavProps {
  activePage: string;
}

export default function HRnav({ activePage }: HRnavProps) {
  const navigate = useNavigate();

  const navItems = [
    { key: "HROverview", label: "Overview", path: "/HROverview" },
    {
      key: "HREmployeeManagement",
      label: "Employee Management",
      path: "/HREmployeeManagement",
    },
    {
      key: "HRDocumentManagement",
      label: "Document Management",
      path: "/HRDocumentManagement",
    },

    // { key: "HRReports", label: "Reports", path: "/HRReports" },
  ];

  return (
    <>
      <div className="flex gap-4 md:gap-6 mb-4 md:mb-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => navigate(item.path)}
            className={`pb-2 md:pb-3 px-2 md:px-1 font-medium text-sm md:text-base whitespace-nowrap ${
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
