export interface ChromaDBResponse {
  success: boolean;
  documents_added: number;
  file_type: string;
  message: string;
}

export const chromaDBService = {
  injectDocument: async (documentUrl: string): Promise<ChromaDBResponse> => {
    try {
      const response = await fetch('http://localhost:8000/upload-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: documentUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to inject document to AI');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to inject document to AI');
    }
  }
};