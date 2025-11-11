import { useNavigate } from "react-router-dom";

export default function HROverview() {
  const navigate = useNavigate();

  return (
    
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/NpaxLogo.png" alt="N-PAX Logo" className="w-30 h-8" />
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-black">John Doe</span>
              <span className="text-[10px] font-light text-black">HR</span>
            </div>
          </div>
          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium">
              Logout
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
              Contact Support
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-6">
        <p className="text-sm text-gray-600 mb-1">Welcome back, John Doe</p>
        {/* Navigation Tabs */}
        <div className="flex gap-6 mb-6 border-b border-gray-200">
          <button className="pb-3 px-1 text-indigo-600 border-b-2 border-indigo-600 font-medium">
            Overview
          </button>
          <button className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium">
            Dashboard
          </button>
          <button className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium">
            Employee Management
          </button>
          <button className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium">
            Document Management
          </button>
          <button className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium">
            Reports
          </button>
        </div>

        {/* HR Overview Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/daa307821b94f2bc9182c703f75ef8a0689c162b?width=204"
                  alt="Employee Dashboard"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Employee Dashboard</h3>
              <p className="text-sm text-gray-600">View all employees and their document compliance status</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 mb-4 flex items-center justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/4a3195519fcbc68d4588725a7edd52e8e8e2e76a?width=88"
                  alt="Employee Management"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Employee Management</h3>
              <p className="text-sm text-gray-600">Add, edit, or deactivate employee accounts</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 mb-4 flex items-center justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/e454ec26e29211124b2e5db1c7395548c5c5e089?width=88"
                  alt="Document Management"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Management</h3>
              <p className="text-sm text-gray-600">Assign, upload, review, approve/reject or archive employee documents</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 mb-4 flex items-center justify-center">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/087d7c969d6f7286bce2afb6c5592e9072ad56ca?width=82"
                  alt="Reports"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports</h3>
              <p className="text-sm text-gray-600">View the status of employee documents and onboarding progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Button (Bottom Right) */}
      <button className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-700 to-indigo-900 hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] rounded-full shadow-lg transition-all flex flex-col items-center justify-center text-white">
        <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/f3bc07a8c5c425567b5ddbdcf2cc3b48aaca8522?width=72"
                  alt="Bot"
                  className="w-9 h-9 rounded-full"
                />
        
        <span className="text-[10px] font-semibold">ASK NOXY</span>
      </button>
    </div>
    
  );
}

