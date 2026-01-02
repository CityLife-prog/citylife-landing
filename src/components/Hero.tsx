export default function Hero() {
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const headerOffset = 60;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      const headerOffset = 60;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-14 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-purple-300/20 rounded-full blur-lg"></div>
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="mb-6">
          <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            🚀 Empowering Your Business With Code
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="block">Transform Your Business</span>
          <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
            With Custom IT Solutions
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
          We are CityLyfe, and we create custom websites, mobile apps, local smart home integration, and automation solutions
          that help small businesses grow and succeed.
        </p>
        
        <div className="flex justify-center gap-4 flex-wrap mb-8">
          <button 
            onClick={scrollToContact}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Your Project
          </button>
          <button
            onClick={scrollToServices}
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
          >
            View Our Services
          </button>
        </div>
        
        {/* Key benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">👤</div>
            <h3 className="font-semibold text-lg mb-2">Personal Service</h3>
            <p className="text-blue-100 text-sm">Work directly with our team on every project</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">💯</div>
            <h3 className="font-semibold text-lg mb-2">100% Satisfaction</h3>
            <p className="text-blue-100 text-sm">All clients have been completely satisfied</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="font-semibold text-lg mb-2">Honest & Reliable</h3>
            <p className="text-blue-100 text-sm">Clear communication and transparent pricing</p>
          </div>
        </div>
      </div>
    </section>
  );
}