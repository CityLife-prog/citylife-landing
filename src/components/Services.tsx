import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaCode, FaCogs, FaHome, FaHeadset, FaArrowRight } from 'react-icons/fa';

// Compact services block for the landing page.
//
// The full catalog is nine services across two categories and used to sit here
// inline, which made it the longest thing on the page. It now lives at
// /services; this shows four and links there.
//
// WHY THESE FOUR, and not simply the first four the API returns: between them
// they cover the whole range, so nobody has to read the full list to work out
// whether their problem is one we handle.
//
//   Custom Web Development      one-time build, the core offering
//   Ongoing Support & Maintenance  the monthly side, not project work
//   Local Smart Home Integration   on-site work, not everything is remote
//   Business Automation            custom work that isn't a website
//
// Titles are matched against the live catalog, so if one is renamed in the
// admin dashboard it drops out silently rather than breaking the page. If
// fewer than four match, the block still renders with whatever it found.

const FEATURED_TITLES = [
  'Custom Web Development',
  'Ongoing Support & Maintenance',
  'Local Smart Home Integration',
  'Business Automation',
];

interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
}

const iconFor = (title: string) => {
  if (title.includes('Web Development')) return <FaCode className="text-2xl text-blue-600" />;
  if (title.includes('Support')) return <FaHeadset className="text-2xl text-red-600" />;
  if (title.includes('Smart Home')) return <FaHome className="text-2xl text-orange-600" />;
  return <FaCogs className="text-2xl text-purple-600" />;
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/public/services');
        const data = await response.json();

        if (data.success) {
          const all: Service[] = [
            ...(data.services.project || []),
            ...(data.services.monthly || []),
          ];
          setTotal(all.length);
          setServices(
            FEATURED_TITLES.map((title) => all.find((s) => s.title === title)).filter(
              (s): s is Service => Boolean(s)
            )
          );
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section id="services" className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            What we can do for you
          </h2>
          <p className="text-lg text-gray-600">
            One-time projects or ongoing support, remote or on site.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading services…</div>
        ) : services.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Services are unavailable right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service) => (
              <div
                key={service.id}
                className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition flex flex-col"
              >
                <div className="mb-3">{iconFor(service.title)}</div>
                <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-3">
                  {service.description}
                </p>
                {service.price && (
                  <p className="mt-auto text-sm font-semibold text-gray-900">
                    {service.price}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition group"
          >
            {total > services.length
              ? `See all ${total} services`
              : 'See all services'}
            <FaArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
