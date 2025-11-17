import { HttpClient } from "../USERS";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const httpClient = new HttpClient(API_BASE_URL);

// Types
export interface OnboardingFolder {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  tasks?: OnboardingTask[];
}

export interface OnboardingMaterial {
  id: number;
  fileName: string;
  fileType: string;
  url: string;
  taskId: number;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingTask {
  id: number;
  title: string;
  description: string;
  folderId: number;
  createdAt: string;
  updatedAt: string;
  materials?: OnboardingMaterial[];
  steps?: OnboardingStep[];
}

export interface OnboardingStep {
  id: number;
  stepDescription: string;
  taskId: number;
  seqOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFolderRequest {
  title: string;
  description: string;
}

export interface UpdateFolderRequest {
  title: string;
  description: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  folderId: number;
}

export interface UpdateTaskRequest {
  title: string;
  description: string;
}

export interface CreateStepRequest {
  stepDescription: string;
  taskId: number;
  seqOrder: number;
}

export interface UpdateStepRequest {
  stepDescription: string;
  seqOrder: number;
}

// Folder Service
export const folderService = {
  async getAll(): Promise<OnboardingFolder[]> {
    return httpClient.get<OnboardingFolder[]>('/api/onboarding/folders');
  },

  async getById(id: number): Promise<OnboardingFolder> {
    return httpClient.get<OnboardingFolder>(`/api/onboarding/folders/${id}`);
  },

  async create(data: CreateFolderRequest): Promise<OnboardingFolder> {
    return httpClient.post<OnboardingFolder>('/api/onboarding/folders', data);
  },

  async update(id: number, data: UpdateFolderRequest): Promise<OnboardingFolder> {
    return httpClient.put<OnboardingFolder>(`/api/onboarding/folders/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return httpClient.delete<void>(`/api/onboarding/folders/${id}`);
  },
};

// Task Service
export const taskService = {
  async getAll(): Promise<OnboardingTask[]> {
    return httpClient.get<OnboardingTask[]>('/api/onboarding/tasks');
  },

  async getById(id: number): Promise<OnboardingTask> {
    return httpClient.get<OnboardingTask>(`/api/onboarding/tasks/${id}`);
  },

  async getByFolderId(folderId: number): Promise<OnboardingTask[]> {
    return httpClient.get<OnboardingTask[]>(`/api/onboarding/tasks/folder/${folderId}`);
  },

  async create(data: CreateTaskRequest): Promise<OnboardingTask> {
    return httpClient.post<OnboardingTask>('/api/onboarding/tasks', data);
  },

  async update(id: number, data: UpdateTaskRequest): Promise<OnboardingTask> {
    return httpClient.put<OnboardingTask>(`/api/onboarding/tasks/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return httpClient.delete<void>(`/api/onboarding/tasks/${id}`);
  },
};

// Material Service (with file upload)
export const materialService = {
  async getAll(): Promise<OnboardingMaterial[]> {
    return httpClient.get<OnboardingMaterial[]>('/api/onboarding/materials');
  },

  async getById(id: number): Promise<OnboardingMaterial> {
    return httpClient.get<OnboardingMaterial>(`/api/onboarding/materials/${id}`);
  },

  async getByTaskId(taskId: number): Promise<OnboardingMaterial[]> {
    return httpClient.get<OnboardingMaterial[]>(`/api/onboarding/materials/task/${taskId}`);
  },

  async upload(taskId: number, file: File): Promise<OnboardingMaterial> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId.toString());

    const response = await fetch(`${API_BASE_URL}/api/onboarding/materials`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      // Don't set Content-Type - browser will set it with boundary
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Upload failed: ${response.status}`);
    }

    return response.json();
  },

  async delete(id: number): Promise<void> {
    return httpClient.delete<void>(`/api/onboarding/materials/${id}`);
  },
};

// Step Service
export const stepService = {
  async getAll(): Promise<OnboardingStep[]> {
    return httpClient.get<OnboardingStep[]>('/api/onboarding/steps');
  },

  async getById(id: number): Promise<OnboardingStep> {
    return httpClient.get<OnboardingStep>(`/api/onboarding/steps/${id}`);
  },

  async getByTaskId(taskId: number): Promise<OnboardingStep[]> {
    return httpClient.get<OnboardingStep[]>(`/api/onboarding/steps/task/${taskId}`);
  },

  async create(data: CreateStepRequest): Promise<OnboardingStep> {
    return httpClient.post<OnboardingStep>('/api/onboarding/steps', data);
  },

  async update(id: number, data: UpdateStepRequest): Promise<OnboardingStep> {
    return httpClient.put<OnboardingStep>(`/api/onboarding/steps/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return httpClient.delete<void>(`/api/onboarding/steps/${id}`);
  },
};



