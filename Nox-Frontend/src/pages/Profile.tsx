import HeaderLayout from "@/components/layout/HeaderLayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiClient, type UserDto } from "@/lib/api";
import ChatbotAssistant from "@/components/chatbotkilid/ChatbotAssistant";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const currentUser = await apiClient.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <HeaderLayout>
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </HeaderLayout>
    );
  }

  if (error || !user) {
    return (
      <HeaderLayout>
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              {error || "Failed to load profile"}
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </HeaderLayout>
    );
  }

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName;

  return (
    <HeaderLayout>
      <div >
        {/* Header */}

        {/* Main Content */}
        <div className="px-6 py-6">
          <p className="text-sm text-gray-600 mb-1">Welcome back, {fullName}</p>
          {/* Navigation Tabs */}
          <div className="flex gap-6 mb-6 border-b border-gray-200">
            <button
              onClick={() => navigate("/dashboard")}
              className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/AIassistant")}
              className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium"
            >
              AI Assistant
            </button>
            <button className="pb-3 px-1 text-indigo-600 border-b-2 border-indigo-600 font-medium">
              Profile
            </button>
          </div>

          {/* Employee Profile Section */}
          <div className="flex justify-center items-center">
            <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-4xl w-full">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">
                Employee Profile
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-6">
                {/* Left Column - Personal Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Personal Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <p className="text-gray-900 text-lg">{fullName}</p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <p className="text-gray-900 text-lg">{user.userName}</p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <p className="text-gray-900 text-lg">
                        {user.departmentName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <p className="text-gray-900">
                        {user.startDate
                          ? new Date(user.startDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Employee ID
                      </label>
                      <p className="text-gray-900 text-lg">
                        {user.employeeId || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Right Column - Contact Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-gray-900 text-lg">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <p className="text-gray-900 text-lg">{user.phone || "N/A"}</p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <p className="text-gray-900 text-lg">{user.address || "N/A"}</p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <p
                        className={`text-lg font-medium ${
                          user.isActive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Update Button */}
            </div>
          </div>
        </div>

        {/* AI Assistant Chatbot */}
        <ChatbotAssistant />
      </div>
    </HeaderLayout>
  );
}
