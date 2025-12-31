import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaPaperclip, FaTimes } from 'react-icons/fa';

export default function Contact() {
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

        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        });
        setFiles([]);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
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
    <section id="contact" className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get a Free Quote
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to transform your business with custom IT solutions? Fill out the form below
            and we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Let's Build Something Amazing Together
              </h3>
              <p className="text-gray-600 mb-8">
                Whether you're starting from scratch or need help with an existing project,
                we're here to help. No project is too big or too small.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="text-blue-600 text-xl" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">Email</h4>
                  <a href="mailto:citylife32@outlook.com" className="text-blue-600 hover:underline">
                    citylife32@outlook.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaPhone className="text-green-600 text-xl" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">Phone</h4>
                  <a href="tel:+17205255659" className="text-green-600 hover:underline">
                    (720) 525-5659
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaMapMarkerAlt className="text-purple-600 text-xl" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">Location</h4>
                  <p className="text-gray-600">Denver, CO</p>
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Why Choose CityLyfe?</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Personal 1-on-1 service - work directly with our team</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Fast turnaround times and responsive communication</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>No project minimums - we scale to your needs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Transparent pricing with no hidden fees</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quote Request Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaPaperPlane className="text-green-600 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Thank You!
                </h3>
                <p className="text-gray-600 mb-8">
                  We've received your quote request and will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                    placeholder="(720) 555-0123"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Business <span className="text-gray-400 text-xs">(Optional - we can help you start one!)</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                    placeholder="Your Company Name"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 bg-white"
                    placeholder="Tell us about your project... What are you looking to build? What problems are you trying to solve?"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach Files <span className="text-gray-400 text-xs">(Optional - PDF, DOC, images, max 5 files)</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                      <FaPaperclip className="mr-2 text-gray-400" />
                      <span className="text-gray-600">Click to attach files</span>
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
                          <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                            <div className="flex items-center">
                              <FaPaperclip className="text-gray-400 mr-2 text-sm" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700 p-1"
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
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
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
                      <FaPaperPlane className="mr-2" />
                      Get Your Free Quote
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  We respect your privacy. Your information will never be shared.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
