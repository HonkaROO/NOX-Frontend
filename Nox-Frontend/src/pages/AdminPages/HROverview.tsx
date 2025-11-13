import { useState } from "react";
import AdminHeader from "@/components/layout/AdminLayout/AdminHeader";
import { useNavigate } from "react-router-dom";
import { FolderModal, type FolderModalType } from "@/components/modals/ADMINHR/FolderModal";
import HRnav from "@/components/layout/AdminLayout/HRnav";

export default function HROverview() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FolderModalType>('add');
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [folders, setFolders] = useState<any[]>([]);

  const handleModalOpen = (type: FolderModalType, folder?: any) => {
    setModalType(type);
    setSelectedFolder(folder || null);
    setModalOpen(true);
  };

  const handleModalSave = (data: any) => {
    if (modalType === 'add') {
      const newFolder = {
        id: Date.now(), // Simple ID generation
        name: data.name,
        description: data.description,
        createdAt: new Date().toISOString(),
      };
      setFolders([...folders, newFolder]);
    } else if (modalType === 'edit' && selectedFolder) {
      setFolders(folders.map(folder =>
        folder.id === selectedFolder.id
          ? { ...folder, name: data.name, description: data.description }
          : folder
      ));
    }
  };

  return (
     
<AdminHeader>
      <div className="p-6">
        <HRnav activePage="HROverview" />

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-semibold">Folder Cards</h1>
            <p className="pt-2">Shows uploaded Folder Cards and Tasks</p>
          </div>
          {/* Add Folder Button */}
          <div className="mb-6">
            <button
              onClick={() => handleModalOpen('add')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              + Add Folder
            </button>
          </div>
           
        </div>
        {/* Contents Here */}

         

        {/* Folder Cards */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Folder Cards</h2>

          {folders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No folders created yet. Click "Add Folder" to create your first folder.</p>
            </div>
          ) : (
            /* Grid of Folder Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-lg">📁</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Add delete functionality
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {folder.name}
                  </h3>
                  {folder.description && (
                    <p className="text-sm text-gray-600 mb-4">
                      {folder.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-500">
                    Created: {new Date(folder.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

           

         

        {/* Folder Modal */}
        <FolderModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          type={modalType}
          folder={selectedFolder}
          onSave={handleModalSave}
        />

        {/* AI Assistant Button (Bottom Right) */}
        <button className="fixed bottom-6 right-6 w-16 h-16 bg-linear-to-br from-blue-700 to-indigo-900 hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] rounded-full shadow-lg transition-all flex flex-col items-center justify-center text-white">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/f3bc07a8c5c425567b5ddbdcf2cc3b48aaca8522?width=72"
            alt="Bot"
            className="w-9 h-9 rounded-full"
          />

          <span className="text-[10px] font-semibold">ASK NOXY</span>
        </button>
      </div>
    </AdminHeader>
  );
}