import Head from 'next/head';
import ServicesFull from '@/components/ServicesFull';

// The full service catalog, moved off the landing page to keep that compact.
// The landing page shows four and links here.

export default function ServicesPage() {
  return (
    <>
      <Head>
        <title>Services | CityLyfe LLC</title>
        <meta
          name="description"
          content="Everything CityLyfe offers: website builds and audits, SEO, smart home integration, business automation, mobile development, ongoing support, hosting."
        />
        <meta property="og:title" content="Services | CityLyfe LLC" />
        <meta
          property="og:description"
          content="One-time projects and ongoing support, remote or on site."
        />
        <meta property="og:url" content="https://citylyfe.net/services" />
      </Head>

      <ServicesFull />
    </>
  );
}
