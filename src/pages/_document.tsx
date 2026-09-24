import { Html, Head, Main, NextScript } from 'next/document';

// Site-wide head. og:url, og:image and og:type live here and should NOT be
// re-declared per page — index.tsx used to override og:url with
// https://citylifellc.com, a domain CityLyfe does not own, which pointed every
// link preview at an unrelated company's site.

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon. Note: /favicon.ico does not exist in public/ — favicon.svg
            and logo2.png do. */}
        <link rel="icon" href="/logo2.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo2.png" />

        {/* SEO Meta Tags */}
        <meta name="description" content="CityLyfe LLC - a veteran-owned Colorado product company. We build PropKeep and StompingGround in-house, and take on website, IT and homelab work for a small number of clients." />
        <meta name="keywords" content="PropKeep, StompingGround, homelab build, software product company, web development, remote IT support, veteran-owned business, Colorado" />
        <meta name="author" content="CityLyfe LLC" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CityLyfe LLC" />
        <meta property="og:url" content="https://citylyfe.net/" />
        <meta property="og:title" content="CityLyfe LLC - Software Products, Websites and IT" />
        <meta property="og:description" content="A veteran-owned Colorado product company. PropKeep and StompingGround are ours; website, IT and homelab work for a small number of clients." />
        {/* Was /og-image.png, which does not exist in public/ and returned 404,
            so previews rendered with no image. Denver_skyline.jpg (2048x1108)
            is the closest existing asset to the 1.91:1 ratio previews want.
            A purpose-made 1200x630 branded image would be better. */}
        <meta property="og:image" content="https://citylyfe.net/Denver_skyline.jpg" />
        <meta property="og:image:width" content="2048" />
        <meta property="og:image:height" content="1108" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://citylyfe.net/" />
        <meta property="twitter:title" content="CityLyfe LLC - Software Products, Websites and IT" />
        <meta property="twitter:description" content="A veteran-owned Colorado product company. PropKeep and StompingGround are ours; website, IT and homelab work for a small number of clients." />
        <meta property="twitter:image" content="https://citylyfe.net/Denver_skyline.jpg" />

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
