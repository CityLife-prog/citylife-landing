import { useState, useEffect } from 'react';
import { FaAward, FaUsers, FaRocket, FaHandshake, FaCode, FaLightbulb, FaFlag } from 'react-icons/fa';

export default function About() {
  const [stats, setStats] = useState({
    completedProjects: 2,
    foundingYear: 2025,
    satisfactionRate: 100
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/public/projects');
        const data = await response.json();
        
        if (data.success) {
          setStats({
            completedProjects: data.stats.completedProjects,
            foundingYear: data.stats.foundingYear,
            satisfactionRate: data.stats.satisfactionRate
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  const values = [
    {
      icon: <FaCode className="text-3xl text-blue-600" />,
      title: "Technical Excellence",
      description: "We use cutting-edge technologies and industry best practices to deliver robust, scalable solutions."
    },
    {
      icon: <FaHandshake className="text-3xl text-green-600" />,
      title: "Client Partnership",
      description: "Your success is our success. We work as an extension of your team, not just a vendor."
    },
    {
      icon: <FaRocket className="text-3xl text-purple-600" />,
      title: "Results Driven",
      description: "Every solution we build is designed to drive measurable business outcomes and ROI."
    },
    {
      icon: <FaLightbulb className="text-3xl text-orange-600" />,
      title: "Innovation Focus",
      description: "We stay ahead of technology trends to provide you with competitive advantages."
    }
  ];

  const statsDisplay = [
    { 
      number: loading ? "..." : stats.completedProjects.toString(), 
      label: "Websites Completed", 
      color: "text-blue-600" 
    },
    { 
      number: loading ? "..." : stats.foundingYear.toString(), 
      label: "Founded", 
      color: "text-green-600" 
    },
    { 
      number: loading ? "..." : `${stats.satisfactionRate}%`, 
      label: "Client Satisfaction", 
      color: "text-purple-600" 
    },
    { 
      number: "1-on-1", 
      label: "Personal Service", 
      color: "text-orange-600" 
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

  return (
    <section id="about" className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About CityLyfe LLC
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veteran-owned cybersecurity and software engineering firm specializing in secure distributed systems,
            AI-powered solutions, and enterprise-grade applications built with military precision.
          </p>
          
          {/* Veteran Owned Badge */}
          <div className="flex justify-center mt-8">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg px-6 py-3 flex items-center space-x-3">
              <FaFlag className="text-red-600 text-xl" />
              <span className="text-red-800 font-semibold">Proudly Veteran Owned</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Left Column - Story */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Our Story
            </h3>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Founded in 2025, CityLyfe LLC is a veteran-owned business specializing in cybersecurity-focused
                software engineering, distributed systems, and AI-powered solutions. Based in Denver, Colorado,
                we combine military-grade security practices with modern development expertise to deliver
                enterprise-quality solutions for businesses of all sizes.
              </p>
              <p>
                With a foundation in secure Linux infrastructure, containerized applications, and cloud-adjacent
                deployments, we bring the same operational discipline from military communications systems to
                commercial software engineering. Whether you need a hardened web application, automated workflows,
                or AI-integrated systems, we deliver solutions built with security and scalability at the core.
              </p>
              <p>
                Our expertise spans full-stack development, cybersecurity, distributed systems design, and
                applied AI/ML systems. With hands-on NVIDIA Deep Learning Institute training and real-world
                deployment experience, we stay ahead of technology trends to provide you with competitive advantages
                in an increasingly digital landscape.
              </p>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <button 
                onClick={scrollToContact}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Let's Build Something Amazing
              </button>
            </div>
          </div>

          {/* Right Column - Stats & Values */}
          <div>
            {/* Stats */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                By The Numbers
              </h4>
              <div className="grid grid-cols-2 gap-6">
                {statsDisplay.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-4">
                Our Mission
              </h4>
              <p className="text-lg opacity-90 leading-relaxed">
                To deliver military-grade security and reliability to commercial software systems while
                making cutting-edge AI and distributed systems technology accessible to businesses of all sizes
                through personalized service and transparent communication.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Drives Us
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="mb-6 flex justify-center">
                  {value.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Founder Section */}
        <div className="bg-white rounded-2xl p-12 shadow-lg">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Meet the Founder
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get to know the person behind CityLyfe LLC and the passion 
              that drives every project forward.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Founder Profile */}
            <div className="text-center">
              <div className="w-40 h-40 mx-auto mb-6 relative">
                <img 
                  src="/profile.jpg" 
                  alt="Matthew Kenner - Founder of CityLyfe LLC"
                  className="w-full h-full object-cover rounded-full border-4 border-blue-200 shadow-lg"
                />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Matthew Kenner</h4>
              <div className="flex justify-center items-center space-x-3 mb-6">
                <p className="text-blue-600 font-medium">Founder & Lead Developer</p>
                <div className="bg-red-100 px-3 py-1 rounded-full flex items-center space-x-1">
                  <FaFlag className="text-red-600 text-sm" />
                  <span className="text-red-700 text-sm font-medium">Veteran</span>
                </div>
              </div>
              
              <div className="text-left space-y-4 text-gray-600">
                <p>
                  Hi, I'm Matthew Kenner, founder of CityLyfe LLC. As a U.S. Army veteran and cybersecurity-focused
                  software engineer, I bring over a decade of experience in secure communications, network systems,
                  and mission-critical infrastructure to commercial software development. I served as a Network
                  Communication Systems Specialist (25H), where I led training for 100+ soldiers and deployed tactical
                  communication systems across multiple countries.
                </p>
                <p>
                  Currently pursuing my B.S. in Computer Science at the University of Colorado Denver (graduating May 2026)
                  with minors in Data Science and Risk Management & Insurance, I combine academic rigor with real-world
                  deployment experience. I've completed advanced NVIDIA Deep Learning Institute certifications in
                  Transformer-Based NLP, Generative AI, RAG Agents, and Agentic AI Applications, staying at the
                  cutting edge of AI/ML technologies.
                </p>
                <p>
                  My technical foundation spans secure software engineering, distributed systems design, containerized
                  application delivery, and applied AI systems. Whether building production web applications with
                  Node.js and Docker, implementing secure Linux environments, or developing automation workflows,
                  I bring the same operational excellence and attention to detail from military service to every project.
                </p>
                <p>
                  When you work with CityLyfe LLC, you get direct access to an engineer who understands both the
                  technical requirements and security implications of modern software systems. I personally handle
                  every aspect of your project, ensuring quality, security, and reliability that comes from military-grade
                  standards applied to commercial solutions.
                </p>
              </div>

              {/* Skills */}
              <div className="mt-8">
                <h5 className="font-semibold text-gray-900 mb-4">Technical Expertise:</h5>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Python</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">JavaScript/TypeScript</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">React & Next.js</span>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">Node.js & Express</span>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">Docker</span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Linux & Bash</span>
                  <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">PostgreSQL</span>
                  <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">PyTorch & CUDA</span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Django & FastAPI</span>
                  <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">AI/ML Systems</span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Cybersecurity</span>
                  <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-sm">Distributed Systems</span>
                </div>
              </div>

              {/* Education & Certifications */}
              <div className="mt-8">
                <h5 className="font-semibold text-gray-900 mb-4">Education & Certifications:</h5>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>B.S. Computer Science</strong> - University of Colorado Denver (May 2026)</p>
                  <p><strong>NVIDIA DLI Certifications</strong> - Transformer NLP, Generative AI, RAG Agents, Agentic AI</p>
                  <p><strong>CPCU Designation</strong> | <strong>Secret Clearance</strong> | <strong>Air Assault</strong></p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Ready to discuss your project? Let's connect and see how we can help your business grow.
            </p>
            <button 
              onClick={scrollToContact}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}