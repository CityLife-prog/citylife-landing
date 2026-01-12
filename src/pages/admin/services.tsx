import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaEye, FaEyeSlash, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

interface Service {
  id: number;
  title: string;
  description: string;
  who_for: string;
  features: string[];
  disclaimer?: string;
  price: string;
  category: string;
  hardware_included: boolean;
  is_active: boolean;
  sort_order: number;
}

export default function AdminServices() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [activeTab, setActiveTab] = useState<'project' | 'monthly'>('project');
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    who_for: '',
    features: [],
    disclaimer: '',
    price: '',
    category: 'project',
    hardware_included: false,
    is_active: true,
    sort_order: 0
  });
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    // Check auth
    const userData = localStorage.getItem('citylife_user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    fetchServices();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('citylife_user');
    router.push('/login');
  };

  const fetchServices = async () => {
    try {
      const userData = localStorage.getItem('citylife_user');
      const response = await fetch('/api/services', {
        headers: {
          'x-user-data': userData || ''
        }
      });

      const data = await response.json();
      if (data.success) {
        setServices(data.services);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      alert('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData(service);
  };

  const startNew = () => {
    setEditingId('new');
    setFormData({
      title: '',
      description: '',
      who_for: '',
      features: [],
      disclaimer: '',
      price: '',
      category: 'project',
      hardware_included: false,
      is_active: true,
      sort_order: services.length
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
    setFeatureInput('');
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: (formData.features || []).filter((_, i) => i !== index)
    });
  };

  const saveService = async () => {
    try {
      const userData = localStorage.getItem('citylife_user');
      const method = editingId === 'new' ? 'POST' : 'PUT';

      const response = await fetch('/api/services', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-data': userData || ''
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        await fetchServices();
        cancelEdit();
      } else {
        alert(data.error || 'Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    try {
      const userData = localStorage.getItem('citylife_user');
      const response = await fetch('/api/services', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-data': userData || ''
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      if (data.success) {
        await fetchServices();
      } else {
        alert(data.error || 'Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      const userData = localStorage.getItem('citylife_user');
      const response = await fetch('/api/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-data': userData || ''
        },
        body: JSON.stringify({
          id: service.id,
          is_active: !service.is_active
        })
      });

      const data = await response.json();
      if (data.success) {
        await fetchServices();
      }
    } catch (error) {
      console.error('Error toggling service:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  const projectServices = services.filter(s => s.category === 'project').sort((a, b) => a.sort_order - b.sort_order);
  const monthlyServices = services.filter(s => s.category === 'monthly').sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      <Head>
        <title>Services Management - CityLyfe LLC Admin</title>
        <meta name="description" content="CityLyfe LLC Admin Services Management" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/admin/dashboard" className="flex items-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    CityLyfe
                  </span>
                  <span className="ml-2 text-sm text-gray-500">LLC Admin</span>
                </Link>
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

        {/* Main Content */}
        <div className="max-w-6xl mx-auto py-8 px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
              <FaArrowLeft />
              Back to Dashboard
            </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
              <p className="text-gray-600 mt-2">Add, edit, or remove services from your website</p>
            </div>
            <button
              onClick={startNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaPlus />
              Add New Service
            </button>
          </div>
        </div>

        {/* Edit/New Form */}
        {editingId && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-2 border-blue-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId === 'new' ? 'Add New Service' : 'Edit Service'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  placeholder="e.g., Custom Web Development"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="text"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  placeholder="e.g., Starting at $500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category || 'project'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                >
                  <option value="project">Project-Based</option>
                  <option value="monthly">Monthly/Ongoing</option>
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  placeholder="Brief description of the service..."
                />
              </div>

              {/* Who For */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Who This Is For *
                </label>
                <textarea
                  value={formData.who_for || ''}
                  onChange={(e) => setFormData({ ...formData, who_for: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  placeholder="Target audience for this service..."
                />
              </div>

              {/* Features */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features/What's Included
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ color: '#111827', backgroundColor: '#ffffff' }}
                    placeholder="Add a feature and press Enter"
                  />
                  <button
                    onClick={addFeature}
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {(formData.features || []).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                      <span className="flex-1 text-sm text-gray-900">{feature}</span>
                      <button
                        onClick={() => removeFeature(index)}
                        type="button"
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disclaimer (Optional)
                </label>
                <textarea
                  value={formData.disclaimer || ''}
                  onChange={(e) => setFormData({ ...formData, disclaimer: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  placeholder="Any disclaimers or important notes..."
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sort_order || 0}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hardware_included || false}
                    onChange={(e) => setFormData({ ...formData, hardware_included: e.target.checked })}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">Hardware included in price</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active !== false}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">Active (visible on website)</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={saveService}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaSave />
                Save Service
              </button>
              <button
                onClick={cancelEdit}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors flex items-center gap-2"
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('project')}
                className={`${
                  activeTab === 'project'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                Project-Based Services
                <span className="bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {projectServices.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('monthly')}
                className={`${
                  activeTab === 'monthly'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                Monthly Services
                <span className="bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {monthlyServices.length}
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Project Services */}
        {activeTab === 'project' && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 sr-only">Project-Based Services ({projectServices.length})</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {projectServices.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No project-based services yet. Click "Add New Service" to create one.
              </div>
            ) : (
              projectServices.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 border-b border-gray-200 last:border-b-0 ${!service.is_active ? 'bg-gray-50 opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{service.title}</h3>
                        {!service.is_active && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Inactive</span>
                        )}
                        {service.hardware_included && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Hardware Included</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{service.price}</p>
                      <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleActive(service)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        title={service.is_active ? 'Hide from website' : 'Show on website'}
                      >
                        {service.is_active ? <FaEye /> : <FaEyeSlash />}
                      </button>
                      <button
                        onClick={() => startEdit(service)}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit service"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        title="Delete service"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        )}

        {/* Monthly Services */}
        {activeTab === 'monthly' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 sr-only">Monthly/Ongoing Services ({monthlyServices.length})</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {monthlyServices.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No monthly services yet. Click "Add New Service" to create one.
                </div>
              ) : (
                monthlyServices.map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 border-b border-gray-200 last:border-b-0 ${!service.is_active ? 'bg-gray-50 opacity-60' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{service.title}</h3>
                          {!service.is_active && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Inactive</span>
                          )}
                          {service.hardware_included && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Hardware Included</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{service.price}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => toggleActive(service)}
                          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                          title={service.is_active ? 'Hide from website' : 'Show on website'}
                        >
                          {service.is_active ? <FaEye /> : <FaEyeSlash />}
                        </button>
                        <button
                          onClick={() => startEdit(service)}
                          className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit service"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors"
                          title="Delete service"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
