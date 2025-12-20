import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';
import { 
  FaUsers, 
  FaProjectDiagram, 
  FaDollarSign, 
  FaEnvelope,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSignOutAlt,
  FaComments,
  FaFolder
} from 'react-icons/fa';
import MessageBoard from '@/components/MessageBoard';
import FileUpload from '@/components/FileUpload';

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'planning' | 'in-progress' | 'completed';
  budget: number;
  timeline: string;
  progress: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  projects: number;
  totalSpent: number;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Data from database
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [fileManagementProject, setFileManagementProject] = useState<Project | null>(null);
  const [projectFiles, setProjectFiles] = useState<any[]>([]);

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'admin') return;
      
      try {
        const [projectsRes, clientsRes] = await Promise.all([
          fetch('/api/projects', {
            headers: {
              'x-user-data': JSON.stringify(user)
            }
          }),
          fetch('/api/clients', {
            headers: {
              'x-user-data': JSON.stringify(user)
            }
          })
        ]);

        const projectsData = await projectsRes.json();
        const clientsData = await clientsRes.json();

        if (projectsData.success) {
          setProjects(projectsData.projects.map((p: any) => ({
            id: p.id.toString(),
            name: p.name,
            client: p.client,
            status: p.status,
            budget: p.budget,
            timeline: p.timeline,
            progress: p.progress
          })));
        }

        if (clientsData.success) {
          setClients(clientsData.clients.map((c: any) => ({
            id: c.id.toString(),
            name: c.name,
            email: c.email,
            company: c.company,
            projects: c.projects,
            totalSpent: c.total_spent
          })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Helper function to refresh data
  const refreshData = async () => {
    if (!user || user.role !== 'admin') return;
    
    try {
      const [projectsRes, clientsRes] = await Promise.all([
        fetch('/api/projects', {
          headers: {
            'x-user-data': JSON.stringify(user)
          }
        }),
        fetch('/api/clients', {
          headers: {
            'x-user-data': JSON.stringify(user)
          }
        })
      ]);

      const projectsData = await projectsRes.json();
      const clientsData = await clientsRes.json();

      if (projectsData.success) {
        setProjects(projectsData.projects.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          client: p.client,
          status: p.status,
          budget: p.budget,
          timeline: p.timeline,
          progress: p.progress
        })));
      }

      if (clientsData.success) {
        setClients(clientsData.clients.map((c: any) => ({
          id: c.id.toString(),
          name: c.name,
          email: c.email,
          company: c.company,
          projects: c.projects,
          totalSpent: c.total_spent
        })));
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = projects.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.budget, 0);
  const activeProjects = projects.filter(p => p.status === 'in-progress').length;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Action handlers
  const handleEditProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setEditingProject(project);
    }
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
        }
      } catch (error) {
        console.error('Error fetching files:', error);
        setProjectFiles([]);
      }
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      const response = await fetch('/api/projects/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updatedProject.id,
          name: updatedProject.name,
          client: updatedProject.client,
          status: updatedProject.status,
          budget: updatedProject.budget,
          timeline: updatedProject.timeline,
          progress: updatedProject.progress
        })
      });
      if (response.ok) {
        alert('Project updated successfully');
        setEditingProject(null);
        await refreshData();
      } else {
        alert('Failed to update project');
      }
    } catch (error) {
      alert('Error updating project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project && confirm(`Are you sure you want to delete "${project.name}"?\n\nThis action cannot be undone.`)) {
      try {
        const response = await fetch('/api/projects/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: projectId })
        });
        if (response.ok) {
          alert(`Project "${project.name}" deleted`);
          await refreshData();
        } else {
          alert('Failed to delete project');
        }
      } catch (error) {
        alert('Error deleting project');
      }
    }
  };

  const handleEditClient = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setEditingClient(client);
    }
  };

  const handleUpdateClient = async (updatedClient: Client) => {
    try {
      const response = await fetch('/api/clients/update', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-data': JSON.stringify(user)
        },
        body: JSON.stringify({
          id: updatedClient.id,
          name: updatedClient.name,
          email: updatedClient.email,
          company: updatedClient.company,
          projects: updatedClient.projects,
          total_spent: updatedClient.totalSpent
        })
      });
      if (response.ok) {
        alert('Client updated successfully');
        setEditingClient(null);
        await refreshData();
      } else {
        alert('Failed to update client');
      }
    } catch (error) {
      alert('Error updating client');
    }
  };

  const handleNewProject = async () => {
    const projectName = prompt('Enter new project name:');
    const clientName = prompt('Enter client name:');
    const budget = prompt('Enter budget (numbers only):');
    
    if (projectName && clientName && budget) {
      try {
        const response = await fetch('/api/projects/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: projectName,
            client: clientName,
            budget: parseInt(budget),
            status: 'planning',
            timeline: '4 weeks',
            progress: 0
          })
        });
        if (response.ok) {
          alert(`New project "${projectName}" created`);
          await refreshData();
        } else {
          alert('Failed to create project');
        }
      } catch (error) {
        alert('Error creating project');
      }
    }
  };

  const handleNewClient = async () => {
    const clientName = prompt('Enter client name:');
    const email = prompt('Enter client email:');
    const company = prompt('Enter company name:');
    
    if (clientName && email && company) {
      try {
        const response = await fetch('/api/clients/create', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-data': JSON.stringify(user)
          },
          body: JSON.stringify({
            name: clientName,
            email,
            company,
            projects: 0,
            totalSpent: 0
          })
        });
        if (response.ok) {
          alert(`New client "${clientName}" created`);
          await refreshData();
        } else {
          alert('Failed to create client');
        }
      } catch (error) {
        alert('Error creating client');
      }
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - CityLyfe LLC</title>
        <meta name="description" content="CityLyfe LLC Admin Dashboard" />
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
                <span className="ml-2 text-sm text-gray-500">LLC Admin</span>
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
              {['overview', 'projects', 'clients', 'messages'].map((tab) => (
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

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaProjectDiagram className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Projects</p>
                      <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FaDollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-semibold text-gray-900">${totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <FaProjectDiagram className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Projects</p>
                      <p className="text-2xl font-semibold text-gray-900">{activeProjects}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FaUsers className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Clients</p>
                      <p className="text-2xl font-semibold text-gray-900">{clients.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Projects */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {projects.slice(0, 3).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{project.name}</h4>
                          <p className="text-sm text-gray-600">{project.client}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                            {project.status.replace('-', ' ')}
                          </span>
                          <span className="text-sm font-medium text-gray-900">${project.budget.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                <button 
                  onClick={handleNewProject}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>New Project</span>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{project.name}</div>
                            <div className="text-sm text-gray-500">{project.timeline}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.client}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                            {project.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${project.budget.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{project.progress}%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button 
                            onClick={() => handleEditProject(project.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit Project"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleManageFiles(project.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Manage Files"
                          >
                            <FaFolder />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Project"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Clients Tab */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
                <button 
                  onClick={handleNewClient}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>New Client</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => (
                  <div key={client.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditClient(client.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Client"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <FaEnvelope className="inline mr-2" />
                        {client.email}
                      </p>
                      <p className="text-sm text-gray-600">{client.company}</p>
                      <div className="flex justify-between pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500">Projects</p>
                          <p className="text-lg font-semibold text-gray-900">{client.projects}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Spent</p>
                          <p className="text-lg font-semibold text-gray-900">${client.totalSpent.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Client Messages</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaComments />
                  <span>Real-time messaging with email notifications</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <MessageBoard isAdmin={true} />
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">📧 Email Notifications</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Every message sent automatically emails both you and the client</li>
                  <li>• Email goes to: citylife32@outlook.com (you) and client's email</li>
                  <li>• Clients can reply via the portal or email</li>
                  <li>• Unread messages are highlighted with a blue border</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Project</h3>
            <ProjectEditForm 
              project={editingProject}
              onSave={handleUpdateProject}
              onCancel={() => setEditingProject(null)}
            />
          </div>
        </div>
      )}

      {/* Client Edit Modal */}
      {editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Client</h3>
            <ClientEditForm 
              client={editingClient}
              onSave={handleUpdateClient}
              onCancel={() => setEditingClient(null)}
            />
          </div>
        </div>
      )}

      {/* File Management Modal */}
      {fileManagementProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Manage Files - {fileManagementProject.name}
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
              canDelete={true}
            />
          </div>
        </div>
      )}
    </>
  );
}

// Project Edit Form Component
function ProjectEditForm({ project, onSave, onCancel }: {
  project: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(project);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof Project, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
        <input
          type="text"
          value={formData.client}
          onChange={(e) => handleChange('client', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value as Project['status'])}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="planning">Planning</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
        <input
          type="number"
          value={formData.budget}
          onChange={(e) => handleChange('budget', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
        <input
          type="text"
          value={formData.timeline}
          onChange={(e) => handleChange('timeline', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., 4 weeks"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e) => handleChange('progress', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="w-12 text-sm font-medium text-gray-700">{formData.progress}%</span>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Client Edit Form Component
function ClientEditForm({ client, onSave, onCancel }: {
  client: Client;
  onSave: (client: Client) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(client);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof Client, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Projects</label>
        <input
          type="number"
          value={formData.projects}
          onChange={(e) => handleChange('projects', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Total Spent ($)</label>
        <input
          type="number"
          value={formData.totalSpent}
          onChange={(e) => handleChange('totalSpent', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min="0"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}