import Link from 'next/link';

export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 60;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-14 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-purple-300/20 rounded-full blur-lg"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          We build our own software. And yours.
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
          CityLyfe is a product company first — PropKeep and StompingGround are
          ours, built and run in-house. The same hands do website, IT and homelab
          work for a small number of clients.
        </p>

        <div className="flex justify-center gap-4 flex-wrap mb-8">
          <button
            onClick={() => scrollTo('products')}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg"
          >
            See What We&apos;re Building
          </button>
          <button
            onClick={() => scrollTo('services')}
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
          >
            Work With Us
          </button>
        </div>

        {/* The three lines of the business, in the order they matter. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <button
            onClick={() => scrollTo('products')}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition text-left"
          >
            <div className="text-xs uppercase tracking-wide text-blue-200 mb-2">
              First
            </div>
            <h3 className="font-semibold text-lg mb-2">Products</h3>
            <p className="text-blue-100 text-sm">
              PropKeep and StompingGround — our own software, built to be used by
              people who aren&apos;t us.
            </p>
          </button>

          <button
            onClick={() => scrollTo('services')}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition text-left"
          >
            <div className="text-xs uppercase tracking-wide text-blue-200 mb-2">
              Also
            </div>
            <h3 className="font-semibold text-lg mb-2">Websites &amp; IT</h3>
            <p className="text-blue-100 text-sm">
              Site builds, plus local and remote IT support. Direct with the
              person doing the work.
            </p>
          </button>

          <Link
            href="/homelab"
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition block"
          >
            <div className="text-xs uppercase tracking-wide text-blue-200 mb-2">
              New
            </div>
            <h3 className="font-semibold text-lg mb-2">Homelab builds</h3>
            <p className="text-blue-100 text-sm">
              Your own storage and services, running in your house. Currently
              being built and documented here first.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
