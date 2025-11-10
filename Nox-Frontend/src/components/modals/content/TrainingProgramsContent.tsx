// components/modals/content/TrainingProgramsContent.tsx
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
    id: 'culture',
    name: 'Company Culture & Values',
    status: 'completed',
    description: 'Learn about N-PAX culture, mission, and core values',
    dueDate: 'January 18, 2024',
    steps: [
      'Watch company overview video',
      'Read mission statement',
      'Understand core values',
      'Learn company history',
      'Complete culture quiz',
    ],
  },
  {
    id: 'compliance',
    name: 'Compliance Training',
    status: 'in-progress',
    description: 'Complete mandatory compliance and ethics training',
    dueDate: 'February 5, 2024',
    steps: [
      'Complete ethics training',
      'Learn compliance procedures',
      'Understand reporting mechanisms',
      'Pass compliance test',
      'Receive certification',
    ],
    documents: [
      { name: 'Compliance Manual', downloadUrl: '#' },
      { name: 'Ethics Guidelines', downloadUrl: '#' },
      { name: 'Training Modules', downloadUrl: '#' },
    ],
  },
  {
    id: 'development',
    name: 'Professional Development Plan',
    status: 'pending',
    description: 'Create your personalized learning and development roadmap',
    dueDate: 'February 20, 2024',
    steps: [
      'Assess current skills',
      'Identify development goals',
      'Choose learning resources',
      'Create development timeline',
      'Schedule progress reviews',
    ],
  },
];

export function TrainingProgramsContent() {
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
  <div className="flex gap-10 h-full overflow-hidden pt-6">
    {/* Left Panel - Wider */}
    <div className="w-96 shrink-0 space-y-4 overflow-y-auto pr-4">
      <h3 className="font-semibold text-base text-gray-900 mb-6">
        Tasks & Requirements
      </h3>
      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => setSelectedTask(task)}
          className={`w-full p-5 text-left rounded-lg border transition-all ${
            selectedTask?.id === task.id
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <span className="font-semibold text-base text-gray-900">{task.name}</span>
            <Badge className={`text-sm font-medium ${getStatusColor(task.status)}`}>
              <span className="mr-1">{getStatusIcon(task.status)}</span>
              {getStatusLabel(task.status)}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
        </button>
      ))}
    </div>

    {/* Right Panel - Larger text */}
    <div className="flex-1 overflow-y-auto px-6">
      {selectedTask ? (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">{selectedTask.name}</h2>
              <p className="text-base text-gray-600">{selectedTask.description}</p>
            </div>
            <Badge className={`text-sm font-medium ${getStatusColor(selectedTask.status)}`}>
              <span className="mr-1">{getStatusIcon(selectedTask.status)}</span>
              {getStatusLabel(selectedTask.status)}
            </Badge>
          </div>

          {/* Due Date */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-3">Due Date</h3>
            <p className="text-base text-gray-700">{selectedTask.dueDate}</p>
          </div>

          {/* Steps to Complete */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Steps to Complete</h3>
            <ol className="space-y-4">
              {selectedTask.steps.map((step, index) => (
                <li key={index} className="flex gap-4 text-base">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-gray-900 pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Required Documents */}
          {selectedTask.documents && selectedTask.documents.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Required Documents</h3>
              <div className="space-y-3">
                {selectedTask.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <span className="text-base text-gray-900">{doc.name}</span>
                    </div>
                    <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-700 text-base">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {getActionButton(selectedTask.status)}
            <Button variant="outline" size="lg">
              Need Help?
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <FileCheck className="w-20 h-20 mb-6 text-gray-300" />
          <p className="text-base text-gray-500">Select a task to view details</p>
        </div>
      )}
    </div>
  </div>
);
}
