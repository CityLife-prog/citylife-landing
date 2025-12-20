import { FaCode, FaMobile, FaCogs, FaCloud, FaChartLine, FaHeadset } from 'react-icons/fa';

export default function Services() {
  const services = [
    {
      icon: <FaCode className="text-4xl text-blue-600" />,
      title: "Custom Web Development",
      description: "Modern, responsive websites built with the latest technologies. From landing pages to complex web applications.",
      features: ["React & Next.js", "Mobile-First Design", "SEO Optimized", "Fast Loading"],
      price: "Starting at $800"
    },
    {
      icon: <FaMobile className="text-4xl text-green-600" />,
      title: "Mobile App Development",
      description: "Native iOS and Android apps, plus cross-platform solutions that work seamlessly across all devices.",
      features: ["iOS & Android", "Cross-Platform", "App Store Publishing", "User Analytics"],
      price: "Starting at $2,000"
    },
    {
      icon: <FaCogs className="text-4xl text-purple-600" />,
      title: "Business Automation",
      description: "Streamline your workflows with custom automation solutions. Save time and reduce manual tasks.",
      features: ["Workflow Automation", "Email Integration", "Data Processing", "API Connections"],
      price: "Starting at $500"
    },
    {
      icon: <FaCloud className="text-4xl text-indigo-600" />,
      title: "Cloud & Hosting Solutions",
      description: "Secure, scalable hosting and cloud infrastructure. Domain setup, SSL certificates, and maintenance.",
      features: ["Domain Registration", "SSL Certificates", "CDN Setup", "24/7 Monitoring"],
      price: "Starting at $25/month"
    },
    {
      icon: <FaChartLine className="text-4xl text-orange-600" />,
      title: "Digital Strategy & Consulting",
      description: "Technology roadmaps and digital transformation strategies tailored to your business goals.",
      features: ["Tech Audits", "Growth Strategy", "ROI Analysis", "Implementation Plans"],
      price: "Starting at $75/hour"
    },
    {
      icon: <FaHeadset className="text-4xl text-red-600" />,
      title: "Ongoing Support & Maintenance",
      description: "Keep your systems running smoothly with our comprehensive support and maintenance packages.",
      features: ["Bug Fixes", "Security Updates", "Performance Monitoring", "Content Updates"],
      price: "Starting at $50/month"
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
            Our IT Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From custom websites to mobile apps and business automation - 
            we deliver comprehensive IT solutions that drive growth and efficiency.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:-translate-y-2"
            >
              <div className="mb-6">{service.icon}</div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                </div>
                <button 
                  onClick={scrollToContact}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Get Quote
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Need Something Custom?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Every business is unique. Let's discuss your specific requirements 
            and create a tailored solution that fits your needs and budget.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button 
              onClick={scrollToContact}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Schedule Free Consultation
            </button>
            <button 
              onClick={scrollToProjects}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Portfolio
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}