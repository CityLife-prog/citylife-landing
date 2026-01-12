import { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaChevronDown, FaChevronUp, FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Project {
  id: number;
  name: string;
  display_title?: string;
  client: string;
  description?: string;
  technologies?: string;
  key_results?: string;
  live_url?: string;
  category?: string;
  status: string;
  budget: number;
  timeline: string;
  progress: number;
}

interface Review {
  id: number;
  project_id: number;
  project_name: string;
  client_name: string;
  client_title: string;
  client_company: string;
  rating: number;
  review_text: string;
  image_url?: string;
}

interface ProjectWithReview {
  project: Project;
  review?: Review;
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
  const [projectsWithReviews, setProjectsWithReviews] = useState<ProjectWithReview[]>([]);
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    completedProjects: 0,
    clientsSatisfied: 0,
    totalRevenue: 0,
    averageRating: 5.0,
    foundingYear: 2025
  });
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedDetails, setExpandedDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects (which already include embedded reviews)
        const projectsResponse = await fetch('/api/public/projects');
        const projectsData = await projectsResponse.json();

        if (projectsData.success) {
          // Filter for projects that have reviews embedded
          const projectsWithReviewsData: ProjectWithReview[] = projectsData.projects
            .filter((p: any) => p.review !== null)
            .map((p: any) => ({
              project: {
                id: p.id,
                name: p.name,
                display_title: p.display_title,
                client: p.client,
                description: p.description,
                technologies: p.technologies,
                key_results: p.key_results,
                live_url: p.live_url,
                category: p.category,
                status: p.status,
                budget: p.budget,
                timeline: p.timeline,
                progress: p.progress
              },
              review: p.review
            }));

          console.log('Total projects from API:', projectsData.projects.length);
          console.log('Projects with reviews:', projectsWithReviewsData.length);

          setProjectsWithReviews(projectsWithReviewsData);
          setStats(projectsData.stats);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-rotate carousel every 10 seconds
  useEffect(() => {
    if (projectsWithReviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projectsWithReviews.length);
      setExpandedDetails(false); // Collapse details on rotation
    }, 10000);

    return () => clearInterval(interval);
  }, [projectsWithReviews.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + projectsWithReviews.length) % projectsWithReviews.length);
    setExpandedDetails(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projectsWithReviews.length);
    setExpandedDetails(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const headerOffset = 60;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const currentItem = projectsWithReviews[currentIndex];

  return (
    <section id="projects" className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Recent Work
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Real projects built for satisfied clients. Each one delivered on time and on budget.
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

        {/* Carousel */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        ) : projectsWithReviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-600">No projects with reviews available yet.</p>
          </div>
        ) : currentItem && (
          <div className="max-w-5xl mx-auto relative mb-16">
            {/* Navigation Arrows */}
            {projectsWithReviews.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 bg-white rounded-full p-4 shadow-lg hover:bg-gray-50 transition-all z-10 hidden lg:block"
                  aria-label="Previous project"
                >
                  <FaChevronLeft className="text-blue-600 text-xl" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 bg-white rounded-full p-4 shadow-lg hover:bg-gray-50 transition-all z-10 hidden lg:block"
                  aria-label="Next project"
                >
                  <FaChevronRight className="text-blue-600 text-xl" />
                </button>
              </>
            )}

            {/* Project & Review Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              {(() => {
                const project = currentItem.project;
                const review = currentItem.review;

                // Parse technologies and key results
                const technologies = project.technologies
                  ? project.technologies.split('\n').map(t => t.trim()).filter(Boolean)
                  : [];
                const keyResults = project.key_results
                  ? project.key_results.split('\n').map(r => r.trim()).filter(Boolean)
                  : [];

                const hasDetails = project.description || technologies.length > 0 || keyResults.length > 0;

                return (
                  <>
                    {/* Project Section */}
                    <div className="p-8 md:p-10">
                      {/* Category & Timeline */}
                      <div className="flex justify-between items-center mb-4">
                        {project.category && (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {project.category}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">{project.timeline}</span>
                      </div>

                      {/* Title & Client */}
                      <h3 className="text-3xl font-bold text-gray-900 mb-3">
                        {project.display_title || project.name}
                      </h3>
                      <div className="mb-4">
                        <p className="text-blue-600 font-medium inline text-lg">{project.client}</p>
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline"
                          >
                            <FaExternalLinkAlt className="text-xs" />
                            Visit Site
                          </a>
                        )}
                      </div>

                      {/* Budget */}
                      <div className="mb-6">
                        <span className="text-2xl font-bold text-gray-900">
                          ${project.budget.toLocaleString()}
                        </span>
                      </div>

                      {/* View More Details Button */}
                      {hasDetails && (
                        <button
                          onClick={() => setExpandedDetails(!expandedDetails)}
                          className="w-full mb-4 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-medium py-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          {expandedDetails ? (
                            <>
                              <span>Hide Project Details</span>
                              <FaChevronUp className="text-sm" />
                            </>
                          ) : (
                            <>
                              <span>View Project Details</span>
                              <FaChevronDown className="text-sm" />
                            </>
                          )}
                        </button>
                      )}

                      {/* Expanded Details */}
                      {expandedDetails && hasDetails && (
                        <div className="space-y-6 mb-6 pt-4 border-t">
                          {/* Description */}
                          {project.description && (
                            <div>
                              <p className="text-gray-600 leading-relaxed">
                                {project.description}
                              </p>
                            </div>
                          )}

                          {/* Technologies */}
                          {technologies.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Technologies Used:</h4>
                              <div className="flex flex-wrap gap-2">
                                {technologies.map((tech, idx) => (
                                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Key Results */}
                          {keyResults.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Key Results:</h4>
                              <ul className="space-y-2">
                                {keyResults.map((result, idx) => (
                                  <li key={idx} className="flex items-start text-sm text-gray-600">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                                    {result}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Review Section */}
                    {review && (
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 md:p-10 border-t border-gray-200">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="text-blue-200 flex-shrink-0">
                            <FaQuoteLeft size={32} />
                          </div>
                          <div className="flex-1">
                            {/* Stars */}
                            <div className="flex mb-4">
                              {renderStars(review.rating)}
                            </div>

                            {/* Review Text */}
                            <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                              "{review.review_text}"
                            </p>

                            {/* Client Info */}
                            <div className="flex items-center">
                              <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                <span className="text-white text-xl font-bold">
                                  {review.client_name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{review.client_name}</h4>
                                <p className="text-sm text-gray-600">{review.client_title}</p>
                                <p className="text-sm text-blue-600 font-medium">{review.client_company}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CTA Section */}
                    <div className="p-8 md:p-10 border-t border-gray-200 bg-gray-50">
                      <button
                        onClick={scrollToContact}
                        className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
                      >
                        Start Similar Project
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Mobile Navigation & Indicators */}
            {projectsWithReviews.length > 1 && (
              <div className="mt-8">
                {/* Mobile Arrow Buttons */}
                <div className="flex justify-center gap-4 mb-6 lg:hidden">
                  <button
                    onClick={handlePrevious}
                    className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all"
                    aria-label="Previous project"
                  >
                    <FaChevronLeft className="text-blue-600" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all"
                    aria-label="Next project"
                  >
                    <FaChevronRight className="text-blue-600" />
                  </button>
                </div>

                {/* Dot Indicators */}
                <div className="flex justify-center gap-2">
                  {projectsWithReviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index);
                        setExpandedDetails(false);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? 'w-8 bg-blue-600'
                          : 'w-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to project ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
