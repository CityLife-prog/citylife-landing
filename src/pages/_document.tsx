import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* SEO Meta Tags */}
        <meta name="description" content="CityLyfe LLC - Empowering Your Business With Code. Veteran-owned software development company specializing in web development, mobile apps, smart home automation, and digital solutions." />
        <meta name="keywords" content="web development, mobile apps, smart home automation, SEO, veteran-owned business, software development, custom solutions" />
        <meta name="author" content="CityLyfe LLC" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://citylyfe.net/" />
        <meta property="og:title" content="CityLyfe LLC - Empowering Your Business With Code" />
        <meta property="og:description" content="Veteran-owned software development company. From $800 websites to enterprise solutions. Military-grade security, transparent pricing." />
        <meta property="og:image" content="https://citylyfe.net/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://citylyfe.net/" />
        <meta property="twitter:title" content="CityLyfe LLC - Empowering Your Business With Code" />
        <meta property="twitter:description" content="Veteran-owned software development company. From $800 websites to enterprise solutions." />
        <meta property="twitter:image" content="https://citylyfe.net/og-image.png" />

        {/* Theme Color */}
        <meta name="theme-color" content="#2563eb" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
