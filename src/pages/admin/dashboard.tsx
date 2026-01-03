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
  FaFolder,
  FaTimes,
  FaArrowLeft,
  FaBell,
  FaCheck,
  FaStar,
  FaUserCircle
} from 'react-icons/fa';
import MessageBoard from '@/components/MessageBoard';
import FileUpload from '@/components/FileUpload';

interface Project {
  id: string;
  name: string;
  display_title?: string;
  client: string;
  client_id?: string;
  description?: string;
  technologies?: string;
  key_results?: string;
  live_url?: string;
  category?: string;
  status: 'quote' | 'planning' | 'in-progress' | 'completed' | 'on-hold';
  budget: number;
  timeline: string;
  progress: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  website?: string;
  contact_role?: string;
  address?: string;
  projects: number;
  totalSpent: number;
}

interface ClientContact {
  id: string;
  client_id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  is_primary: boolean;
}

interface Review {
  id: string;
  client_name: string;
  client_title: string;
  client_company: string;
  rating: number;
  review_text: string;
  project_name?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Data from database
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [projectFiles, setProjectFiles] = useState<any[]>([]);
  const [showCreateReviewModal, setShowCreateReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewInitialData, setReviewInitialData] = useState<any>(null);
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [clientContacts, setClientContacts] = useState<ClientContact[]>([]);

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'admin') return;

      try {
        const [projectsRes, clientsRes, reviewsRes, notificationsRes] = await Promise.all([
          fetch('/api/projects-v2', {
            headers: {
              'x-user-data': JSON.stringify(user)
            }
          }),
          fetch('/api/clients', {
            headers: {
              'x-user-data': JSON.stringify(user)
            }
          }),
          fetch('/api/reviews', {
            headers: {
              'x-user-data': JSON.stringify(user)
            }
          }),
          fetch('/api/notifications', {
            headers: {
              'x-user-data': JSON.stringify(user)
            }
          })
        ]);

        const projectsData = await projectsRes.json();
        const clientsData = await clientsRes.json();
        const reviewsData = await reviewsRes.json();
        const notificationsData = await notificationsRes.json();

        if (projectsData.success && Array.isArray(projectsData.projects)) {
          setProjects(projectsData.projects.map((p: any) => ({
            id: p.id.toString(),
            name: p.name,
            display_title: p.display_title,
            client: p.client,
            client_id: p.client_id,
            description: p.description,
            technologies: p.technologies,
            key_results: p.key_results,
            live_url: p.live_url,
            category: p.category,
            status: p.status,
            budget: p.budget,
            timeline: p.timeline,
            progress: p.progress
          })));
        } else {
          console.error('Invalid projects data received:', projectsData);
          if (!projectsData.success) {
            console.error('Projects API returned error:', projectsData.error || projectsData.message);
          }
        }

        if (clientsData.success && Array.isArray(clientsData.clients)) {
          setClients(clientsData.clients.map((c: any) => ({
            id: c.id.toString(),
            name: c.name,
            email: c.email,
            company: c.company,
            phone: c.phone,
            website: c.website,
            contact_role: c.contact_role,
            address: c.address,
            projects: c.projects,
            totalSpent: c.total_spent
          })));
        } else {
          console.error('Invalid clients data received:', clientsData);
          if (!clientsData.success) {
            console.error('Clients API returned error:', clientsData.error || clientsData.message);
          }
        }

        if (reviewsData.success && Array.isArray(reviewsData.reviews)) {
          setReviews(reviewsData.reviews.map((r: any) => ({
            id: r.id.toString(),
            client_name: r.client_name,
            client_title: r.client_title,
            client_company: r.client_company,
            rating: r.rating,
            review_text: r.review_text,
            project_name: r.project_name,
            image_url: r.image_url,
            is_active: Boolean(r.is_active),
            sort_order: r.sort_order
          })));
        }

        if (notificationsData.success && Array.isArray(notificationsData.notifications)) {
          setNotifications(notificationsData.notifications.map((n: any) => ({
            id: n.id.toString(),
            type: n.type,
            title: n.title,
            message: n.message,
            link: n.link,
            read: Boolean(n.read),
            created_at: n.created_at
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
      const [projectsRes, clientsRes, reviewsRes] = await Promise.all([
        fetch('/api/projects-v2', {
          headers: {
            'x-user-data': JSON.stringify(user)
          }
        }),
        fetch('/api/clients', {
          headers: {
            'x-user-data': JSON.stringify(user)
          }
        }),
        fetch('/api/reviews', {
          headers: {
            'x-user-data': JSON.stringify(user)
          }
        })
      ]);

      const projectsData = await projectsRes.json();
      const clientsData = await clientsRes.json();
      const reviewsData = await reviewsRes.json();

      if (projectsData.success) {
        setProjects(projectsData.projects.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          client: p.client,
          client_id: p.client_id,
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
          phone: c.phone,
          website: c.website,
          contact_role: c.contact_role,
          address: c.address,
          projects: c.projects,
          totalSpent: c.total_spent
        })));
      }

      if (reviewsData.success && Array.isArray(reviewsData.reviews)) {
        setReviews(reviewsData.reviews.map((r: any) => ({
          id: r.id.toString(),
          client_name: r.client_name,
          client_title: r.client_title,
          client_company: r.client_company,
          rating: r.rating,
          review_text: r.review_text,
          project_name: r.project_name,
          image_url: r.image_url,
          is_active: Boolean(r.is_active),
          sort_order: r.sort_order
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
      case 'quote': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'on-hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Action handlers
  const handleViewProject = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setViewingProject(project);
      setProjectFiles([]);

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
        }
      } catch (error) {
        console.error('Error fetching files:', error);
        setProjectFiles([]);
      }
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setViewingProject(null); // Close detail view if open
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      const response = await fetch('/api/projects/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-data': JSON.stringify(user)
        },
        body: JSON.stringify({
          id: updatedProject.id,
          name: updatedProject.name,
          display_title: updatedProject.display_title,
          client: updatedProject.client,
          client_id: updatedProject.client_id,
          description: updatedProject.description,
          technologies: updatedProject.technologies,
          key_results: updatedProject.key_results,
          live_url: updatedProject.live_url,
          category: updatedProject.category,
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

        // If viewing, update the viewing project too
        if (viewingProject && viewingProject.id === updatedProject.id) {
          setViewingProject(updatedProject);
        }
      } else {
        const errorData = await response.json();
        alert(`Failed to update project: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project && confirm(`Are you sure you want to delete "${project.name}"?\n\nThis action cannot be undone.`)) {
      try {
        const response = await fetch('/api/projects/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-user-data': JSON.stringify(user)
          },
          body: JSON.stringify({ id: projectId })
        });
        if (response.ok) {
          alert(`Project "${project.name}" deleted`);
          setViewingProject(null); // Close detail view
          await refreshData();
        } else {
          const errorData = await response.json();
          alert(`Failed to delete project: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project');
      }
    }
  };

  const handleCreateProject = async (projectData: any) => {
    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-data': JSON.stringify(user)
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const data = await response.json();
        alert('Project created successfully');
        setShowCreateProjectModal(false);
        await refreshData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project');
    }
  };

  // Review handlers
  const handleCreateReview = async (reviewData: any) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-data': JSON.stringify(user)
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        alert('Review created successfully');
        setShowCreateReviewModal(false);
        setReviewInitialData(null);
        await refreshData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create review');
      }
    } catch (error) {
      console.error('Error creating review:', error);
      alert('Error creating review');
    }
  };

  // Open review modal with project data pre-filled
  const handleAddReviewFromProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    // Find the client for this project
    const client = clients.find(c =>
      c.id.toString() === project.client_id || c.name === project.client
    );

    setReviewInitialData({
      project: project,
      client: client
    });
    setShowCreateReviewModal(true);
  };

  const handleUpdateReview = async (updatedReview: Review) => {
    try {
      const response = await fetch('/api/reviews/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-data': JSON.stringify(user)
        },
        body: JSON.stringify({
          id: updatedReview.id,
          client_name: updatedReview.client_name,
          client_title: updatedReview.client_title,
          client_company: updatedReview.client_company,
          rating: updatedReview.rating,
          review_text: updatedReview.review_text,
          project_name: updatedReview.project_name,
          image_url: updatedReview.image_url,
          is_active: updatedReview.is_active ? 1 : 0,
          sort_order: updatedReview.sort_order
        })
      });

      if (response.ok) {
        alert('Review updated successfully');
        setEditingReview(null);
        await refreshData();
      } else {
        const errorData = await response.json();
        alert(`Failed to update review: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Error updating review');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (review && confirm(`Are you sure you want to delete the review from "${review.client_name}"?\n\nThis action cannot be undone.`)) {
      try {
        const response = await fetch('/api/reviews/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-user-data': JSON.stringify(user)
          },
          body: JSON.stringify({ id: reviewId })
        });

        if (response.ok) {
          alert('Review deleted successfully');
          await refreshData();
        } else {
          const errorData = await response.json();
          alert(`Failed to delete review: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Error deleting review');
      }
    }
  };

  // Client handlers
  const handleCreateClient = async (clientData: any) => {
    try {
      const response = await fetch('/api/clients/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-data': JSON.stringify(user)
        },
        body: JSON.stringify(clientData)
      });

      if (response.ok) {
        alert('Client created successfully');
        setShowCreateClientModal(false);
        await refreshData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create client');
      }
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Error creating client');
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
          phone: updatedClient.phone,
          website: updatedClient.website,
          contact_role: updatedClient.contact_role,
          address: updatedClient.address
        })
      });

      if (response.ok) {
        alert('Client updated successfully');
        setEditingClient(null);
        setViewingClient(null);
        await refreshData();
      } else {
        const errorData = await response.json();
        alert(`Failed to update client: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Error updating client');
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client && confirm(`Are you sure you want to delete "${client.name}"?\n\nThis will also delete all associated contacts. This action cannot be undone.`)) {
      try {
        const response = await fetch('/api/clients/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-user-data': JSON.stringify(user)
          },
          body: JSON.stringify({ id: clientId })
        });

        if (response.ok) {
          alert('Client deleted successfully');
          setViewingClient(null);
          await refreshData();
        } else {
          const errorData = await response.json();
          alert(`Failed to delete client: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error deleting client');
      }
    }
  };

  const handleViewClient = async (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setViewingClient(client);
      // Fetch client contacts
      try {
        const response = await fetch(`/api/clients/contacts/${clientId}`, {
          headers: {
            'x-user-data': JSON.stringify(user)
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setClientContacts(data.contacts.map((c: any) => ({
              id: c.id.toString(),
              client_id: c.client_id.toString(),
              name: c.name,
              email: c.email,
              phone: c.phone,
              role: c.role,
              is_primary: Boolean(c.is_primary)
            })));
          }
        }
      } catch (error) {
        console.error('Error fetching client contacts:', error);
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
                  onClick={() => router.push('/profile')}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                  title="Profile Settings"
                >
                  <FaUserCircle />
                  <span>Profile</span>
                </button>
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
              {['overview', 'projects', 'clients', 'reviews', 'messages'].map((tab) => (
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

              {/* Notifications */}
              {notifications.filter(n => !n.read).length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-blue-200 flex items-center justify-between">
                    <div className="flex items-center">
                      <FaBell className="h-5 w-5 text-blue-600 mr-3" />
                      <h3 className="text-lg font-medium text-gray-900">
                        New Notifications
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                          {notifications.filter(n => !n.read).length}
                        </span>
                      </h3>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await fetch('/api/notifications', {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              'x-user-data': JSON.stringify(user)
                            },
                            body: JSON.stringify({ markAllRead: true })
                          });
                          setNotifications(notifications.map(n => ({ ...n, read: true })));
                        } catch (error) {
                          console.error('Error marking all as read:', error);
                        }
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      <FaCheck className="mr-1" />
                      Mark all as read
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {notifications.filter(n => !n.read).map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-start p-4 bg-white border border-blue-100 rounded-lg hover:shadow-md transition cursor-pointer"
                          onClick={async () => {
                            try {
                              await fetch('/api/notifications', {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'x-user-data': JSON.stringify(user)
                                },
                                body: JSON.stringify({ id: notification.id })
                              });
                              setNotifications(notifications.map(n =>
                                n.id === notification.id ? { ...n, read: true } : n
                              ));
                              if (notification.link) {
                                router.push(notification.link);
                              }
                            } catch (error) {
                              console.error('Error marking as read:', error);
                            }
                          }}
                        >
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              notification.type === 'quote_request' ? 'bg-green-100' :
                              notification.type === 'new_client' ? 'bg-blue-100' :
                              'bg-gray-100'
                            }`}>
                              {notification.type === 'quote_request' && <FaEnvelope className="text-green-600" />}
                              {notification.type === 'new_client' && <FaUsers className="text-blue-600" />}
                              {notification.type !== 'quote_request' && notification.type !== 'new_client' && <FaBell className="text-gray-600" />}
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                              <span className="text-xs text-gray-500">
                                {new Date(notification.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Projects */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {projects.slice(0, 5).map((project) => (
                      <div
                        key={project.id}
                        onClick={() => handleViewProject(project.id)}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">{project.name}</h4>
                          <p className="text-sm text-gray-600">{project.client}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                            {project.status.replace('-', ' ')}
                          </span>
                          <span className="text-sm font-medium text-gray-900">${project.budget.toLocaleString()}</span>
                          <FaEye className="text-gray-400" />
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
                  onClick={() => setShowCreateProjectModal(true)}
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
                      <tr
                        key={project.id}
                        onClick={() => handleViewProject(project.id)}
                        className="hover:bg-gray-50 cursor-pointer transition"
                      >
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProject(project.id);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddReviewFromProject(project.id);
                              }}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Add Review"
                            >
                              <FaStar />
                            </button>
                          </div>
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
                  onClick={() => setShowCreateClientModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Add Client
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => (
                  <div key={client.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        onClick={() => handleViewClient(client.id)}
                        className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                      >
                        {client.name}
                      </h3>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingClient(client);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit Client"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClient(client.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete Client"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <FaEnvelope className="inline mr-2" />
                        {client.email}
                      </p>
                      <p className="text-sm text-gray-600">{client.company}</p>
                      {client.phone && (
                        <p className="text-sm text-gray-600">📞 {client.phone}</p>
                      )}
                      {client.website && (
                        <p className="text-sm text-blue-600 truncate">🌐 {client.website}</p>
                      )}
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

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Client Reviews</h2>
                <button
                  onClick={() => setShowCreateReviewModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Add Review
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{review.client_name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            review.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {review.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {review.client_company
                            ? `${review.client_title} at ${review.client_company}`
                            : review.client_title
                          }
                        </p>
                        {review.project_name && (
                          <p className="text-sm text-blue-600 mt-1">Project: {review.project_name}</p>
                        )}
                        <div className="flex items-center mt-2 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                        </div>
                        <p className="text-gray-700 italic">"{review.review_text}"</p>
                        <p className="text-xs text-gray-500 mt-2">Sort Order: {review.sort_order}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setEditingReview(review)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Review"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Review"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {reviews.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <FaComments className="mx-auto text-gray-400 text-5xl mb-4" />
                    <p className="text-gray-600 text-lg">No reviews yet</p>
                    <p className="text-gray-500 mt-2">Add your first client review to display on the landing page</p>
                  </div>
                )}
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

      {/* Create Project Modal */}
      {showCreateProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Project</h3>
              <button
                onClick={() => setShowCreateProjectModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <FaTimes />
              </button>
            </div>
            <ProjectCreateForm
              clients={clients}
              onSave={handleCreateProject}
              onCancel={() => setShowCreateProjectModal(false)}
            />
          </div>
        </div>
      )}

      {/* Project Detail View Modal */}
      {viewingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setViewingProject(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaArrowLeft className="text-xl" />
                </button>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{viewingProject.name}</h3>
                  <p className="text-sm text-gray-600">{viewingProject.client}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditProject(viewingProject)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <FaEdit />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteProject(viewingProject.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">Project Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(viewingProject.status)}`}>
                        {viewingProject.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Budget:</span>
                      <span className="text-sm font-semibold text-gray-900">${viewingProject.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Timeline:</span>
                      <span className="text-sm font-semibold text-gray-900">{viewingProject.timeline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Progress:</span>
                      <span className="text-sm font-semibold text-gray-900">{viewingProject.progress}%</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${viewingProject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Client Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">Client Information</h4>
                  {clients.find(c => c.id === viewingProject.client_id || c.name === viewingProject.client) ? (
                    <div className="space-y-2">
                      {(() => {
                        const client = clients.find(c => c.id === viewingProject.client_id || c.name === viewingProject.client);
                        return client ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Name:</span>
                              <span className="text-sm font-semibold text-gray-900">{client.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Email:</span>
                              <span className="text-sm font-semibold text-gray-900">{client.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Company:</span>
                              <span className="text-sm font-semibold text-gray-900">{client.company}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Total Projects:</span>
                              <span className="text-sm font-semibold text-gray-900">{client.projects}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Total Spent:</span>
                              <span className="text-sm font-semibold text-gray-900">${client.totalSpent.toLocaleString()}</span>
                            </div>
                          </>
                        ) : null;
                      })()}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Client information not available</p>
                  )}
                </div>
              </div>

              {/* File Management */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Files</h4>
                <FileUpload
                  projectId={parseInt(viewingProject.id)}
                  files={projectFiles}
                  onFilesChange={setProjectFiles}
                  canUpload={true}
                  canDelete={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Project</h3>
            <ProjectEditForm
              project={editingProject}
              clients={clients}
              onSave={handleUpdateProject}
              onCancel={() => setEditingProject(null)}
            />
          </div>
        </div>
      )}

      {/* Create Review Modal */}
      {showCreateReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Client Review</h3>
              <button
                onClick={() => setShowCreateReviewModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <FaTimes />
              </button>
            </div>
            <ReviewCreateForm
              clients={clients}
              projects={projects}
              onSave={handleCreateReview}
              onCancel={() => setShowCreateReviewModal(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Review</h3>
              <button
                onClick={() => setEditingReview(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <FaTimes />
              </button>
            </div>
            <ReviewEditForm
              review={editingReview}
              onSave={handleUpdateReview}
              onCancel={() => setEditingReview(null)}
            />
          </div>
        </div>
      )}

      {/* Create Client Modal */}
      {showCreateClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Client</h3>
              <button
                onClick={() => setShowCreateClientModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <FaTimes />
              </button>
            </div>
            <ClientCreateForm
              onSave={handleCreateClient}
              onCancel={() => setShowCreateClientModal(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Client</h3>
              <button
                onClick={() => setEditingClient(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <FaTimes />
              </button>
            </div>
            <ClientEditForm
              client={editingClient}
              onSave={handleUpdateClient}
              onCancel={() => setEditingClient(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}

// Project Create Form Component
function ProjectCreateForm({ clients, onSave, onCancel }: {
  clients: Client[];
  onSave: (project: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    client_id: '',
    status: 'planning' as const,
    budget: '' as any,
    timeline: '4 weeks',
    progress: 0,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Find selected client
    const selectedClient = clients.find(c => c.id === formData.client_id);

    onSave({
      ...formData,
      budget: parseInt(formData.budget) || 0,
      client: selectedClient ? selectedClient.name : formData.client,
      client_id: formData.client_id || undefined
    });
  };

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setFormData(prev => ({
      ...prev,
      client_id: clientId,
      client: client ? client.name : ''
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required
            placeholder="e.g., Company Website Redesign"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Client *</label>
          <select
            value={formData.client_id}
            onChange={(e) => handleClientChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required
          >
            <option value="">-- Select a Client --</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} ({client.company})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Select an existing client for this project</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($) *</label>
          <input
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required
            min="0"
            placeholder="5000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timeline *</label>
          <input
            type="text"
            value={formData.timeline}
            onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            placeholder="e.g., 4 weeks, 2 months"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Initial Progress (%)</label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
              className="flex-1"
            />
            <span className="w-12 text-sm font-medium text-gray-700">{formData.progress}%</span>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            rows={3}
            placeholder="Brief description of the project..."
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4 border-t">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
        >
          Create Project
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

// Project Edit Form Component
function ProjectEditForm({ project, clients, onSave, onCancel }: {
  project: Project;
  clients: Client[];
  onSave: (project: Project) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(project);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Find selected client name
    const selectedClient = clients.find(c => c.id === formData.client_id);

    onSave({
      ...formData,
      client: selectedClient ? selectedClient.name : formData.client
    });
  };

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setFormData(prev => ({
      ...prev,
      client_id: clientId,
      client: client ? client.name : prev.client
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
          <select
            value={formData.client_id}
            onChange={(e) => handleClientChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required
          >
            <option value="">-- Select a Client --</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} ({client.company})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Project['status'] }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
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
            onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
          <input
            type="text"
            value={formData.timeline}
            onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
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
              onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
              className="flex-1"
            />
            <span className="w-12 text-sm font-medium text-gray-700">{formData.progress}%</span>
          </div>
        </div>
      </div>

      {/* Landing Page Display Fields */}
      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Landing Page Display (Optional)</h4>
        <p className="text-xs text-gray-500 mb-4">These fields control how the project appears on the public website. Leave blank to hide sections.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Title <span className="text-gray-400 text-xs">(Optional - uses Project Name if empty)</span>
            </label>
            <input
              type="text"
              value={formData.display_title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, display_title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="e.g., VSR Snow Removal - Construction Company Website"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.category || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="e.g., Web Development, Mobile App, Smart Home"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Live Website URL <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="url"
              value={formData.live_url || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, live_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              rows={3}
              placeholder="Brief description of the project and its features..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technologies Used <span className="text-gray-400 text-xs">(Optional - one per line)</span>
            </label>
            <textarea
              value={formData.technologies || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              rows={4}
              placeholder="Next.js&#10;Tailwind CSS&#10;TypeScript&#10;PostgreSQL"
            />
            <p className="text-xs text-gray-500 mt-1">Enter each technology on a new line</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Results <span className="text-gray-400 text-xs">(Optional - one per line)</span>
            </label>
            <textarea
              value={formData.key_results || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, key_results: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              rows={4}
              placeholder="Professional online presence&#10;Mobile-friendly design&#10;Improved customer inquiries&#10;Clear service presentation"
            />
            <p className="text-xs text-gray-500 mt-1">Enter each result on a new line</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4 border-t">
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

// Review Create Form Component
function ReviewCreateForm({ clients, projects, onSave, onCancel }: {
  clients: Client[];
  projects: Project[];
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    client_name: '',
    client_title: '',
    client_company: '',
    rating: 5,
    review_text: '',
    project_name: '',
    image_url: '/api/placeholder/80/80',
    is_active: true,
    sort_order: 0
  });

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientProjects, setClientProjects] = useState<Project[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [customProjectName, setCustomProjectName] = useState('');

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(clientSearchTerm.toLowerCase()))
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowClientDropdown(false);
    if (showClientDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showClientDropdown]);

  // Handle client selection
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setClientSearchTerm(client.name);
    setFormData(prev => ({
      ...prev,
      client_name: client.name,
      client_company: client.company || ''
    }));

    // Find projects for this client
    const relatedProjects = projects.filter(p =>
      p.client_id === client.id.toString() || p.client === client.name
    );
    setClientProjects(relatedProjects);
    setShowClientDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Name *
            <span className="text-xs text-gray-500 ml-1">(Search existing clients)</span>
          </label>
          <input
            type="text"
            value={clientSearchTerm}
            onChange={(e) => {
              setClientSearchTerm(e.target.value);
              setShowClientDropdown(true);
              if (!e.target.value) {
                setSelectedClient(null);
                setFormData(prev => ({ ...prev, client_name: '', client_company: '' }));
                setClientProjects([]);
              }
            }}
            onFocus={() => setShowClientDropdown(true)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required
            placeholder="Start typing client name..."
            autoComplete="off"
          />

          {/* Dropdown for client selection */}
          {showClientDropdown && filteredClients.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => handleClientSelect(client)}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{client.name}</div>
                  {client.company && (
                    <div className="text-xs text-gray-600">{client.company}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {client.projects} project{client.projects !== 1 ? 's' : ''} • ${client.totalSpent?.toLocaleString() || 0} total
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Show message if client selected */}
          {selectedClient && (
            <div className="mt-1 text-xs text-green-600 flex items-center">
              <FaCheck className="mr-1" /> Client selected: {selectedClient.company || selectedClient.name}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client Title *</label>
          <input
            type="text"
            value={formData.client_title}
            onChange={(e) => setFormData(prev => ({ ...prev, client_title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required
            placeholder="e.g., CEO, Business Owner"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
            {selectedClient && <span className="text-xs text-green-600 ml-1">(Auto-filled)</span>}
          </label>
          <input
            type="text"
            value={formData.client_company}
            onChange={(e) => setFormData(prev => ({ ...prev, client_company: e.target.value }))}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
              selectedClient ? 'bg-gray-50' : 'bg-white'
            }`}
            required
            placeholder="e.g., Acme Corp"
            readOnly={!!selectedClient}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
            {clientProjects.length > 0 && <span className="text-xs text-gray-500 ml-1">({clientProjects.length} available)</span>}
          </label>
          {clientProjects.length > 0 ? (
            <>
              <select
                value={formData.project_name === customProjectName ? '__custom__' : formData.project_name}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setFormData(prev => ({ ...prev, project_name: customProjectName }));
                  } else {
                    setFormData(prev => ({ ...prev, project_name: e.target.value }));
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="">Select a project...</option>
                {clientProjects.map((project) => (
                  <option key={project.id} value={project.name}>
                    {project.name} ({project.status})
                  </option>
                ))}
                <option value="__custom__">✏️ Enter custom project name</option>
              </select>
              {formData.project_name === customProjectName && (
                <input
                  type="text"
                  value={customProjectName}
                  onChange={(e) => {
                    setCustomProjectName(e.target.value);
                    setFormData(prev => ({ ...prev, project_name: e.target.value }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white mt-2"
                  placeholder="Enter custom project name..."
                />
              )}
            </>
          ) : (
            <input
              type="text"
              value={formData.project_name}
              onChange={(e) => setFormData(prev => ({ ...prev, project_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="e.g., Website Redesign"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
          <select
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value={5}>5 Stars - Excellent</option>
            <option value={4}>4 Stars - Very Good</option>
            <option value={3}>3 Stars - Good</option>
            <option value={2}>2 Stars - Fair</option>
            <option value={1}>1 Star - Poor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
          <input
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            min="0"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Review Text *</label>
          <textarea
            value={formData.review_text}
            onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            rows={4}
            required
            placeholder="What did the client say about your work?"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Active (Show on landing page)</span>
          </label>
        </div>
      </div>

      <div className="flex space-x-3 pt-4 border-t">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
        >
          Create Review
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

// Review Edit Form Component
function ReviewEditForm({ review, onSave, onCancel }: {
  review: Review;
  onSave: (review: Review) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(review);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
          <input
            type="text"
            value={formData.client_name}
            onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client Title</label>
          <input
            type="text"
            value={formData.client_title}
            onChange={(e) => setFormData(prev => ({ ...prev, client_title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-gray-400 text-xs">(Optional)</span></label>
          <input
            type="text"
            value={formData.client_company}
            onChange={(e) => setFormData(prev => ({ ...prev, client_company: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            placeholder="Leave empty for homeowners/individuals"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
          <input
            type="text"
            value={formData.project_name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, project_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <select
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value={5}>5 Stars - Excellent</option>
            <option value={4}>4 Stars - Very Good</option>
            <option value={3}>3 Stars - Good</option>
            <option value={2}>2 Stars - Fair</option>
            <option value={1}>1 Star - Poor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
          <input
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            min="0"
          />
          <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Review Text</label>
          <textarea
            value={formData.review_text}
            onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            rows={4}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Active (Show on landing page)</span>
          </label>
        </div>
      </div>

      <div className="flex space-x-3 pt-4 border-t">
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

// Client Create Form Component
function ClientCreateForm({ onSave, onCancel }: {
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    website: '',
    contact_role: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required
            placeholder="e.g., John Smith"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required
            placeholder="e.g., john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required
            placeholder="e.g., Acme Corp"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            placeholder="e.g., (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            placeholder="e.g., https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Role</label>
          <input
            type="text"
            value={formData.contact_role}
            onChange={(e) => setFormData(prev => ({ ...prev, contact_role: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            placeholder="e.g., CEO, Owner, Manager"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            rows={2}
            placeholder="Full business address"
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4 border-t">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
        >
          Create Client
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input
            type="url"
            value={formData.website || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Role</label>
          <input
            type="text"
            value={formData.contact_role || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, contact_role: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            placeholder="e.g., CEO, Owner, Manager"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            value={formData.address || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            rows={2}
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4 border-t">
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
