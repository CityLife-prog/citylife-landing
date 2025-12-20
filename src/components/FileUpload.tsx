import { useState, useRef, useEffect } from 'react';
import { FaUpload, FaFile, FaTrash, FaDownload, FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

interface FileItem {
  id: number;
  name: string;
  type: string;
  url: string;
  size: number;
  created_at: string;
}

interface FileUploadProps {
  projectId: number;
  files: FileItem[];
  onFilesChange: (files: FileItem[]) => void;
  canUpload?: boolean;
  canDelete?: boolean;
}

export default function FileUpload({ 
  projectId, 
  files, 
  onFilesChange,
  canUpload = true,
  canDelete = true
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // Fetch files when component mounts or projectId changes
  useEffect(() => {
    if (projectId && user) {
      fetchFiles();
    }
  }, [projectId, user?.id]); // Only depend on user.id to avoid infinite re-renders

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles || !canUpload) return;
    
    Array.from(selectedFiles).forEach(file => uploadFile(file));
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId.toString());

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          'x-user-data': JSON.stringify(user)
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh files list
          fetchFiles();
        }
      } else {
        console.error('Upload failed');
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const fetchFiles = async () => {
    if (!user || !projectId) {
      return;
    }
    
    try {
      const response = await fetch(`/api/files/${projectId}`, {
        headers: {
          'x-user-data': JSON.stringify(user)
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          onFilesChange(data.files);
        }
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const deleteFile = async (fileId: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/files/delete/${fileId}`, {
        method: 'DELETE',
        headers: {
          'x-user-data': JSON.stringify(user)
        }
      });

      if (response.ok) {
        fetchFiles(); // Refresh files list
      } else {
        alert('Failed to delete file. Please try again.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const downloadFile = (file: FileItem) => {
    // Create a temporary link and click it to download
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'image': return '🖼️';
      case 'document': return '📝';
      case 'spreadsheet': return '📊';
      case 'presentation': return '📋';
      case 'archive': return '🗜️';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      default: return '📁';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (canUpload) setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (canUpload) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {canUpload && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'opacity-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <FaSpinner className="text-4xl text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Uploading...</p>
            </div>
          ) : (
            <>
              <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Maximum file size: 10MB
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                disabled={uploading}
              >
                Choose Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
                disabled={uploading}
              />
            </>
          )}
        </div>
      )}

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-900">Project Files</h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getFileIcon(file.type)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadFile(file)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                    title="Download file"
                  >
                    <FaDownload />
                  </button>
                  {canDelete && (
                    <button
                      onClick={() => deleteFile(file.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                      title="Delete file"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length === 0 && !canUpload && (
        <div className="text-center py-8 text-gray-500">
          <FaFile className="text-4xl mx-auto mb-4" />
          <p>No files uploaded yet.</p>
        </div>
      )}
    </div>
  );
}