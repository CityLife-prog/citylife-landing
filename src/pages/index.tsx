import Head from 'next/head';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Products from '@/components/Products';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <>
      <Head>
        <title>CityLyfe LLC - Software Products, Websites and IT</title>
        <meta name="description" content="CityLyfe LLC is a Colorado product company building PropKeep and StompingGround, with website builds, local and remote IT support, and homelab builds for a small number of clients." />
        <meta name="keywords" content="PropKeep, StompingGround, homelab build, property maintenance software, local business discovery app, Colorado web development, remote IT support" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo2.png" type="image/png" />

        {/* Open Graph.
            og:url, og:image and og:type are set site-wide in _document.tsx.
            Do not re-declare og:url here — this page previously set it to
            https://citylifellc.com, a domain CityLyfe does not control, which
            meant every link preview pointed at someone else's site. */}
        <meta property="og:title" content="CityLyfe LLC - Software Products, Websites and IT" />
        <meta property="og:description" content="A Colorado product company building PropKeep and StompingGround, with website, IT and homelab work for a small number of clients." />

        {/* Schema.org markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "CityLyfe LLC",
              "description": "Software product company building PropKeep and StompingGround, with website, IT and homelab services",
              "url": "https://citylyfe.net",
              "logo": "https://citylyfe.net/logo2.png",
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
        <Products />
        <Services />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
