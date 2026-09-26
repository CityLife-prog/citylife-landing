export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 60;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
    }
  };

  // Deliberately short. The three tiles that used to sit here listed Products,
  // Websites & IT and Homelab — the same three things the carousel immediately
  // below now shows in full, with honest statuses attached. Two CTAs became one
  // for the same reason: "see what we're building" pointed at a section already
  // in view.
  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-300/20 rounded-full blur-lg"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
          We build our own software. And yours.
        </h1>

        <p className="text-lg md:text-2xl mb-8 text-blue-100 leading-relaxed">
          CityLyfe is a product company first. The same hands do website and IT
          work for a small number of clients.
        </p>

        <button
          onClick={() => scrollTo('contact')}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg"
        >
          Work With Us
        </button>
      </div>
    </section>
  );
}
