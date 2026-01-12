import { FaFlag, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

export default function About() {

  return (
    <section id="about" className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Professional Software Solutions for Your Business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            CityLyfe is Matthew Kenner—a veteran developer committed to building software that works. No sales teams. No project managers. Just direct communication, honest pricing, and solutions built to last.
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