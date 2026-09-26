import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import {
  showcaseItems,
  kindLabels,
  statusLabels,
  statusStyles,
  isExternal,
  type ShowcaseItem,
} from '@/data/showcase';

// Detail page for anything in the showcase.
//
// This exists because the Products section was removed from the landing page to
// keep it compact — the highlight lists needed somewhere to live rather than
// being deleted. Every carousel card links here, so a seventh offering added to
// showcase.ts gets a page for free with no new file.
//
// Homelab is the exception: it has its own hand-written page at /homelab, and
// detailHref() sends it there instead.

interface Props {
  item: ShowcaseItem;
}

export default function ProductDetail({ item }: Props) {
  const external = isExternal(item);

  return (
    <>
      <Head>
        <title>{`${item.name} | CityLyfe LLC`}</title>
        <meta name="description" content={item.summary.slice(0, 160)} />
        <meta property="og:title" content={`${item.name} | CityLyfe LLC`} />
        <meta property="og:description" content={item.summary.slice(0, 200)} />
        <meta property="og:url" content={`https://citylyfe.net/products/${item.id}`} />
      </Head>

      <main className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/#showcase"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition mb-8"
          >
            <FaArrowLeft size={12} />
            Everything we build
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {kindLabels[item.kind]}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[item.status]}`}
            >
              {statusLabels[item.status]}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {item.name}
          </h1>
          <p className="text-xl text-blue-700 font-medium mb-6">{item.tagline}</p>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">{item.summary}</p>

          {item.highlights && item.highlights.length > 0 && (
            <ul className="space-y-3 mb-10">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-gray-700">
                  <span aria-hidden="true" className="text-blue-500 mt-1">
                    &bull;
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-gray-200 pt-6 flex flex-wrap items-center gap-4">
            <p className="text-gray-500">{item.statusNote}</p>

            {item.href && external && (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Visit {item.name}
                <FaExternalLinkAlt size={12} />
              </a>
            )}

            {item.kind === 'service' && (
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Talk to us
              </Link>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  // Items with their own page (homelab) are excluded — they are never routed here.
  paths: showcaseItems
    .filter((item) => !item.internalHref)
    .map((item) => ({ params: { id: item.id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const item = showcaseItems.find((candidate) => candidate.id === params?.id);
  if (!item) return { notFound: true };
  return { props: { item } };
};
