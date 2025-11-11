// components/modals/content/DocumentationContent.tsx
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, FileCheck } from "lucide-react";

interface Task {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  description: string;
  dueDate: string;
  steps: string[];
  documents?: { name: string; downloadUrl?: string }[];
}

const tasks: Task[] = [
  {
    id: 'contract',
    name: 'Employment Contract Review',
    status: 'completed',
    description: 'Review and sign employment contract and related documents',
    dueDate: 'January 15, 2024',
    steps: [
      'Review contract terms',
      'Clarify any questions',
      'Sign employment contract',
      'Submit signed documents',
      'Receive executed copies',
    ],
    documents: [
      { name: 'Employment Contract', downloadUrl: '#' },
      { name: 'NDA Agreement', downloadUrl: '#' },
      { name: 'Job Offer Letter', downloadUrl: '#' },
    ],
  },
  {
    id: 'emergency',
    name: 'Emergency Contact Information',
    status: 'completed',
    description: 'Provide emergency contact details and medical information',
    dueDate: 'January 16, 2024',
    steps: [
      'Fill out emergency contact form',
      'Provide medical information',
      'Add secondary contacts',
      'Verify contact details',
      'Submit to HR',
    ],
  },
  {
    id: 'banking',
    name: 'Banking Information',
    status: 'pending',
    description: 'Setup direct deposit and banking information for payroll',
    dueDate: 'January 25, 2024',
    steps: [
      'Gather banking details',
      'Complete direct deposit form',
      'Attach voided check',
      'Submit to payroll',
      'Confirm setup completion',
    ],
  },
];

export function DocumentationContent() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in-progress':
        return '⏳';
      case 'pending':
        return '!!';
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'in-progress':
        return 'in progress';
      case 'pending':
        return 'pending';
    }
  };

  const getActionButton = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return null;
      case 'in-progress':
        return (
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Mark Complete
          </Button>
        );
      case 'pending':
        return (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Start Task
          </Button>
        );
    }
  };

 return (
  <div className="flex gap-6 h-full overflow-hidden pt-4">
        {/* Left Panel - Task List */}
        <div className="w-96 shrink-0 space-y-3 overflow-y-auto pr-2">
          <h3 className="font-semibold text-sm text-gray-700 mb-4">
            Tasks & Requirements
          </h3>
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={`w-full p-4 text-left rounded-lg border transition-all ${
                selectedTask?.id === task.id
                  ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-medium text-sm">{task.name}</span>
                <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                  <span className="mr-1">{getStatusIcon(task.status)}</span>
                  {getStatusLabel(task.status)}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
              <p className="text-xs text-gray-500 mt-2">Due: {task.dueDate}</p>
            </button>
          ))}
        </div>
  
        {/* Right Panel - Task Details */}
        <div className="flex-1 overflow-y-auto">
          {selectedTask ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{selectedTask.name}</h2>
                  <p className="text-sm text-gray-600">{selectedTask.description}</p>
                </div>
                <Badge className={getStatusColor(selectedTask.status)}>
                  <span className="mr-1">{getStatusIcon(selectedTask.status)}</span>
                  {getStatusLabel(selectedTask.status)}
                </Badge>
              </div>
  
              {/* Due Date */}
              <div>
                <h3 className="font-semibold text-sm mb-1">Due Date</h3>
                <p className="text-sm text-gray-600">{selectedTask.dueDate}</p>
              </div>
  
              {/* Steps to Complete */}
              <div>
                <h3 className="font-semibold text-sm mb-3">Steps to Complete</h3>
                <ol className="space-y-2">
                  {selectedTask.steps.map((step, index) => (
                    <li key={index} className="flex gap-3 text-sm">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
  
              {/* Required Documents */}
              {selectedTask.documents && selectedTask.documents.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm mb-3">Required Documents</h3>
                  <div className="space-y-2">
                    {selectedTask.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{doc.name}</span>
                        </div>
                        <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-700">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
  
              {/* Action Buttons */}
              <div className="flex gap-3">
                {getActionButton(selectedTask.status)}
                <Button variant="outline">
                  Need Help?
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <FileCheck className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-gray-500">Select a task to view details</p>
            </div>
          )}
        </div>
      </div>
);
}
