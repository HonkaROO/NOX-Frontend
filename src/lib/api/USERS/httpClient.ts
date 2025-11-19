export class HttpClient {
  constructor(private baseURL: string) {}

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorMessage = await this.handleError(response);
      throw new Error(errorMessage);
    }

    // Handle responses with no content (like DELETE operations)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    return response.json();
  }

  private async handleError(response: Response): Promise<string> {
    let errorMessage = `HTTP error! status: ${response.status}`;

    try {
      const errorData = await response.json();
      console.log('[HttpClient] Detailed error response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorData: errorData
      });

      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.title) {
        errorMessage = errorData.title;
      } else if (errorData.errors) {
        // Handle validation errors (ASP.NET Core format)
        const validationErrors = Object.entries(errorData.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('; ');
        errorMessage = validationErrors || errorMessage;
        
        console.log('[HttpClient] Validation errors parsed:', {
          rawErrors: errorData.errors,
          formattedErrors: validationErrors
        });
      }
    } catch (e) {
      console.log('[HttpClient] Error response is not JSON:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type')
      });
      // If response is not JSON, keep the default error message
    }

    console.log('[HttpClient] Final error message:', errorMessage);
    return errorMessage;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
