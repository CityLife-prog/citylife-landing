import Head from 'next/head';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <>
      <Head>
        <title>CityLyfe LLC - Custom IT Solutions for Growing Businesses</title>
        <meta name="description" content="Professional web development, mobile apps, and business automation for Colorado businesses. Custom IT solutions that drive growth and efficiency." />
        <meta name="keywords" content="business IT solutions, custom web development, automation for small businesses, mobile app development, Colorado IT services" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph */}
        <meta property="og:title" content="CityLyfe LLC - Custom IT Solutions for Growing Businesses" />
        <meta property="og:description" content="Transform your business with professional web development, mobile apps, and automation solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://citylifellc.com" />
        
        {/* Schema.org markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "CityLyfe LLC",
              "description": "Custom IT solutions for growing businesses",
              "url": "https://citylifellc.com",
              "logo": "https://citylifellc.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-720-525-5659",
                "contactType": "customer service",
                "areaServed": "US",
                "availableLanguage": "English"
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Denver",
                "addressRegion": "CO",
                "addressCountry": "US"
              },
              "sameAs": [
                "https://linkedin.com/company/citylife-llc",
                "https://instagram.com/citylifellc"
              ]
            })
          }}
        />
      </Head>
      
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}