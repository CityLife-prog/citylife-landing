import { FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

export default function About() {

  return (
    <section id="about" className="py-10 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Who you&apos;re actually dealing with
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            CityLyfe is Matthew Kenner—a veteran developer. No sales team, no
            project manager, no account handler. You talk to the person writing
            the code.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link href="/about">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 group">
                Read Full Story
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}