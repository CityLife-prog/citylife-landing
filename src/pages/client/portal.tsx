import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';
import { 
  FaProjectDiagram, 
  FaDownload, 
  FaComments,
  FaSignOutAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFolder
} from 'react-icons/fa';
import MessageBoard from '@/components/MessageBoard';
import FileUpload from '@/components/FileUpload';

interface Project {
  id: string;
  name: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  budget: number;
  timeline: string;
  progress: number;
  description: string;
  startDate: string;
  dueDate: string;
  files: { name: string; url: string; type: string }[];
  updates: { date: string; message: string; type: 'info' | 'success' | 'warning' }[];
}

export default function ClientPortal() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('projects');

  // Real project data from database
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileManagementProject, setFileManagementProject] = useState<any>(null);
  const [projectFiles, setProjectFiles] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role !== 'client') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/projects', {
          headers: {
            'x-user-data': JSON.stringify(user)
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProjects(data.projects);
          }
        } else {
          console.error('Failed to fetch projects:', response.status);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  if (!user || user.role !== 'client') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'on-hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'success': return <FaCheckCircle className="text-green-500" />;
      case 'warning': return <FaExclamationTriangle className="text-yellow-500" />;
      default: return <FaClock className="text-blue-500" />;
    }
  };

  const handleDownloadFile = (fileName: string, fileUrl: string) => {
    // In a real app, this would handle the actual file download
    alert(`Downloading: ${fileName}\n\n(In a real app, this would download from: ${fileUrl})`);
  };

  const handleManageFiles = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setFileManagementProject(project);
      setProjectFiles([]); // Clear previous files
      
      if (!user) {
        console.error('No user available for file fetch');
        return;
      }
      
      // Fetch files for this project
      try {
        const response = await fetch(`/api/files/${projectId}`, {
          headers: {
            'x-user-data': JSON.stringify(user)
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProjectFiles(data.files);
          }
        } else {
          console.error('Failed to fetch files:', response.status);
          setProjectFiles([]);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
        setProjectFiles([]);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Client Portal - CityLyfe LLC</title>
        <meta name="description" content="CityLyfe LLC Client Portal" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  CityLyfe
                </span>
                <span className="ml-2 text-sm text-gray-500">LLC Client Portal</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {['projects', 'files', 'messages'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading projects...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No projects found.</p>
                </div>
              ) : (
                projects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Project Header */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
                        <p className="text-sm text-gray-600 mt-1">Client: {project.client}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(project.status)}`}>
                        {project.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-1">Budget</h3>
                        <p className="text-2xl font-bold text-blue-600">${project.budget.toLocaleString()}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-1">Timeline</h3>
                        <p className="text-2xl font-bold text-green-600">{project.timeline}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-1">Progress</h3>
                        <p className="text-2xl font-bold text-purple-600">{project.progress}%</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900">Project Progress</h3>
                        <span className="text-sm text-gray-600">{project.progress}% Complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Project Actions */}
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Project Actions</h3>
                        <p className="text-sm text-gray-600">Manage your project files and communications</p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleManageFiles(project.id)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          <FaFolder className="mr-2" />
                          Manage Files
                        </button>
                        <button
                          onClick={() => setActiveTab('messages')}
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          <FaComments className="mr-2" />
                          Messages
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          )}

          {/* Files Tab */}
          {activeTab === 'files' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Project Files</h2>
              <p className="text-gray-600 mb-6">
                Select a project below to view and manage its files. Click "Manage Files" to upload new files or download existing ones.
              </p>
              
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                      <button
                        onClick={() => handleManageFiles(project.id)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <FaFolder className="mr-2" />
                        Manage Files
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-center text-gray-500">
                      <FaFolder className="mx-auto text-4xl mb-2" />
                      <p>Click "Manage Files" to view and upload project files</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaComments />
                  <span>Direct communication with your project manager</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <MessageBoard isAdmin={false} selectedProjectId={projects[0]?.id} />
              </div>

              {/* Instructions for client */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">💬 How to use messaging</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Send messages directly to Matthew Kenner (Project Manager)</li>
                  <li>• Both you and Matthew will receive email notifications</li>
                  <li>• Messages are organized by project for easy tracking</li>
                  <li>• Check back regularly for updates and responses</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Management Modal */}
      {fileManagementProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Project Files - {fileManagementProject.name}
              </h3>
              <button
                onClick={() => setFileManagementProject(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <FileUpload
              projectId={parseInt(fileManagementProject.id)}
              files={projectFiles}
              onFilesChange={setProjectFiles}
              canUpload={true}
              canDelete={false}
            />
          </div>
        </div>
      )}
    </>
  );
}