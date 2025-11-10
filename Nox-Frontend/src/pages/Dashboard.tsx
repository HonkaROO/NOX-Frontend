import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="text-2xl font-bold">
              <span className="text-gray-800">N-PAX</span>
            </span>
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
        {/* Welcome Section */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-1">Welcome back, John Doe</p>

          {/* Navigation Tabs */}
          <div className="flex gap-6 mb-6 border-b border-gray-200">
            <button className="pb-3 px-1 text-indigo-600 border-b-2 border-indigo-600 font-medium">
              Dashboard
            </button>
            <button className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium">
              AI Assistant
            </button>
            <button
            onClick={() => navigate("/profile")} className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium">
              Profile
            </button>
          </div>

          {/* Welcome Message */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to N-PAX, John Doe!
            </h1>
            <p className="text-gray-600">
              You're part of the Advanced Analytics Digital Transformation team. Let's get you fully onboarded!
            </p>
          </div>

          {/* Onboarding Progress */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-indigo-600">
                Onboarding Progress
              </h2>
              <span className="text-sm font-medium text-gray-700">65% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
              <span>Start Date: 2025-11-5</span>
              <span>Days Active: 60</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Government Forms Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                Government Forms
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Complete SSS, PhilHealth, Pag-IBIG registration
              </p>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">25% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>

            {/* Department Orientation Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                Department Orientation
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Learn about your team and role responsibilities
              </p>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">67% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
            </div>

            {/* IT Setup Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                IT Setup
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Complete SSS, PhilHealth, Pag-IBIG registration
              </p>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">90% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>

            {/* HR Policies Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                HR Policies
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Complete SSS, PhilHealth, Pag-IBIG registration
              </p>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">33% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '33%' }}></div>
                </div>
              </div>
            </div>

            {/* Training Programs Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                Training Programs
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Complete SSS, PhilHealth, Pag-IBIG registration
              </p>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">40% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>

            {/* Documentation Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                Documentation
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Complete SSS, PhilHealth, Pag-IBIG registration
              </p>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">88% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
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
