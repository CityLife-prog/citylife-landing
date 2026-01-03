import { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaGithub, FaMobile, FaDesktop, FaCogs } from 'react-icons/fa';

interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  budget: number;
  timeline: string;
  progress: number;
}

interface ProjectStats {
  totalProjects: number;
  completedProjects: number;
  clientsSatisfied: number;
  totalRevenue: number;
  averageRating: number;
  foundingYear: number;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    completedProjects: 0,
    clientsSatisfied: 0,
    totalRevenue: 0,
    averageRating: 5.0,
    foundingYear: 2025
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/public/projects');
        const data = await response.json();
        
        if (data.success) {
          setProjects(data.projects);
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Transform database projects to display format
  const displayProjects = projects.filter(p => p.status === 'completed').map(project => {
    // Custom handling for known projects
    if (project.name.includes('VSR')) {
      return {
        title: "VSR Snow Removal - Construction Company Website",
        client: (
          <span>
            VSR Snow Removal (
            <a
              href="https://vsrsnow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              vsrsnow.com
            </a>
            )
          </span>
        ),
        category: "Web Development",
        icon: <FaDesktop className="text-blue-600" />,
        image: "https://image.thum.io/get/width/1200/crop/800/https://vsrsnow.com",
        imageAlt: "VSR Snow Removal website screenshot",
        liveUrl: "https://vsrsnow.com",
        description: "Professional construction and snow removal company website with service pages, quote request forms, and mobile-responsive design. Features project galleries and contact integration.",
        technologies: ["Next.js", "Tailwind CSS", "Contact Forms", "SEO Optimization", "Responsive Design"],
        results: ["Professional online presence", "Mobile-friendly design", "Improved customer inquiries", "Clear service presentation"],
        timeline: project.timeline,
        budget: `$${project.budget.toLocaleString()}`
      };
    } else if (project.name.includes('CityLyfe')) {
      return {
        title: "CityLyfe LLC - Business Portfolio Website",
        client: "CityLyfe LLC (This Website)",
        category: "Web Development",
        icon: <FaDesktop className="text-green-600" />,
        image: "data:image/svg+xml,%3Csvg width='1200' height='800' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%232563eb;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%237c3aed;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23grad)' /%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' fill='white' text-anchor='middle' dy='.3em'%3ECityLyfe Portfolio%3C/text%3E%3C/svg%3E",
        imageAlt: "CityLyfe website preview",
        liveUrl: null,
        description: "Professional business website showcasing IT services, project portfolio, and client testimonials. Features modern design, contact forms, and service pricing information.",
        technologies: ["Next.js", "Tailwind CSS", "TypeScript", "Contact Forms", "SEO Optimization"],
        results: ["Professional business presence", "Clear service presentation", "Improved client communication", "Portfolio showcase"],
        timeline: project.timeline,
        budget: `$${project.budget.toLocaleString()}`
      };
    } else {
      // Generic project format for new projects
      return {
        title: project.name,
        client: project.client,
        category: "Web Development",
        icon: <FaDesktop className="text-purple-600" />,
        image: `data:image/svg+xml,%3Csvg width='1200' height='800' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236366f1;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23a855f7;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23grad)' /%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' fill='white' text-anchor='middle' dy='.3em'%3E${encodeURIComponent(project.client)}%3C/text%3E%3C/svg%3E`,
        imageAlt: `${project.name} website preview`,
        liveUrl: null,
        description: `Custom web development project for ${project.client}. Professional website solution built with modern technologies and best practices.`,
        technologies: ["Next.js", "Tailwind CSS", "TypeScript", "Responsive Design"],
        results: ["Professional online presence", "Modern design", "Improved user experience", "Mobile optimization"],
        timeline: project.timeline,
        budget: `$${project.budget.toLocaleString()}`
      };
    }
  });

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const headerOffset = 60;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="projects" className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Recent Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Here are the websites we've completed for satisfied clients. Each project
            was built with attention to detail and a focus on delivering real value.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {loading ? '...' : stats.clientsSatisfied}
              </div>
              <div className="text-sm text-gray-600">Clients Satisfied</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {loading ? '...' : stats.foundingYear}
              </div>
              <div className="text-sm text-gray-600">Founded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {loading ? '...' : `${stats.averageRating}★`}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">1:1</div>
              <div className="text-sm text-gray-600">Personal Service</div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : (
            displayProjects.map((project, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="p-8">
                {/* Category & Timeline */}
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {project.category}
                  </span>
                  <span className="text-sm text-gray-500">{project.timeline}</span>
                </div>
                
                {/* Title & Client */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <div className="mb-4">
                  <p className="text-blue-600 font-medium inline">{project.client}</p>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      <FaExternalLinkAlt className="text-xs" />
                      Visit Site
                    </a>
                  )}
                </div>
                
                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {project.description}
                </p>
                
                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Results */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Results:</h4>
                  <ul className="space-y-2">
                    {project.results.map((result, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Budget & CTA */}
                <div className="border-t pt-6 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    {project.budget}
                  </span>
                  <button 
                    onClick={scrollToContact}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Start Similar Project
                  </button>
                </div>
              </div>
            </div>
          ))
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Be Our Next Success Story?
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Every project starts with understanding your unique needs.
            Let's discuss how we can help bring your vision to life with a custom solution.
          </p>
          <div className="flex justify-center">
            <button
              onClick={scrollToContact}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
            >
              Schedule Free Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}