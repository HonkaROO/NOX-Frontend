# Frontend Integration Guide: NOX-Backend + Noxy AI

## 📚 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Environment Setup](#environment-setup)
4. [Understanding the Integration](#understanding-the-integration)
5. [Code Changes Made](#code-changes-made)
6. [How It Works](#how-it-works)
7. [Testing the Integration](#testing-the-integration)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This guide explains how the frontend integrates with **two backend APIs**:

1. **NOX-Backend** (C# ASP.NET Core) - Port 5164
   - Handles file uploads to Azure Blob Storage
   - Manages folders, tasks, materials, and steps
   - Provides authentication & authorization

2. **Noxy AI Service** (Python FastAPI) - Port 8000
   - Powers the chatbot with AI responses
   - Provides semantic search for documents
   - Processes documents for AI indexing

### Key Concept: Backend-to-Backend Integration

**Important:** The frontend does NOT directly upload to Noxy AI. Instead:

```
User uploads file
    ↓
Frontend → NOX-Backend
    ↓
NOX-Backend → Noxy AI (automatically, if file is .pdf/.json/.md)
    ↓
File is stored AND indexed for AI search
```

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                  (React + TypeScript)                        │
│                                                              │
│  Components:                                                 │
│  - FolderModal (Create/Edit folders)                        │
│  - HRUploadModal (Upload files with folder/task selection)  │
│  - HRDocumentManagement (View uploaded materials)           │
│  - ChatbotAssistant (AI chat interface)                     │
└──────────────┬──────────────────────────┬───────────────────┘
               │                          │
               ↓                          ↓
     ┌─────────────────┐       ┌──────────────────┐
     │  NOX-Backend    │←──────│   Noxy AI        │
     │  (Port 5164)    │       │   (Port 8000)    │
     │                 │       │                  │
     │  - File Upload  │       │  - Chat          │
     │  - Folders      │───────→  - Document      │
     │  - Tasks        │ Auto   │    Indexing     │
     │  - Materials    │ Sync   │  - Semantic     │
     │  - Auth         │        │    Search       │
     └────────┬────────┘       └──────────────────┘
              │
              ↓
      ┌───────────────┐
      │  SQL Server   │
      │  (Shared DB)  │
      └───────────────┘
```

---

## Environment Setup

### 1. Environment Variables

File: `.env`

```env
VITE_API_URL=http://localhost:5164              # NOX-Backend
VITE_CHATBOT_API_URL=http://localhost:8000      # Noxy AI
```

### 2. Required Backend Services

Before starting the frontend, ensure both backends are running:

```bash
# Terminal 1: Start NOX-Backend
cd backshots/NOX-Backend
dotnet run

# Terminal 2: Start Noxy AI
cd ai/Noxy
python -m uvicorn Services.main:app --reload --port 8000

# Terminal 3: Start Frontend
cd NOX-Frontend/Nox-Frontend
npm run dev
```

---

## Understanding the Integration

### API Service Architecture

The frontend uses a **service layer pattern** to communicate with backends:

```
Components
    ↓
Services (folderService, taskService, materialService, chatbotService)
    ↓
HttpClient (handles requests, errors, authentication)
    ↓
Backend APIs
```

### File: `src/lib/api/Onboardin/onboardingService.ts`

This is the **main integration file**. It exports services for:

- `folderService` - Folder CRUD operations
- `taskService` - Task CRUD operations
- `materialService` - File upload/download/delete
- `stepService` - Step CRUD operations

**Example:**

```typescript
// Create a folder
const folder = await folderService.create({
  title: "Onboarding Documents",
  description: "Documents for new employees"
});

// Upload a file
const material = await materialService.upload(taskId, file);

// Get all materials
const materials = await materialService.getAll();
```

---

## Code Changes Made

### 1. Fixed `onboardingService.ts`

**What was changed:**
- Removed duplicate folder creation code
- Added task CRUD methods (`create`, `update`, `delete`)
- All services now use the `httpClient` for consistent error handling

**Understanding the Code:**

```typescript
// ✅ GOOD: Uses httpClient (clean, handles auth automatically)
async create(data: CreateTaskRequest): Promise<OnboardingTask> {
  return httpClient.post<OnboardingTask>('/onboarding/tasks', data);
}

// ❌ BAD: Manual fetch (repetitive, error-prone)
async create(data: CreateTaskRequest): Promise<OnboardingTask> {
  const response = await fetch(`${API_BASE_URL}/onboarding/tasks`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  // ... error handling ...
  return response.json();
}
```

**Why httpClient is better:**
- Automatically includes authentication cookies
- Centralized error handling
- Less code duplication
- Type-safe with TypeScript generics

---

### 2. Updated `FolderModal.tsx`

**What was changed:**
- Connected to `folderService.create()` and `folderService.update()`
- Added loading states (`isLoading`)
- Added error handling with toast notifications
- Form now actually creates/updates folders in the backend

**Understanding the Code:**

```typescript
const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault(); // Prevent page reload
  setIsLoading(true); // Show loading spinner

  try {
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    };

    let savedFolder: OnboardingFolder;

    if (type === 'edit' && folder) {
      // UPDATE existing folder
      savedFolder = await folderService.update(folder.id, data);
      toast({ title: "Success", description: "Folder updated!" });
    } else {
      // CREATE new folder
      savedFolder = await folderService.create(data);
      toast({ title: "Success", description: "Folder created!" });
    }

    // Notify parent component
    if (onSave) {
      onSave(savedFolder);
    }

    onOpenChange(false); // Close modal
  } catch (error) {
    // Show error message
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to save folder",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false); // Hide loading spinner
  }
};
```

**Key Concepts:**

1. **FormData**: Extracts form field values
   ```typescript
   const formData = new FormData(e.currentTarget);
   const title = formData.get('title') as string;
   ```

2. **Async/Await**: Waits for API call to complete
   ```typescript
   await folderService.create(data); // Waits for response
   ```

3. **Try/Catch**: Handles errors gracefully
   ```typescript
   try {
     // API call
   } catch (error) {
     // Show error to user
   }
   ```

4. **Loading States**: Shows feedback to user
   ```typescript
   setIsLoading(true);  // Button shows "Saving..."
   // API call
   setIsLoading(false); // Button shows "Add Folder"
   ```

---

### 3. Updated `HRUploadModal.tsx`

**What was changed:**
- ❌ Removed hardcoded `taskId = 1`
- ✅ Added folder and task selection dropdowns
- ✅ Added AI-indexable badge (shows if file will be searchable)
- ✅ Added folder/task loading from API
- ✅ Improved upload success messages

**Understanding the Code:**

#### Part 1: Folder & Task Selection

```typescript
// Load folders when modal opens
useEffect(() => {
  if (open) {
    loadFolders();
  }
}, [open]); // Runs when 'open' changes

// Load tasks when folder is selected
useEffect(() => {
  if (selectedFolderId) {
    loadTasks(parseInt(selectedFolderId));
  }
}, [selectedFolderId]); // Runs when folder selection changes

const loadFolders = async () => {
  setIsLoadingFolders(true);
  try {
    const data = await folderService.getAll();
    setFolders(data); // Update dropdown options
  } catch (error) {
    toast.error("Failed to load folders");
  } finally {
    setIsLoadingFolders(false);
  }
};
```

**Why useEffect?**
- `useEffect` runs code when something changes
- First effect: Load folders when modal opens
- Second effect: Load tasks when user selects a folder
- This creates a **cascading dropdown** pattern

#### Part 2: AI-Indexable Badge

```typescript
// Check if file can be indexed by AI
const isAiIndexable = (fileName: string): boolean => {
  const aiIndexableTypes = [".pdf", ".json", ".md"];
  const fileExt = "." + fileName.split(".").pop()?.toLowerCase();
  return aiIndexableTypes.includes(fileExt);
};

// Show badge in UI
{isAiIndexable(selectedFile.name) ? (
  <div className="flex items-center gap-1">
    <Sparkles size={12} className="text-purple-600" />
    <span className="text-xs text-purple-600">AI-Searchable</span>
  </div>
) : (
  <div className="flex items-center gap-1">
    <FileWarning size={12} className="text-amber-600" />
    <span className="text-xs text-amber-600">Storage Only</span>
  </div>
)}
```

**Why this matters:**
- **AI-Searchable files (.pdf, .json, .md)**: Backend automatically sends to Noxy AI
- **Storage-only files**: Stored in Azure Blob but NOT indexed for chatbot
- User sees upfront which files will be searchable

#### Part 3: Upload with Validation

```typescript
const handleSubmit = async () => {
  // Validation 1: File selected?
  if (!selectedFile) {
    toast.error("No file selected");
    return;
  }

  // Validation 2: Task selected?
  if (!selectedTaskId) {
    toast.error("Please select a folder and task");
    return;
  }

  setIsUploading(true);

  try {
    const taskId = parseInt(selectedTaskId);

    // Upload to NOX-Backend
    await materialService.upload(taskId, selectedFile);

    // Show appropriate success message
    const isIndexable = isAiIndexable(selectedFile.name);
    toast.success("Document uploaded successfully!", {
      description: isIndexable
        ? "File uploaded and will be indexed for AI search"
        : "File uploaded to storage",
    });

    // Reset form and close modal
    setSelectedFile(null);
    setSelectedFolderId("");
    setSelectedTaskId("");
    onOpenChange(false);
  } catch (error: any) {
    toast.error("Upload failed", {
      description: error.message,
    });
  } finally {
    setIsUploading(false);
  }
};
```

**Key Validation Steps:**
1. Check if file is selected
2. Check if task is selected (user must choose folder → task)
3. Upload to backend
4. Show different messages for AI-indexable vs storage-only files

---

### 4. Updated `HRDocumentManagement.tsx`

**What was changed:**
- ❌ Removed mock data (`INITIAL_DOCUMENTS`)
- ✅ Load real materials from `materialService.getAll()`
- ✅ Updated statistics cards to show AI-searchable count
- ✅ Added loading states
- ✅ Added delete functionality
- ✅ Auto-reload after upload

**Understanding the Code:**

#### Part 1: Loading Data from API

```typescript
const [materials, setMaterials] = useState<OnboardingMaterial[]>([]);
const [isLoading, setIsLoading] = useState(true);

// Load materials when component mounts
useEffect(() => {
  loadMaterials();
}, []); // Empty array = run once on mount

const loadMaterials = async () => {
  setIsLoading(true);
  try {
    const data = await materialService.getAll();
    setMaterials(data); // Update state with API data
  } catch (error) {
    toast.error("Failed to load materials");
  } finally {
    setIsLoading(false);
  }
};
```

**React Component Lifecycle:**
1. Component mounts (appears on screen)
2. `useEffect` runs → calls `loadMaterials()`
3. API call fetches data
4. `setMaterials(data)` updates state
5. Component re-renders with real data

#### Part 2: Dynamic Statistics

```typescript
<div className="grid grid-cols-4 gap-6">
  {/* Total Documents */}
  <div>
    <span className="text-gray-600">Total Documents</span>
    <span className="text-2xl font-semibold">
      {isLoading ? <Loader2 className="animate-spin" /> : materials.length}
    </span>
  </div>

  {/* AI-Searchable Count */}
  <div>
    <span className="text-gray-600">AI-Searchable</span>
    <span className="text-2xl font-semibold">
      {materials.filter(m => isAiIndexable(m.fileName)).length}
    </span>
  </div>

  {/* Storage Only Count */}
  <div>
    <span className="text-gray-600">Storage Only</span>
    <span className="text-2xl font-semibold">
      {materials.filter(m => !isAiIndexable(m.fileName)).length}
    </span>
  </div>
</div>
```

**Understanding `.filter()`:**
```typescript
// Returns only materials where fileName ends with .pdf, .json, or .md
materials.filter(m => isAiIndexable(m.fileName))

// Returns materials where file is NOT AI-indexable
materials.filter(m => !isAiIndexable(m.fileName))

// .length gives you the count
materials.filter(...).length
```

#### Part 3: Rendering Materials

```typescript
{isLoading ? (
  // Show loading spinner
  <Loader2 className="animate-spin" />
) : filteredDocuments.length === 0 ? (
  // Show empty state
  <div>No documents found</div>
) : (
  // Show materials
  filteredDocuments.map((material) => (
    <div key={material.id}>
      <h3>{material.fileName}</h3>
      <a href={material.url} target="_blank">View</a>
      <button onClick={() => handleDeleteMaterial(material.id)}>
        Delete
      </button>
    </div>
  ))
)}
```

**Understanding Conditional Rendering:**
- `isLoading ? A : B` - If loading, show A, else show B
- `length === 0 ? A : B` - If empty, show A, else show B
- `.map()` - Loop through array and render component for each item

#### Part 4: Auto-Reload After Upload

```typescript
<UploadDocumentDialog
  open={uploadDialogOpen}
  onOpenChange={(open) => {
    setUploadDialogOpen(open);
    if (!open) {
      // Modal closed - reload materials
      loadMaterials();
    }
  }}
/>
```

**Why this works:**
1. User uploads file
2. Upload modal closes (`open` becomes `false`)
3. `onOpenChange` detects closure
4. Calls `loadMaterials()` to refresh the list
5. New file appears in the grid!

---

## How It Works

### Complete Upload Flow

```
1. User clicks "Upload Document"
    ↓
2. HRUploadModal opens
    ↓
3. Modal loads folders from API
    ↓
4. User selects folder → Tasks load for that folder
    ↓
5. User selects task
    ↓
6. User selects file (.pdf, .json, or .md)
    ↓
7. Badge shows "AI-Searchable ✨"
    ↓
8. User clicks "Upload"
    ↓
9. Frontend sends to NOX-Backend: POST /onboarding/materials
    ↓
10. NOX-Backend:
    - Uploads file to Azure Blob Storage
    - Saves metadata to SQL Server
    - Checks if file is .pdf/.json/.md
    - If yes → Sends to Noxy AI: POST /upload-document
    ↓
11. Noxy AI:
    - Downloads file from Azure Blob URL
    - Extracts text content
    - Creates vector embeddings
    - Stores in ChromaDB for semantic search
    ↓
12. Frontend:
    - Shows success toast
    - Closes modal
    - Reloads materials list
    - User sees new file with "AI-Searchable" badge
    ↓
13. User can now search for file content in Chatbot!
```

### Chatbot Integration

```
User asks chatbot: "What is the SSS registration process?"
    ↓
Frontend: POST /chat
    ↓
Noxy AI:
    - Converts question to vector embedding
    - Searches ChromaDB for similar documents
    - Finds relevant chunks from uploaded PDFs
    - Sends to Azure OpenAI with context
    - Returns AI-generated answer
    ↓
Chatbot shows answer with document references
```

---

## Testing the Integration

### Test 1: Folder Creation

1. Open the app
2. Navigate to Document Management
3. Click "Add Folder" (or wherever folder creation is)
4. Enter folder details:
   - Title: "Test Folder"
   - Description: "Testing integration"
5. Click "Create Folder"

**Expected Result:**
- ✅ Success toast appears
- ✅ Modal closes
- ✅ Folder appears in folder list
- ✅ Check database - folder should be saved

**Debugging:**
```typescript
// Check browser console for errors
console.log("Folder created:", savedFolder);

// Check network tab
// POST /onboarding/folders should return 201 Created
```

---

### Test 2: File Upload (AI-Indexable)

1. Click "Upload Document"
2. Select folder: "Test Folder"
3. Select/Create task under that folder
4. Upload a PDF file
5. Verify badge shows "AI-Searchable ✨"
6. Click "Upload"

**Expected Result:**
- ✅ Success toast: "File uploaded and will be indexed for AI search"
- ✅ Modal closes
- ✅ File appears in document grid with purple badge
- ✅ File is searchable in chatbot after ~30 seconds

**Backend Verification:**
```bash
# Check NOX-Backend logs
# Should see:
[INF] Material created: {...}
[INF] Uploading to AI service: {url}
[INF] AI upload successful

# Check Noxy AI logs
# Should see:
INFO: Downloading file from {url}
INFO: Extracted {n} chunks
INFO: Added to vector database
```

---

### Test 3: File Upload (Storage Only)

1. Upload a file that is NOT .pdf/.json/.md
2. Verify badge shows "Storage Only"

**Expected Result:**
- ✅ Toast: "File uploaded to storage"
- ✅ File has amber badge in grid
- ✅ File NOT searchable in chatbot
- ✅ Still viewable via "View" button (opens Azure Blob URL)

---

### Test 4: Document List & Statistics

1. Navigate to Document Management
2. Check statistics cards

**Expected Result:**
- ✅ "Total Documents" shows correct count
- ✅ "AI-Searchable" shows count of .pdf/.json/.md files
- ✅ "Storage Only" shows count of other files
- ✅ Document grid shows all uploaded materials
- ✅ Each material has correct badge

---

### Test 5: Chatbot Search

1. Upload a PDF with known content (e.g., "SSS Registration Process")
2. Wait 30-60 seconds for indexing
3. Open chatbot
4. Ask: "What is the SSS registration process?"

**Expected Result:**
- ✅ Chatbot returns relevant answer from PDF
- ✅ Response includes context from uploaded document

---

## Troubleshooting

### Problem: "Failed to load folders"

**Possible Causes:**
1. NOX-Backend is not running
2. Wrong API URL in `.env`
3. Not authenticated

**Solution:**
```bash
# Check backend is running
curl http://localhost:5164/onboarding/folders

# Check .env file
cat .env
# Should show: VITE_API_URL=http://localhost:5164

# Check browser console for auth errors
# If "401 Unauthorized", user needs to log in first
```

---

### Problem: File uploads but not searchable in chatbot

**Possible Causes:**
1. File is not .pdf/.json/.md
2. Noxy AI service is down
3. Backend failed to forward to Noxy AI

**Solution:**
```bash
# Check file extension
# Only .pdf, .json, .md are indexed

# Check Noxy AI is running
curl http://localhost:8000/

# Check NOX-Backend logs for AI upload errors
# Look for: "AI indexing failed"

# Check Noxy AI logs
cd ai/Noxy
# Look for: "Downloaded file from {url}"
```

---

### Problem: "Upload failed: 401 Unauthorized"

**Cause:** User not logged in or session expired

**Solution:**
```typescript
// User needs to log in first
// Check AuthContext
console.log("Current user:", user);

// If null, redirect to login
if (!user) {
  navigate('/login');
}
```

---

### Problem: Materials not showing after upload

**Possible Causes:**
1. Upload succeeded but list not refreshed
2. API call failing silently

**Solution:**
```typescript
// Add console.log to loadMaterials
const loadMaterials = async () => {
  console.log("Loading materials...");
  const data = await materialService.getAll();
  console.log("Loaded materials:", data);
  setMaterials(data);
};

// Check if onOpenChange is called
onOpenChange={(open) => {
  console.log("Modal closed, reloading:", open);
  if (!open) {
    loadMaterials();
  }
}}
```

---

### Problem: "Network Error" when uploading

**Possible Causes:**
1. Backend CORS configuration
2. File too large
3. Backend crashed

**Solution:**
```bash
# Check backend CORS settings
# NOX-Backend/Program.cs should have:
builder.Services.AddCors(options => {
  options.AddPolicy("AllowFrontend", builder => {
    builder.WithOrigins("http://localhost:5173")
           .AllowCredentials()
           .AllowAnyHeader()
           .AllowAnyMethod();
  });
});

# Check file size limit (currently 10MB)
# Increase if needed in:
# - HRUploadModal.tsx: maxFileSize = 10 * 1024 * 1024
# - Backend: [RequestSizeLimit(52428800)] for 50MB

# Restart backend
cd backshots/NOX-Backend
dotnet run
```

---

## Summary

### What We Built

1. ✅ **Folder Management**: Create/edit folders connected to NOX-Backend
2. ✅ **File Upload**: Upload files with folder/task selection
3. ✅ **AI-Indexable Indicators**: Show which files are searchable
4. ✅ **Real Data**: Replaced mock data with live API calls
5. ✅ **Document Management**: View, delete materials with statistics
6. ✅ **Backend Integration**: Frontend → NOX-Backend → Noxy AI

### Key Files Modified

- `src/lib/api/Onboardin/onboardingService.ts` - API service layer
- `src/components/modals/ADMINHR/FolderModal.tsx` - Folder creation
- `src/components/modals/ADMINHR/HRUploadModal.tsx` - File upload
- `src/pages/AdminPages/HRDocumentManagement.tsx` - Document list

### Integration Pattern

```typescript
// 1. Service Layer (onboardingService.ts)
export const folderService = {
  async create(data) {
    return httpClient.post('/onboarding/folders', data);
  }
};

// 2. Component (FolderModal.tsx)
const handleSave = async () => {
  const folder = await folderService.create(data);
  toast.success("Created!");
};

// 3. Parent Component (HRDocumentManagement.tsx)
useEffect(() => {
  loadMaterials(); // Fetch on mount
}, []);
```

---

## Next Steps

### Potential Improvements

1. **Upload Progress Bar**: Show upload percentage
2. **Batch Upload**: Upload multiple files at once
3. **Retry Failed Uploads**: Retry button for failed AI indexing
4. **File Preview**: Preview PDFs before uploading
5. **Advanced Search**: Filter by file type, date range
6. **Folder Tree View**: Hierarchical folder display
7. **Drag & Drop Reorder**: Reorder tasks within folders

### Learning Resources

- **React Hooks**: https://react.dev/reference/react
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **Async/Await**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

---

**Need Help?**
- Check browser console for errors
- Check network tab for failed requests
- Check backend logs for API errors
- Read the inline comments in the code!

Happy coding! 🚀
