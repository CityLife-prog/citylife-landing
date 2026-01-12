import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaLinkedin, FaInstagram, FaArrowUp, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaPaperclip, FaTimes } from 'react-icons/fa';

export default function Footer() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      // First, submit the quote request
      const response = await fetch('/api/quote-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // If there are files and we got a projectId, upload them
        if (files.length > 0 && data.projectId) {
          for (const file of files) {
            const fileFormData = new FormData();
            fileFormData.append('file', file);
            fileFormData.append('projectId', data.projectId.toString());

            await fetch('/api/files/upload', {
              method: 'POST',
              body: fileFormData,
            });
          }
        }

        // Redirect to thank you page
        router.push('/request-received');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try emailing us directly at citylife32@outlook.com');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please try emailing us directly at citylife32@outlook.com');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      // Limit to 5 files
      if (files.length + newFiles.length > 5) {
        setErrorMessage('Maximum 5 files allowed');
        return;
      }
      setFiles([...files, ...newFiles]);
      setErrorMessage('');
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <footer id="contact" className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get a Free Quote</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Tell us about your project. We'll respond within 24 hours with a detailed proposal and transparent pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
            {status === 'success' ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaPaperPlane className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Quote Request Received!
                </h3>
                <p className="text-gray-300 mb-8">
                  We'll respond within 24 hours with a detailed proposal.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="(720) 555-0123"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                    Company/Business <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Your Company Name"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Project Details <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                    placeholder="Tell us about your project... What are you looking to build? What problems are you trying to solve?"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Attach Files <span className="text-gray-400 text-xs">(Optional - PDF, DOC, images, max 5 files)</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-800 transition-all">
                      <FaPaperclip className="mr-2 text-gray-400" />
                      <span className="text-gray-300">Click to attach files</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-lg">
                            <div className="flex items-center">
                              <FaPaperclip className="text-gray-400 mr-2 text-sm" />
                              <span className="text-sm text-gray-200">{file.name}</span>
                              <span className="text-xs text-gray-400 ml-2">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {status === 'error' && (
                  <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
                    <p className="text-red-300 text-sm">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Quote Request
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-400 text-center">
                  We respect your privacy. Your information will never be shared.
                </p>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
            
            {/* Contact Methods */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FaEnvelope className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Email Us</h4>
                  <a href="mailto:citylife32@outlook.com" className="text-blue-400 hover:text-blue-300">
                    citylife32@outlook.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <FaPhone className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Call Us</h4>
                  <a href="tel:+1-720-525-5659" className="text-green-400 hover:text-green-300">
                    (720) 525-5659
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Visit Us</h4>
                  <p className="text-gray-300">Denver, Colorado</p>
                  <p className="text-gray-400 text-sm">Serving clients nationwide</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h4 className="font-semibold mb-4">Business Hours</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-green-400">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-yellow-400">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-gray-400">Closed</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <span className="text-blue-400 font-medium">Emergency Support: 24/7</span>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-blue-600 rounded-lg p-6">
              <h4 className="font-semibold mb-2">Quick Response Guarantee</h4>
              <p className="text-blue-100 text-sm">
                We respond to all inquiries within 2 hours during business hours, 
                and within 24 hours on weekends.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">CityLyfe LLC</h3>
              <p className="text-gray-400">Empowering Your Business With Code</p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-6">
              <a
                href="https://linkedin.com/company/citylife-llc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-white hover:bg-blue-600 transition"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://instagram.com/citylifellc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-white hover:bg-pink-600 transition"
              >
                <FaInstagram />
              </a>
            </div>

            {/* Back to Top */}
            <button 
              onClick={scrollToTop} 
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <FaArrowUp />
              Back to Top
            </button>
          </div>

          <div className="text-center mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} CityLyfe LLC. All rights reserved. | 
              <span className="ml-2">
                Licensed in Colorado | Insured & Bonded
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}