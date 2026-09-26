import { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaStar, FaQuoteLeft } from 'react-icons/fa';

// Client work. Was a second carousel; now a static row.
//
// The content earns its place — these are real projects with real reviews
// attached — but the page already asks you to swipe once, at the top. Asking
// twice is what made it feel long on a phone even when it wasn't. Everything
// is visible at once now: no arrows, no expand/collapse, no index state.

interface Project {
  id: number;
  name: string;
  display_title?: string;
  client: string;
  description?: string;
  live_url?: string;
  status: string;
}

interface Review {
  id: number;
  client_name: string;
  client_title: string;
  client_company: string;
  rating: number;
  review_text: string;
}

interface ProjectWithReview {
  project: Project;
  review?: Review;
}

interface ProjectStats {
  clientsSatisfied: number;
  averageRating: number;
  foundingYear: number;
}

export default function Projects() {
  const [items, setItems] = useState<ProjectWithReview[]>([]);
  const [stats, setStats] = useState<ProjectStats>({
    clientsSatisfied: 0,
    averageRating: 5.0,
    foundingYear: 2025,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/public/projects');
        const data = await response.json();

        if (data.success) {
          setItems(
            data.projects
              .filter((p: any) => p.review !== null)
              .map((p: any) => ({
                project: {
                  id: p.id,
                  name: p.name,
                  display_title: p.display_title,
                  client: p.client,
                  description: p.description,
                  live_url: p.live_url,
                  status: p.status,
                },
                review: p.review,
              }))
          );

          if (data.stats) {
            setStats({
              clientsSatisfied: data.stats.clientsSatisfied,
              averageRating: data.stats.averageRating,
              foundingYear: data.stats.foundingYear,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section id="projects" className="py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Client work
          </h2>
          {/* The old line here claimed every project was "delivered on time and
              on budget". Nothing sources that, so it is gone rather than
              reworded. The stats below come from the API. */}
          <p className="text-lg text-gray-600 mb-6">
            Real projects, and what the people who paid for them said.
          </p>

          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? '—' : stats.clientsSatisfied}
              </div>
              <div className="text-xs text-gray-600">Clients</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {loading ? '—' : stats.foundingYear}
              </div>
              <div className="text-xs text-gray-600">Founded</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {loading ? '—' : `${stats.averageRating}★`}
              </div>
              <div className="text-xs text-gray-600">Average rating</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No projects with reviews yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(({ project, review }) => (
              <article
                key={project.id}
                className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col hover:shadow-md transition"
              >
                <h3 className="font-bold text-gray-900 mb-1">
                  {project.display_title || project.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{project.client}</p>

                {project.description && (
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>
                )}

                {review && (
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <FaStar
                          key={i}
                          size={12}
                          className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 italic leading-relaxed mb-2">
                      <FaQuoteLeft size={10} className="inline text-gray-300 mr-1" />
                      {review.review_text}
                    </p>
                    <p className="text-xs text-gray-500">
                      {review.client_name}
                      {review.client_company ? `, ${review.client_company}` : ''}
                    </p>
                  </div>
                )}

                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-800 transition mt-4"
                  >
                    Visit site
                    <FaExternalLinkAlt size={10} />
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
