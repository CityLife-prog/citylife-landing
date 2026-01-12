import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft, FaStar, FaRegStar, FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface Project {
  id: number;
  name: string;
  display_title?: string;
  client: string;
  status: string;
  featured: boolean;
  featured_order?: number;
}

export default function AdminFeaturedProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    // Check auth
    const userData = localStorage.getItem('citylife_user');
    if (!userData) {
      router.push('/admin/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchProjects();
  }, [router]);

  const fetchProjects = async () => {
    try {
      const userData = localStorage.getItem('citylife_user');
      const response = await fetch('/api/projects', {
        headers: {
          'x-user-data': userData || ''
        }
      });

      const data = await response.json();
      if (data.success) {
        // Only show completed projects
        const completedProjects = data.projects.filter((p: Project) => p.status === 'completed');
        setProjects(completedProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (projectId: number, currentFeatured: boolean) => {
    const featuredCount = projects.filter(p => p.featured).length;

    // If trying to add a 4th featured project, prevent it
    if (!currentFeatured && featuredCount >= 3) {
      alert('You can only feature up to 3 projects. Please unfeature another project first.');
      return;
    }

    setSaving(projectId);

    try {
      const userData = localStorage.getItem('citylife_user');

      // Determine new featured_order
      let newOrder = null;
      if (!currentFeatured) {
        // Adding to featured: assign next available order (1, 2, or 3)
        const usedOrders = projects
          .filter(p => p.featured && p.id !== projectId)
          .map(p => p.featured_order || 0)
          .filter(o => o > 0);

        for (let i = 1; i <= 3; i++) {
          if (!usedOrders.includes(i)) {
            newOrder = i;
            break;
          }
        }
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-data': userData || ''
        },
        body: JSON.stringify({
          featured: !currentFeatured,
          featured_order: newOrder
        })
      });

      const data = await response.json();
      if (data.success) {
        // Refresh projects
        await fetchProjects();
      } else {
        alert('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    } finally {
      setSaving(null);
    }
  };

  const changeFeaturedOrder = async (projectId: number, currentOrder: number, direction: 'up' | 'down') => {
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;

    if (newOrder < 1 || newOrder > 3) return;

    // Find project with the target order
    const swapProject = projects.find(p => p.featured && p.featured_order === newOrder);

    if (!swapProject) return;

    setSaving(projectId);

    try {
      const userData = localStorage.getItem('citylife_user');

      // Update both projects
      await Promise.all([
        fetch(`/api/projects/${projectId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-data': userData || ''
          },
          body: JSON.stringify({ featured_order: newOrder })
        }),
        fetch(`/api/projects/${swapProject.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-data': userData || ''
          },
          body: JSON.stringify({ featured_order: currentOrder })
        })
      ]);

      // Refresh projects
      await fetchProjects();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  const featuredProjects = projects
    .filter(p => p.featured)
    .sort((a, b) => (a.featured_order || 999) - (b.featured_order || 999));

  const unfeaturedProjects = projects.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
            <FaArrowLeft />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Featured Projects</h1>
          <p className="text-gray-600 mt-2">
            Select up to 3 projects to display on the landing page "Recent Projects" section
          </p>
        </div>

        {/* Featured Projects (Top 3) */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaStar className="text-yellow-500" />
            Featured on Landing Page ({featuredProjects.length}/3)
          </h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {featuredProjects.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No featured projects yet. Click the star icon below to feature a project.
              </div>
            ) : (
              featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => changeFeaturedOrder(project.id, project.featured_order!, 'up')}
                          disabled={project.featured_order === 1 || saving === project.id}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <FaArrowUp className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => changeFeaturedOrder(project.id, project.featured_order!, 'down')}
                          disabled={project.featured_order === 3 || saving === project.id}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <FaArrowDown className="text-gray-600" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                          {project.featured_order}
                        </span>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {project.display_title || project.name}
                          </h3>
                          <p className="text-sm text-gray-600">Client: {project.client}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFeatured(project.id, true)}
                      disabled={saving === project.id}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50"
                    >
                      <FaStar className="text-yellow-600" />
                      Unfeature
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Available Projects */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaRegStar className="text-gray-400" />
            Available Projects
          </h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {unfeaturedProjects.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                All completed projects are already featured!
              </div>
            ) : (
              unfeaturedProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {project.display_title || project.name}
                      </h3>
                      <p className="text-sm text-gray-600">Client: {project.client}</p>
                    </div>
                    <button
                      onClick={() => toggleFeatured(project.id, false)}
                      disabled={saving === project.id || featuredProjects.length >= 3}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaRegStar className="text-gray-500" />
                      {featuredProjects.length >= 3 ? 'Max Reached' : 'Feature'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Select up to 3 completed projects to feature on the landing page</li>
            <li>• Use the up/down arrows to change the display order (1 = first position)</li>
            <li>• Changes are immediately visible on the "Recent Projects" section</li>
            <li>• Only completed projects can be featured</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
