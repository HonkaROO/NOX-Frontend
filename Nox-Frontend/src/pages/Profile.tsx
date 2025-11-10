import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <img
          src="/NpaxLogo.png"
          alt="N PAX Logo"
          className="h-7 md:h-8 w-auto"
          />
          

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
          <button
            onClick={() => navigate("/dashboard")}
            className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium"
          >
            Dashboard
          </button>
          <button onClick={() => navigate("/AIassistant")} className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium">
            
            AI Assistant
          </button>
          <button className="pb-3 px-1 text-indigo-600 border-b-2 border-indigo-600 font-medium">
            Profile
          </button>
        </div>

        {/* Employee Profile Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-4xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Employee Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            {/* Left Column - Personal Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900">John Doe</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <p className="text-gray-900">Advanced Analytics Digital Transformation</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <p className="text-gray-900">2025-05-11</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <p className="text-gray-900">NPAX-2024-001</p>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">john.doe@npax.com</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <p className="text-gray-900">+63 912 345 6969</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <p className="text-gray-900">As Fortuna, Cor Hernan Cortes St, Mandaue, 6014 Cebu</p>
                </div>
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div className="mt-8">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
              Update
            </button>
          </div>
        </div>
      </div>

      {/* AI Assistant Button (Bottom Right) */}
      <button className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <span className="text-[10px] font-semibold">ASK NOXY</span>
      </button>
    </div>
  )
}
