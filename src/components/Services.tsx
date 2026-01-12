import { useState, useEffect } from 'react';
import { FaCode, FaMobile, FaCogs, FaCloud, FaHome, FaHeadset, FaSearch, FaChevronDown, FaChevronUp, FaChartLine } from 'react-icons/fa';

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
  sort_order: number;
}

export default function Services() {
  const [expandedServices, setExpandedServices] = useState<Set<number>>(new Set());
  const [projectServices, setProjectServices] = useState<Service[]>([]);
  const [monthlyServices, setMonthlyServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/public/services');
        const data = await response.json();

        if (data.success) {
          setProjectServices(data.services.project || []);
          setMonthlyServices(data.services.monthly || []);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const toggleService = (serviceId: number) => {
    setExpandedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  // Icon mapping (not stored in database)
  const getServiceIcon = (title: string) => {
    if (title.includes('Audit') || title.includes('Updates')) return <FaChartLine className="text-4xl text-teal-600" />;
    if (title.includes('Web Development')) return <FaCode className="text-4xl text-blue-600" />;
    if (title.includes('Smart Home')) return <FaHome className="text-4xl text-orange-600" />;
    if (title.includes('Automation')) return <FaCogs className="text-4xl text-purple-600" />;
    if (title.includes('Mobile')) return <FaMobile className="text-4xl text-green-600" />;
    if (title.includes('SEO')) return <FaSearch className="text-4xl text-indigo-600" />;
    if (title.includes('Support')) return <FaHeadset className="text-4xl text-red-600" />;
    if (title.includes('Cloud')) return <FaCloud className="text-4xl text-blue-500" />;
    return <FaCogs className="text-4xl text-gray-600" />;
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

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) {
      const headerOffset = 60;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What We Build
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether it's one-time projects or continued support, we've got you covered.
          </p>
        </div>

        {/* Project-Based Services */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              One-Time Projects
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fixed-price projects with defined scope and delivery timeline.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading services...</p>
            </div>
          ) : projectServices.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No project services available at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectServices.map((service) => {
              const isExpanded = expandedServices.has(service.id);

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer"
                  onClick={() => !isExpanded && toggleService(service.id)}
                >
                  {!isExpanded ? (
                    /* Collapsed - Ultra Compact Card View */
                    <div className="p-4">
                      {/* Icon */}
                      <div className="flex justify-center mb-3">
                        {getServiceIcon(service.title)}
                      </div>

                      {/* Title */}
                      <h4 className="text-base font-bold text-gray-900 mb-2 text-center leading-tight">
                        {service.title}
                      </h4>

                      {/* Price */}
                      <div className="text-center mb-3">
                        <span className="text-lg font-bold text-blue-600">{service.price}</span>
                      </div>

                      {/* View Details Button */}
                      <button
                        className="w-full flex items-center justify-center gap-1 text-blue-600 hover:text-blue-800 font-medium py-1.5 text-xs"
                      >
                        <span>View Details</span>
                        <FaChevronDown className="text-xs" />
                      </button>
                    </div>
                  ) : (
                    /* Expanded - Full Details View */
                    <div className="p-6">
                      {/* Title */}
                      <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
                        {service.title}
                      </h4>

                      {/* Pricing */}
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 text-sm">Price Estimate:</span>
                          <div className="text-right">
                            <span className="text-lg font-bold text-blue-600">{service.price}</span>
                            {service.hardware_included && (
                              <div className="text-xs text-green-700 mt-1">
                                *Hardware included in price
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {service.description}
                      </p>

                      {/* Who this is for */}
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">Who this is for:</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {service.who_for}
                        </p>
                      </div>

                      {/* What's Included */}
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">What's Included:</h5>
                        <ul className="space-y-1.5">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Disclaimer */}
                      {service.disclaimer && (
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mb-4">
                          <p className="text-xs text-gray-700 leading-relaxed">
                            <strong>Note:</strong> {service.disclaimer}
                          </p>
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={scrollToContact}
                          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                        >
                          Request Quote
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleService(service.id);
                          }}
                          className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-medium py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                        >
                          <span>View Less</span>
                          <FaChevronUp className="text-xs" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          )}
        </div>

        {/* Monthly Services */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ongoing Support
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Monthly maintenance and optimization to keep your systems secure and performing well.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading services...</p>
            </div>
          ) : monthlyServices.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No monthly services available at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {monthlyServices.map((service) => {
              const isExpanded = expandedServices.has(service.id);

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer"
                  onClick={() => !isExpanded && toggleService(service.id)}
                >
                  {!isExpanded ? (
                    /* Collapsed - Ultra Compact Card View */
                    <div className="p-4">
                      {/* Icon */}
                      <div className="flex justify-center mb-3">
                        {getServiceIcon(service.title)}
                      </div>

                      {/* Title */}
                      <h4 className="text-base font-bold text-gray-900 mb-2 text-center leading-tight">
                        {service.title}
                      </h4>

                      {/* Price */}
                      <div className="text-center mb-3">
                        <span className="text-lg font-bold text-blue-600">{service.price}</span>
                      </div>

                      {/* View Details Button */}
                      <button
                        className="w-full flex items-center justify-center gap-1 text-blue-600 hover:text-blue-800 font-medium py-1.5 text-xs"
                      >
                        <span>View Details</span>
                        <FaChevronDown className="text-xs" />
                      </button>
                    </div>
                  ) : (
                    /* Expanded - Full Details View */
                    <div className="p-6">
                      {/* Title */}
                      <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
                        {service.title}
                      </h4>

                      {/* Pricing */}
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 text-sm">Price Estimate:</span>
                          <div className="text-right">
                            <span className="text-lg font-bold text-blue-600">{service.price}</span>
                            {service.hardware_included && (
                              <div className="text-xs text-green-700 mt-1">
                                *Hardware included in price
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {service.description}
                      </p>

                      {/* Who this is for */}
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">Who this is for:</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {service.who_for}
                        </p>
                      </div>

                      {/* What's Included */}
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">What's Included:</h5>
                        <ul className="space-y-1.5">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Disclaimer */}
                      {service.disclaimer && (
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mb-4">
                          <p className="text-xs text-gray-700 leading-relaxed">
                            <strong>Important Note:</strong> {service.disclaimer}
                          </p>
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={scrollToContact}
                          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                        >
                          Learn More
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleService(service.id);
                          }}
                          className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-medium py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                        >
                          <span>View Less</span>
                          <FaChevronUp className="text-xs" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}