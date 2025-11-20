const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5164';

// User Task Progress interfaces
export interface UserTaskProgress {
  taskId: number;
  status: 'pending' | 'in_progress' | 'completed';
  updatedAt: string;
  taskTitle: string;
  taskDescription: string;
}

export interface UpdateTaskStatusRequest {
  status: 'pending' | 'in_progress' | 'completed';
}

// User Task Progress API calls
export const getUserTaskProgress = async (userId: string): Promise<UserTaskProgress[]> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/onboarding/user-tasks/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user task progress');
  }
  
  return response.json();
};

export const updateUserTaskStatus = async (
  userId: string,
  taskId: number,
  status: 'pending' | 'in_progress' | 'completed'
): Promise<UserTaskProgress> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/api/onboarding/user-tasks/${userId}/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update task status');
  }
  
  return response.json();
};