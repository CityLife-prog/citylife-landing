import { FaCode, FaMobile, FaCogs, FaCloud, FaHome, FaHeadset, FaSearch } from 'react-icons/fa';

export default function Services() {
  const projectServices = [
    {
      icon: <FaCode className="text-4xl text-blue-600" />,
      title: "Custom Web Development",
      description: "Professional, responsive websites built for performance, security, and scalability.",
      whoFor: "Businesses, contractors, startups, and organizations that need a strong online presence or improvements to an existing site.",
      features: [
        "Modern, mobile-first website design",
        "Performance-optimized builds",
        "Secure deployment and configuration",
        "SEO-ready site structure"
      ],
      disclaimer: "CityLyfe is not limited to a single framework or platform. While we frequently work with modern tools such as React and Next.js, we also work with websites already deployed on the web, support other frameworks, CMS platforms, and custom stacks, and can improve, refactor, or extend existing sites without requiring full rebuilds.",
      price: "Starting at $800"
    },
    {
      icon: <FaHome className="text-4xl text-orange-600" />,
      title: "Local Smart Home Integration",
      description: "Smart home setup and automation focused on reliability, security, and ease of use.",
      whoFor: "Homeowners, rental properties, and small offices looking to integrate smart technology locally.",
      features: [
        "Smart lighting and automation",
        "Security camera and monitoring setup",
        "Climate control systems",
        "Voice assistant configuration"
      ],
      disclaimer: "All hardware and devices are purchased by the client unless explicitly stated otherwise in the signed contract. CityLyfe provides professional recommendations, installation, and configuration services.",
      price: "Starting at $100"
    },
    {
      icon: <FaCogs className="text-4xl text-purple-600" />,
      title: "Business Automation",
      description: "Custom automation solutions that reduce manual work, improve accuracy, and streamline operations.",
      whoFor: "Businesses relying on repetitive tasks, spreadsheets, manual data entry, or disconnected systems.",
      features: [
        "Workflow automation",
        "Email and notification systems",
        "Data processing and validation",
        "API and third-party integrations"
      ],
      price: "Starting at $500"
    },
    {
      icon: <FaMobile className="text-4xl text-green-600" />,
      title: "Mobile App Development",
      description: "Custom mobile applications designed for usability, performance, and long-term growth.",
      whoFor: "Startups, internal business tools, and customer-facing mobile applications.",
      features: [
        "iOS and Android support",
        "Cross-platform development",
        "App store submission assistance",
        "Analytics and usage tracking"
      ],
      price: "Starting at $2,000"
    }
  ];

  const monthlyServices = [
    {
      icon: <FaSearch className="text-4xl text-indigo-600" />,
      title: "SEO & Website Visibility",
      description: "Search engine optimization focused on technical best practices, performance, and long-term visibility.",
      whoFor: "Businesses that want to improve search presence, local visibility, and website performance over time.",
      features: [
        "Technical SEO monitoring",
        "Page speed and performance optimization",
        "Mobile usability improvements",
        "Metadata updates (titles, descriptions, structured data)",
        "Google Search Console setup and monitoring",
        "Google Business Profile optimization",
        "Monthly performance summaries"
      ],
      disclaimer: "Search engine optimization results vary by industry and competition. Specific rankings, traffic levels, and conversions cannot be guaranteed.",
      price: "Starting at $300/month"
    },
    {
      icon: <FaHeadset className="text-4xl text-red-600" />,
      title: "Ongoing Support & Maintenance",
      description: "Proactive support to keep websites and systems secure, updated, and running smoothly.",
      whoFor: "Clients who want peace of mind after launch and priority support when changes or issues arise.",
      features: [
        "Bug fixes and issue resolution",
        "Security patches and updates",
        "Performance monitoring",
        "Content and minor updates"
      ],
      price: "Starting at $50/month"
    },
    {
      icon: <FaCloud className="text-4xl text-blue-500" />,
      title: "Cloud & Hosting Solutions",
      description: "Secure, scalable hosting and infrastructure management without the complexity of managing servers.",
      whoFor: "Businesses that want reliable hosting and monitoring without handling infrastructure themselves.",
      features: [
        "Domain and DNS configuration",
        "SSL certificates",
        "CDN and performance optimization",
        "Monitoring and backups"
      ],
      price: "Starting at $25/month"
    }
  ];

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
    <section id="services" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            CityLyfe delivers modern digital solutions for businesses and individuals who need
            reliable systems, clear pricing, and long-term support. We work with both new and
            existing technology and tailor every solution to your specific goals.
          </p>
        </div>

        {/* Project-Based Services */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Project-Based Services
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These services are typically one-time projects with a defined scope and delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projectServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100"
              >
                <div className="mb-6">{service.icon}</div>

                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h4>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900 mb-2">Who this is for:</h5>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {service.whoFor}
                  </p>
                </div>

                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900 mb-3">What's Included:</h5>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {service.disclaimer && (
                  <div className="mb-6 bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      <strong>Note:</strong> {service.disclaimer}
                    </p>
                  </div>
                )}

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                  </div>
                  <button
                    onClick={scrollToContact}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Services */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ongoing & Monthly Services
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These services are optional recurring offerings designed to keep your systems
              visible, secure, and performing well over time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {monthlyServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100"
              >
                <div className="mb-6">{service.icon}</div>

                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h4>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900 mb-2">Who this is for:</h5>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {service.whoFor}
                  </p>
                </div>

                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900 mb-3">What's Included:</h5>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {service.disclaimer && (
                  <div className="mb-6 bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      <strong>Important Note:</strong> {service.disclaimer}
                    </p>
                  </div>
                )}

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                  </div>
                  <button
                    onClick={scrollToContact}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Not Sure Which Service Fits Your Needs?
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Schedule a free discovery call and we'll help you choose the right solution.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={scrollToContact}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Schedule Free Consultation
            </button>
            <button
              onClick={scrollToProjects}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              View Portfolio
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}