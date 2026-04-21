# Upload Feature Documentation

## Overview

The upload feature allows users to upload documents through a beautiful modal interface with drag-and-drop support.

## Features

### ✅ Upload Modal
- **Beautiful UI** - Modern, clean design with smooth animations
- **Drag & Drop** - Drag files directly into the upload area
- **File Browser** - Click to browse and select files
- **File Preview** - See selected file with icon, name, and size
- **Form Validation** - Real-time validation of file type and size

### ✅ Supported File Types
- **Documents**: PDF, Word (.doc, .docx)
- **Spreadsheets**: Excel (.xls, .xlsx)
- **Presentations**: PowerPoint (.ppt, .pptx)
- **Images**: JPEG, PNG, GIF
- **Text**: TXT, CSV

### ✅ File Size Limit
- Maximum: **10MB** per file
- Automatic validation with error messages

### ✅ Document Metadata
- **Document Name** (required)
- **Description** (optional)
- **Category** (dropdown selection)
- **Status** (Pending, In Review, Approved, Rejected)
- **Tags** (comma-separated)

## How to Use

### Method 1: Sidebar Menu
1. Click **"Upload"** in the sidebar
2. Upload modal opens

### Method 2: Quick Actions
1. Click **"Upload Document"** in Quick Actions panel
2. Upload modal opens

### Method 3: New Document Button
1. Click **"+ New Document"** button in Recent Documents section
2. Upload modal opens

## Upload Process

### Step 1: Select File
- **Drag & Drop**: Drag file into the upload area
- **Browse**: Click "Browse Files" button

### Step 2: Fill Details
- **Document Name**: Auto-filled with filename (editable)
- **Description**: Optional description
- **Category**: Select from dropdown
- **Status**: Choose document status
- **Tags**: Add comma-separated tags

### Step 3: Upload
- Click **"Upload Document"** button
- Progress indicator shows during upload
- Success message appears when complete
- Document appears in the list

## API Integration

The upload feature connects to your Django backend:

```javascript
// API Endpoint
POST http://localhost:8000/api/documents/

// Headers
Authorization: Bearer {JWT_TOKEN}

// Body (FormData)
- file: (binary file)
- name: "Document Name"
- description: "Description"
- category: "Category"
- status: "Pending"
- tags: ["tag1", "tag2"]
```

## File Validation

### Client-Side Validation
- File type checking
- File size checking (10MB limit)
- Required field validation

### Server-Side Validation
- Additional security checks
- File type verification
- Size limit enforcement

## Error Handling

### Common Errors
- **"File size must be less than 10MB"**
  - Solution: Compress or split the file

- **"File type not supported"**
  - Solution: Convert to supported format

- **"Please select a file to upload"**
  - Solution: Select a file first

- **"Upload failed. Please check your connection"**
  - Solution: Check internet connection and backend server

## UI Components

### Upload Modal Structure
```
┌─────────────────────────────────────┐
│ Upload Document                  ✕  │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │   📁 Drag & Drop Area         │ │
│  │   or Browse Files             │ │
│  └───────────────────────────────┘ │
│                                     │
│  Document Name: [____________]      │
│  Description:   [____________]      │
│  Category:      [▼ Dropdown  ]      │
│  Status:        [▼ Dropdown  ]      │
│  Tags:          [____________]      │
│                                     │
│  [Cancel]  [Upload Document]        │
└─────────────────────────────────────┘
```

## Styling

### Colors
- **Primary**: Blue (#2563eb)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Gray**: Various shades for text and borders

### Animations
- Smooth modal fade-in
- Drag-over highlight effect
- Button hover transitions
- Loading spinner during upload

## Code Structure

### Template
- Modal overlay with backdrop
- Form with file input
- Drag & drop handlers
- Success/error messages

### Script
- File validation logic
- Upload API call
- Form state management
- Error handling

### Methods
- `handleFileSelect()` - File input change
- `handleFileDrop()` - Drag & drop handler
- `validateAndSetFile()` - File validation
- `handleUpload()` - Upload to server
- `closeUploadModal()` - Close and reset

## Testing

### Test Cases
1. ✅ Upload valid PDF file
2. ✅ Upload file via drag & drop
3. ✅ Upload file via browse button
4. ✅ Reject file over 10MB
5. ✅ Reject unsupported file type
6. ✅ Show error for missing required fields
7. ✅ Display success message on upload
8. ✅ Add document to list after upload

## Future Enhancements

### Planned Features
- [ ] Multiple file upload
- [ ] Upload progress bar
- [ ] File preview before upload
- [ ] Bulk upload from folder
- [ ] Resume interrupted uploads
- [ ] Image compression
- [ ] OCR for scanned documents
- [ ] Version control for documents

## Troubleshooting

### Modal doesn't open
- Check `showUploadModal` state
- Verify click handlers are bound

### File not uploading
- Check backend server is running
- Verify API endpoint URL
- Check authentication token
- Review browser console for errors

### Drag & drop not working
- Ensure drag event handlers are bound
- Check browser compatibility
- Verify file type is supported

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Security

### Client-Side
- File type validation
- File size validation
- XSS prevention

### Server-Side
- JWT authentication required
- File type verification
- Virus scanning (recommended)
- Storage path sanitization

## Performance

### Optimizations
- Lazy loading of modal
- Efficient file reading
- Minimal re-renders
- Debounced validation

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- Focus management
- ARIA labels

## Related Files

- `frontend/src/views/Dashboard.vue` - Main component
- `backend/api/views.py` - Upload endpoint
- `backend/api/serializers.py` - Upload serializer
- `backend/api/models.py` - Document model

## API Response Example

### Success Response
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "document": {
    "id": 1,
    "document_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Annual Report 2026.pdf",
    "file_url": "http://localhost:8000/media/documents/...",
    "file_type": "PDF",
    "file_size": 2458624,
    "status": "Pending",
    "created_at": "2026-04-21T10:30:00Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "File size exceeds maximum limit"
}
```

## Quick Reference

### Open Upload Modal
```javascript
this.showUploadModal = true;
```

### Close Upload Modal
```javascript
this.closeUploadModal();
```

### Validate File
```javascript
this.validateAndSetFile(file);
```

### Upload File
```javascript
await this.handleUpload();
```

## Support

For issues or questions:
1. Check browser console for errors
2. Verify backend server is running
3. Check API endpoint configuration
4. Review error messages in modal
