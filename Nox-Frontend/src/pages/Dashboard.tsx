import { useState, useEffect } from "react";
import HeaderLayout from "@/components/layout/HeaderLayout";
import { useNavigate } from "react-router-dom";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { TaskModal, type TaskCategory } from "@/components/modals/TaskModal";
import ChatbotAssistant from "@/components/chatbotkilid/ChatbotAssistant";
import { apiClient } from "@/lib/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
   const [username, setUsername] = useState<string>("Guest");
  const [activeCategory, setActiveCategory] = useState<TaskCategory | null>(
    null
  );

  useEffect(() => {
      const fetchCurrentUser = async () => {
        try {
          const user = await apiClient.getCurrentUser();
          // Use email as username for chatbot
          setUsername(user.firstName || user.userName || "Guest");
        } catch (error) {
          console.error("Failed to fetch current user:", error);
          // Fallback to Guest if not logged in
          setUsername("Guest");
        }
      };
  
      fetchCurrentUser();
    }, []);

  const openModal = (category: TaskCategory) => {
    setActiveCategory(category);
    setModalOpen(true);
  };

  const quickActions = [
    {
      category: "government-forms" as TaskCategory,
      title: "Government Forms",
      description: "Complete SSS, PhilHealth, Pag-IBIG registration",
      progress: 25,
    },
    {
      category: "department-orientation" as TaskCategory,
      title: "Department Orientation",
      description: "Learn about your team and role responsibilities",
      progress: 67,
    },
    {
      category: "it-setup" as TaskCategory,
      title: "IT Setup",
      description: "Set up your email, accounts, and software",
      progress: 90,
    },
    {
      category: "hr-policies" as TaskCategory,
      title: "HR Policies",
      description: "Review company policies and benefits",
      progress: 33,
    },
    {
      category: "training-programs" as TaskCategory,
      title: "Training Programs",
      description: "Complete required training and certifications",
      progress: 40,
    },
    {
      category: "documentation" as TaskCategory,
      title: "Documentation",
      description: "Submit required forms and documents",
      progress: 88,
    },
  ];

  return (
    <HeaderLayout>
      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
        <p className="text-sm text-gray-600 mb-1">Welcome back, {username}</p>

          {/* Navigation Tabs */}
          <div className="flex gap-6 mb-6 border-b border-gray-200">
            <button className="pb-3 px-1 text-indigo-600 border-b-2 border-indigo-600 font-medium">
              Dashboard
            </button>
            <button
              onClick={() => navigate("/AIassistant")}
              className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium"
            >
              AI Assistant
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium"
            >
              Profile
            </button>
          </div>

          {/* Welcome Message */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to N-PAX, {username}!
            </h1>
            <p className="text-gray-600">
              You're part of the Advanced Analytics Digital Transformation team.
              Let's get you fully onboarded!
            </p>
          </div>

          {/* Onboarding Progress */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-indigo-600">
                Onboarding Progress
              </h2>
              <span className="text-sm font-medium text-gray-700">
                65% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: "65%" }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
              <span>Start Date: 2025-11-5</span>
              <span>Days Active: 60</span>
            </div>
          </div>
        </div>

        {/* The Main Content */}
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <QuickActionCard
                key={action.category}
                title={action.title}
                description={action.description}
                progress={action.progress}
                onClick={() => openModal(action.category)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        category={activeCategory}
      />

      {/* AI Assistant Button (Bottom Right) */}
      <ChatbotAssistant />
    </HeaderLayout>
  );
}
