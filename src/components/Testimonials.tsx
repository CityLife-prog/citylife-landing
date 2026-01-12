import { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Fetch reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/public/reviews');
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data.map((review: any) => ({
            name: review.client_name,
            title: review.client_title,
            company: review.client_company,
            image: review.image_url || '/api/placeholder/80/80',
            rating: review.rating,
            text: review.review_text,
            project: review.project_name || 'Client Project'
          })));
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Auto-rotate reviews every 10 seconds if there are more than 3
  useEffect(() => {
    if (testimonials.length <= 3) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 2) % testimonials.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section id="testimonials" className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what business owners have to say
            about their experience working with CityLyfe LLC.
          </p>
        </div>

        {/* Testimonials Grid */}
        {reviewsLoading ? (
          <div className="flex justify-center items-center mb-16 min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center mb-16 py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-600">No reviews available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            {/* Display 2 testimonials at a time, rotating if more than 3 */}
            {testimonials.length <= 3 ? (
              // Show all if 3 or fewer
              testimonials.map((testimonial, index) => (
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
              ))
            ) : (
              // Show 2 rotating testimonials if more than 3
              [testimonials[currentIndex], testimonials[(currentIndex + 1) % testimonials.length]].map((testimonial, index) => (
                <div key={`${currentIndex}-${index}`} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 relative">
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
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}