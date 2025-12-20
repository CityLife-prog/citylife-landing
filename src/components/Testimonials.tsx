import { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

export default function Testimonials() {
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
  const testimonials = [
    {
      name: "VSR Team",
      title: "Business Owner",
      company: "VSR Snow Removal",
      image: "/api/placeholder/80/80",
      rating: 5,
      text: "Matthew delivered exactly what we needed for our construction business. The website looks professional, works perfectly on mobile, and has already helped us connect with new customers. Great communication and fair pricing.",
      project: "Construction Company Website"
    },
    {
      name: "Matthew K.",
      title: "Founder",
      company: "CityLyfe LLC",
      image: "/api/placeholder/80/80",
      rating: 5,
      text: "Building my own business website was a great way to showcase my skills and attention to detail. The modern design and clear service presentation demonstrate exactly what I can deliver for my clients.",
      project: "Business Portfolio Website"
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section id="testimonials" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What My Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take my word for it. Here's what business owners have to say 
            about their experience working with CityLyfe LLC.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 relative">
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-blue-100">
                <FaQuoteLeft size={24} />
              </div>
              
              {/* Stars */}
              <div className="flex mb-6">
                {renderStars(testimonial.rating)}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-600 text-lg leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>
              
              {/* Project */}
              <div className="mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {testimonial.project}
                </span>
              </div>
              
              {/* Author */}
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl font-bold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                  <p className="text-sm text-blue-600 font-medium">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-gray-50 rounded-2xl p-12 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Building Trust, One Project at a Time
            </h3>
            <p className="text-gray-600">
              Quality work and honest service - that's the foundation of every client relationship
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {loading ? '...' : `${stats.satisfactionRate}%`}
              </div>
              <div className="text-sm text-gray-600">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {loading ? '...' : stats.completedProjects}
              </div>
              <div className="text-sm text-gray-600">Websites Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {loading ? '...' : stats.foundingYear}
              </div>
              <div className="text-sm text-gray-600">Year Founded</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">1:1</div>
              <div className="text-sm text-gray-600">Personal Service</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Be My Next Success Story?
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join these satisfied clients who've experienced the personal touch and quality 
            that comes with working directly with Matthew at CityLyfe LLC.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button 
              onClick={scrollToContact}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Start Your Transformation
            </button>
            <button 
              onClick={scrollToContact}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              Schedule Free Consultation
            </button>
          </div>
          
          {/* Guarantee */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center bg-white/20 rounded-full px-6 py-3">
              <span className="text-yellow-300 mr-2">⭐</span>
              <span className="text-sm font-medium">
                100% Satisfaction Guarantee - We don't stop until you're thrilled with the results
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}