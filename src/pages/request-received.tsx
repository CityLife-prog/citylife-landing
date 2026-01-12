import Head from 'next/head';
import Link from 'next/link';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

export default function RequestReceived() {
  return (
    <>
      <Head>
        <title>Quote Request Received - CityLyfe LLC</title>
        <meta name="description" content="Your quote request has been received. We'll get back to you within 24 hours." />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto animate-pulse" />
          </div>

          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Request Received!
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Thank you for reaching out to CityLyfe. We've received your quote request and will respond within 24 hours.
          </p>

          {/* What Happens Next */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-left border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What Happens Next?
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">1</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">We Review Your Request</h3>
                  <p className="text-gray-600">Our team will carefully review your project details and requirements.</p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">2</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">You'll Hear From Us Soon</h3>
                  <p className="text-gray-600">Expect a detailed quote within 24 hours (usually much faster during business hours).</p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">3</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Let's Build Together</h3>
                  <p className="text-gray-600">Most projects start within 2 weeks of approval.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-3">Need Immediate Assistance?</h3>
            <p className="text-gray-600 mb-4">You can reach us directly:</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:citylife32@outlook.com"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                citylife32@outlook.com
              </a>
              <span className="hidden sm:inline text-gray-400">|</span>
              <a
                href="tel:+17205255659"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                (720) 525-5659
              </a>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <FaArrowLeft />
              Back to Home
            </Link>
            <Link
              href="/#projects"
              className="inline-flex items-center justify-center bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
