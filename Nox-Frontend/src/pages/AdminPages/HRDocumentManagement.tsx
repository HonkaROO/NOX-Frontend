import AdminHeader from "@/components/layout/AdminLayout/AdminHeader";
import { Button } from "@/components/ui/button";
import {
  Ban,
  CircleCheckBig,
  ClipboardClock,
  FileText,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UploadDocumentDialog from "@/components/modals/ADMINHR/HRUploadModal";

// Mock data
const DOCUMENTS = [
  {
    id: 1,
    name: "SSS Registration",
    uploadedBy: "John Doe",
    date: "8/15/2024",
    size: "2.5 MB",
    categories: ["Government"],
    status: "approved",
  },
  {
    id: 2,
    name: "Analytics Tools Training",
    uploadedBy: "Abby Amber",
    date: "5/10/2025",
    size: "2.8 MB",
    categories: ["Department"],
    status: "approved",
  },
  {
    id: 3,
    name: "Equipment Assignment",
    uploadedBy: "Jane Smith",
    date: "11/2/2024",
    size: "3.1 MB",
    categories: ["IT Setup"],
    status: "approved",
  },
  {
    id: 4,
    name: "SSS Registration",
    uploadedBy: "John Doe",
    date: "5/15/2025",
    size: "2.5 MB",
    categories: ["Training Programs"],
    status: "approved",
  },
  {
    id: 5,
    name: "Professional Development Plan",
    uploadedBy: "Ellery Harveen",
    date: "10/15/2024",
    size: "163 KB",
    categories: ["Documentation"],
    status: "pending",
  },
  {
    id: 6,
    name: "TIN Registration",
    uploadedBy: "John Doe",
    date: "10/23/2025",
    size: "11 KB",
    categories: ["Government"],
    status: "expired",
  },
];

const TABS = [
  "All Documents",
  "Government",
  "Department",
  "IT Setup",
  "HR Policies",
  "Training Programs",
  "Documentation",
];

export default function HRDocumentManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All Documents");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Filter documents based on active tab
  const filteredDocuments =
    activeTab === "All Documents"
      ? DOCUMENTS
      : DOCUMENTS.filter((doc) => doc.categories.includes(activeTab));

  return (
    <AdminHeader>
      <div className="p-6">
        <p className="text-sm text-gray-600 mb-1">Welcome back, John Doe</p>
        <div className="flex gap-6 mb-6 border-b border-gray-200">
          <button
            onClick={() => navigate("/HROverview")}
            className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium"
          >
            Overview
          </button>
          <button
            onClick={() => navigate("/HRDashboard")}
            className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/HREmployeeManagement")}
            className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium"
          >
            Employee Management
          </button>
          <button
            onClick={() => navigate("/HRDocumentManagement")}
            className="pb-3 px-1 text-indigo-600 border-b-2 border-indigo-600 font-medium"
          >
            Document Management
          </button>
          <button
            onClick={() => navigate("/HRReports")}
            className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium"
          >
            Reports
          </button>
        </div>

        <div className="flex justify-between">
          <div>
            <h1 className="text-4xl font-semibold">Document Management</h1>
            <p className="pt-2">Upload and manage onboarding documents</p>
          </div>
          <div className="flex items-center">
            <Button
            onClick={() => setUploadDialogOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ">
              <Plus size={36} strokeWidth={3} />
              Upload Document
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 pt-12 px-6">
          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <FileText size={40} className="text-blue-600" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">Total Documents</span>
              <span className="text-2xl font-semibold text-gray-900">10</span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <CircleCheckBig size={40} className="text-green-600" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">Approved</span>
              <span className="text-2xl font-semibold text-gray-900">123</span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <ClipboardClock size={40} className="text-gray-800" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">Pending Review</span>
              <span className="text-2xl font-semibold text-gray-900">8</span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <Ban size={40} className="text-red-600" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">Rejected</span>
              <span className="text-2xl font-semibold text-gray-900">0</span>
            </div>
          </div>
        </div>

        {/* Document Filter Tabs */}
        <div className="flex gap-6 mt-12 mb-6 border-b border-gray-200 px-6 ">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 font-medium ${
                activeTab === tab
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-5 gap-4 px-6">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-green-100 p-2 rounded">
                  <FileText className="text-green-600" size={24} />
                </div>
                <div className="flex flex-wrap gap-1">
                  {doc.categories.map((cat) => (
                    <span
                      key={cat}
                      className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600"
                    >
                      {cat}
                    </span>
                  ))}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      doc.status === "approved"
                        ? "bg-green-100 text-green-600"
                        : doc.status === "pending"
                        ? "bg-pink-100 text-pink-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-sm mb-1">{doc.name}</h3>
              <p className="text-xs text-gray-600 mb-1">
                Uploaded by: {doc.uploadedBy}
              </p>
              <p className="text-xs text-gray-600 mb-1">Date: {doc.date}</p>
              <p className="text-xs text-gray-600 mb-3">Size: {doc.size}</p>

              <button className="w-full bg-indigo-600 text-white text-sm py-2 rounded hover:bg-indigo-7000 mt-auto">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
      <UploadDocumentDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </AdminHeader>
  );
}
