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

export interface RequirementDto {
  id: number;
  category: string;
  name: string;
  status: "Pending" | "Submitted" | "Approved" | "Rejected";
  fileUrl?: string;
}

// User Progress Tracking
export interface UserTaskProgress {
  userId: string;
  taskId: number;
  completedSteps: number[];
  status: "not-started" | "in-progress" | "completed";
  startedAt?: string;
  completedAt?: string;
}

// Backend API Response for User Task Progress
export interface UserTaskProgressDto {
  taskId: number;
  status: string;
  updatedAt: string;
  taskTitle: string;
  taskDescription: string;
}

// Backend API Request for updating task status
export interface UpdateTaskStatusRequest {
  status: string;
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
  Title: string;
  Description: string;
}

export interface CreateStepRequest {
  StepDescription: string;
  TaskId: number;
  SequenceOrder?: number; // Optional - backend will auto-assign if not provided
}

export interface UpdateStepRequest {
  StepDescription: string;
  SequenceOrder: number;
}

// Folder Service
export const folderService = {
  async getAll(): Promise<OnboardingFolder[]> {
    return httpClient.get<OnboardingFolder[]>("/api/onboarding/folders");
  },

  async getById(id: number): Promise<OnboardingFolder> {
    return httpClient.get<OnboardingFolder>(`/api/onboarding/folders/${id}`);
  },

  async create(data: CreateFolderRequest): Promise<OnboardingFolder> {
    return httpClient.post<OnboardingFolder>("/api/onboarding/folders", data);
  },

  async update(
    id: number,
    data: UpdateFolderRequest
  ): Promise<OnboardingFolder> {
    return httpClient.put<OnboardingFolder>(
      `/api/onboarding/folders/${id}`,
      data
    );
  },

  async delete(id: number): Promise<void> {
    return httpClient.delete<void>(`/api/onboarding/folders/${id}`);
  },
};

// Task Service
export const taskService = {
  async getAll(): Promise<OnboardingTask[]> {
    return httpClient.get<OnboardingTask[]>("/api/onboarding/tasks");
  },

  async getById(id: number): Promise<OnboardingTask> {
    return httpClient.get<OnboardingTask>(`/api/onboarding/tasks/${id}`);
  },

  async getByFolderId(folderId: number): Promise<OnboardingTask[]> {
    return httpClient.get<OnboardingTask[]>(
      `/api/onboarding/tasks/folder/${folderId}`
    );
  },

  async create(data: CreateTaskRequest): Promise<OnboardingTask> {
    return httpClient.post<OnboardingTask>("/api/onboarding/tasks", data);
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
    return httpClient.get<OnboardingMaterial[]>("/api/onboarding/materials");
  },

  async getById(id: number): Promise<OnboardingMaterial> {
    return httpClient.get<OnboardingMaterial>(
      `/api/onboarding/materials/${id}`
    );
  },

  async getByTaskId(taskId: number): Promise<OnboardingMaterial[]> {
    return httpClient.get<OnboardingMaterial[]>(
      `/api/onboarding/materials/task/${taskId}`
    );
  },

  async upload(taskId: number, file: File): Promise<OnboardingMaterial> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("taskId", taskId.toString());

    const response = await fetch(`${API_BASE_URL}/api/onboarding/materials`, {
      method: "POST",
      credentials: "include",
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
    return httpClient.get<OnboardingStep[]>("/api/onboarding/steps");
  },

  async getById(id: number): Promise<OnboardingStep> {
    return httpClient.get<OnboardingStep>(`/api/onboarding/steps/${id}`);
  },

  async getByTaskId(taskId: number): Promise<OnboardingStep[]> {
    return httpClient.get<OnboardingStep[]>(
      `/api/onboarding/steps/task/${taskId}`
    );
  },

  async create(data: CreateStepRequest): Promise<OnboardingStep> {
    return httpClient.post<OnboardingStep>("/api/onboarding/steps", data);
  },

  async update(id: number, data: UpdateStepRequest): Promise<OnboardingStep> {
    return httpClient.put<OnboardingStep>(`/api/onboarding/steps/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return httpClient.delete<void>(`/api/onboarding/steps/${id}`);
  },
};

export const requirementService = {
  async getUserChecklist(userId: string): Promise<RequirementDto[]> {
    return httpClient.get<RequirementDto[]>(
      `/api/onboarding/requirements/${userId}/checklist`
    );
  },

  async submitRequirement(id: number, fileUrl: string): Promise<void> {
    return httpClient.post<void>(`/api/onboarding/requirements/submit/${id}`, {
      fileUrl,
    });
  },

  async reviewRequirement(id: number, approve: boolean): Promise<void> {
    return httpClient.put<void>(
      `/api/onboarding/requirements/review/${id}?approve=${approve}`
    );
  },
};

export const userTaskProgressService = {
  /**
   * Get all task progress for a specific user
   * GET /api/onboarding/user-tasks/{userId}
   */
  async getUserProgress(userId: string): Promise<UserTaskProgressDto[]> {
    try {
      return await httpClient.get<UserTaskProgressDto[]>(
        `/api/onboarding/user-tasks/${userId}`
      );
    } catch (error) {
      console.warn("Failed to fetch user task progress from backend:", error);
      return [];
    }
  },

  /**
   * Create initial task progress record
   * POST /api/onboarding/user-tasks/{userId}/{taskId}
   * Creates a new "pending" status record
   */
  async createTaskProgress(
    userId: string,
    taskId: number
  ): Promise<UserTaskProgressDto> {
    return httpClient.post<UserTaskProgressDto>(
      `/api/onboarding/user-tasks/${userId}/${taskId}`,
      {}
    );
  },

  /**
   * Update task status (pending, in_progress, completed)
   * PUT /api/onboarding/user-tasks/{userId}/{taskId}
   * If record doesn't exist (404), automatically creates it first via POST
   *
   * Expected flow:
   * - User created → Record exists with status "pending"
   * - Start Task → Updates to "in_progress"
   * - Complete Task → Updates to "completed"
   */
  async updateTaskStatus(
    userId: string,
    taskId: number,
    status: string
  ): Promise<UserTaskProgressDto | null> {
    try {
      return await httpClient.put<UserTaskProgressDto>(
        `/api/onboarding/user-tasks/${userId}/${taskId}`,
        { status } as UpdateTaskStatusRequest
      );
    } catch (error: any) {
      // If 404, the record doesn't exist - create it first then update
      if (
        error?.message?.includes("404") ||
        error?.message?.includes("Not Found")
      ) {
        console.log(
          `📝 No progress record found for task ${taskId}. Creating record first...`
        );
        try {
          // Create the record with "pending" status
          await this.createTaskProgress(userId, taskId);
          console.log(`✅ Record created. Now updating to "${status}"...`);

          // Now update it to the desired status
          return await httpClient.put<UserTaskProgressDto>(
            `/api/onboarding/user-tasks/${userId}/${taskId}`,
            { status } as UpdateTaskStatusRequest
          );
        } catch (createError: any) {
          console.error(`❌ Failed to create task progress:`, createError);
          return null;
        }
      }
      // For other errors, rethrow
      console.error(`Failed to update task status:`, error);
      throw error;
    }
  },
};

// User Progress Service (localStorage-based)
// ...existing code...
export const progressService = {
  // Subscribers notified when any progress is saved
  _listeners: new Set<(p: UserTaskProgress) => void>(),

  subscribe(fn: (p: UserTaskProgress) => void) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  },

  /**
   * Get task progress - now fetches from backend
   */
  async getTaskProgress(
    userId: string,
    taskId: number
  ): Promise<UserTaskProgress> {
    try {
      const allProgress = await userTaskProgressService.getUserProgress(userId);
      const taskProgress = allProgress.find((p) => p.taskId === taskId);

      if (taskProgress) {
        return {
          userId,
          taskId,
          completedSteps: [], // Backend doesn't track steps yet
          status: this._mapBackendStatus(taskProgress.status),
          startedAt:
            taskProgress.status !== "pending"
              ? taskProgress.updatedAt
              : undefined,
          completedAt:
            taskProgress.status === "completed"
              ? taskProgress.updatedAt
              : undefined,
        };
      }
    } catch (error) {
      console.error("Failed to fetch progress from backend:", error);
    }

    // Fallback to localStorage if backend fails
    const key = `progress_${userId}_${taskId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }

    return {
      userId,
      taskId,
      completedSteps: [],
      status: "not-started",
    };
  },

  /**
   * Toggle step completion - updates backend
   */
  async toggleStep(
    userId: string,
    taskId: number,
    stepId: number
  ): Promise<UserTaskProgress> {
    const key = `progress_${userId}_${taskId}`;
    const stored = localStorage.getItem(key);
    const progress: UserTaskProgress = stored
      ? JSON.parse(stored)
      : {
          userId,
          taskId,
          completedSteps: [],
          status: "not-started",
        };

    const index = progress.completedSteps.indexOf(stepId);

    if (index > -1) {
      progress.completedSteps = progress.completedSteps.filter(
        (id) => id !== stepId
      );
    } else {
      progress.completedSteps.push(stepId);
    }

    // Determine new status
    let newStatus: string;
    if (progress.completedSteps.length === 0) {
      newStatus = "pending";
      progress.status = "not-started";
    } else {
      newStatus = "in_progress";
      progress.status = "in-progress";
    }

    if (!progress.startedAt && progress.completedSteps.length > 0) {
      progress.startedAt = new Date().toISOString();
    }

    // Update backend (if record exists)
    try {
      const result = await userTaskProgressService.updateTaskStatus(
        userId,
        taskId,
        newStatus
      );
      if (result === null) {
        console.warn(
          `Task ${taskId}: No backend progress record found. Using localStorage only.`
        );
      }
    } catch (error) {
      console.error(`Task ${taskId}: Failed to sync with backend:`, error);
    }

    // Save to localStorage (for step tracking until backend supports it)
    this.saveProgress(progress);
    return progress;
  },

  /**
   * Mark task as complete - updates status from "in_progress" to "completed" in database
   */
  async markTaskComplete(
    userId: string,
    taskId: number
  ): Promise<UserTaskProgress> {
    const key = `progress_${userId}_${taskId}`;
    const stored = localStorage.getItem(key);
    const progress: UserTaskProgress = stored
      ? JSON.parse(stored)
      : {
          userId,
          taskId,
          completedSteps: [],
          status: "not-started",
        };

    progress.status = "completed";
    progress.completedAt = new Date().toISOString();

    // Update backend: in_progress → completed
    try {
      const result = await userTaskProgressService.updateTaskStatus(
        userId,
        taskId,
        "completed"
      );
      if (result) {
        console.log(
          `✅ Task ${taskId} completed - Database updated to "completed"`
        );
      } else {
        console.warn(
          `⚠️ Task ${taskId}: Database record missing. Completion tracked locally only.`
        );
      }
    } catch (error) {
      console.error(`❌ Task ${taskId}: Failed to update database:`, error);
    }

    this.saveProgress(progress);
    return progress;
  },

  /**
   * Start task - updates status from "pending" to "in_progress" in database
   * This is the initial action that should update an existing "pending" record
   */
  async startTask(userId: string, taskId: number): Promise<UserTaskProgress> {
    const key = `progress_${userId}_${taskId}`;
    const stored = localStorage.getItem(key);
    const progress: UserTaskProgress = stored
      ? JSON.parse(stored)
      : {
          userId,
          taskId,
          completedSteps: [],
          status: "not-started",
        };

    progress.status = "in-progress";
    progress.startedAt = new Date().toISOString();

    // Update backend: pending → in_progress
    try {
      const result = await userTaskProgressService.updateTaskStatus(
        userId,
        taskId,
        "in_progress"
      );
      if (result) {
        console.log(
          `✅ Task ${taskId} started - Database updated to "in_progress"`
        );
      } else {
        console.warn(
          `⚠️ Task ${taskId}: Database record missing. Status tracked locally only.`
        );
      }
    } catch (error) {
      console.error(`❌ Task ${taskId}: Failed to update database:`, error);
    }

    this.saveProgress(progress);
    return progress;
  },

  saveProgress(progress: UserTaskProgress): void {
    const key = `progress_${progress.userId}_${progress.taskId}`;
    localStorage.setItem(key, JSON.stringify(progress));

    // Notify subscribers
    try {
      this._listeners.forEach((fn) => {
        try {
          fn(progress);
        } catch (e) {
          console.error("progressService subscriber error", e);
        }
      });
    } catch (e) {
      // defensive
    }
  },

  async getAllProgress(userId: string): Promise<UserTaskProgress[]> {
    try {
      const backendProgress = await userTaskProgressService.getUserProgress(
        userId
      );

      // Convert backend DTOs to our local format
      return backendProgress.map((p) => ({
        userId,
        taskId: p.taskId,
        completedSteps: [],
        status: this._mapBackendStatus(p.status),
        startedAt: p.status !== "pending" ? p.updatedAt : undefined,
        completedAt: p.status === "completed" ? p.updatedAt : undefined,
      }));
    } catch (error) {
      console.error("Failed to fetch all progress from backend:", error);

      // Fallback to localStorage
      const results: UserTaskProgress[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(`progress_${userId}_`)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            results.push(JSON.parse(stored));
          }
        }
      }
      return results;
    }
  },

  _mapBackendStatus(
    backendStatus: string
  ): "not-started" | "in-progress" | "completed" {
    if (backendStatus === "pending") return "not-started";
    if (backendStatus === "in_progress") return "in-progress";
    if (backendStatus === "completed") return "completed";
    return "not-started";
  },
};
// ...existing code...
