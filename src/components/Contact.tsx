import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Contact() {
  return (
    <section id="contact-info" className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Let's Work Together
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Most projects start within 2 weeks. Free quotes returned within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Email */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaEnvelope className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Email Us</h3>
            <a
              href="mailto:citylife32@outlook.com"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              citylife32@outlook.com
            </a>
            <p className="text-gray-500 text-sm mt-4">
              We respond within 2 hours during business hours
            </p>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaPhone className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Call Us</h3>
            <a
              href="tel:+17205255659"
              className="text-green-600 hover:text-green-700 font-medium hover:underline"
            >
              (720) 525-5659
            </a>
            <p className="text-gray-500 text-sm mt-4">
              Monday - Friday: 9 AM - 6 PM MST
            </p>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaMapMarkerAlt className="text-purple-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Visit Us</h3>
            <p className="text-gray-700 font-medium">
              Denver, Colorado
            </p>
            <p className="text-gray-500 text-sm mt-4">
              Serving clients nationwide
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-blue-100">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Choose CityLyfe?
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start">
              <span className="text-blue-600 text-2xl mr-3 flex-shrink-0">✓</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Personal 1-on-1 Service</h4>
                <p className="text-gray-600">Work directly with our team, not an account manager</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 text-2xl mr-3 flex-shrink-0">✓</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Fast Turnaround Times</h4>
                <p className="text-gray-600">Responsive communication and efficient project delivery</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 text-2xl mr-3 flex-shrink-0">✓</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">No Project Minimums</h4>
                <p className="text-gray-600">We scale to your needs, big or small</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 text-2xl mr-3 flex-shrink-0">✓</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Transparent Pricing</h4>
                <p className="text-gray-600">Clear quotes with no hidden fees or surprises</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
