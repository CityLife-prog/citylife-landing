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
    <section id="about" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About CityLyfe LLC
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're a veteran-owned, Colorado-based IT company dedicated to empowering businesses 
            with innovative technology solutions that drive growth and efficiency.
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
                Founded in 2025, CityLyfe LLC is a veteran-owned business that started with a simple mission: 
                help growing businesses leverage technology to streamline operations and increase efficiency. 
                Based in Colorado, I focus on creating custom solutions that make a real difference 
                for small and medium-sized businesses.
              </p>
              <p>
                As a solo developer, I bring a personal touch to every project. I take the time 
                to understand your unique challenges and build solutions that fit your specific needs 
                and budget. Whether you need a professional website, mobile app, or business automation, 
                I'm committed to delivering quality work that exceeds expectations.
              </p>
              <p>
                With 100% client satisfaction on my completed projects, I pride myself on clear 
                communication, reliable delivery, and ongoing support. When you work with CityLyfe LLC, 
                you're not just hiring a developer – you're gaining a technology partner who cares 
                about your success.
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
                My Mission
              </h4>
              <p className="text-lg opacity-90 leading-relaxed">
                To help businesses leverage technology effectively with personalized service, 
                honest communication, and solutions that truly make a difference in their daily operations.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Drives Me
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
                  Hi, I'm Matthew Kenner, the founder of CityLyfe LLC. As a military veteran, I started this company 
                  with a simple goal: to help businesses succeed through better technology solutions while bringing 
                  the same dedication, discipline, and attention to detail I learned during my service.
                </p>
                <p>
                  As a full-stack developer, I specialize in creating custom websites, mobile applications, 
                  and automation tools that make real differences in how businesses operate. 
                  I believe in honest communication, transparent pricing, and delivering exactly what I promise.
                </p>
                <p>
                  When you work with CityLyfe LLC, you're working directly with me. I personally handle 
                  every aspect of your project from initial consultation to final delivery and ongoing support. 
                  This personal approach ensures quality and accountability that larger agencies simply can't match.
                </p>
              </div>

              {/* Skills */}
              <div className="mt-8">
                <h5 className="font-semibold text-gray-900 mb-4">Core Expertise:</h5>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">React & Next.js</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Node.js</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">TypeScript</span>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">Mobile Development</span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Cloud Platforms</span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Business Automation</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Ready to discuss your project? Let's connect and see how I can help your business grow.
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