import Link from 'next/link';
import { FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa';
import {
  products,
  productHref,
  isExternal,
  statusLabels,
  statusStyles,
} from '@/data/products';

// The products section on the home page. Everything renders from
// src/data/products.ts, so a fourth or fifth product is a data change only.
// The grid is intentionally `md:grid-cols-2 lg:grid-cols-3` rather than a fixed
// three, so a fourth card wraps instead of squashing the row.

export default function Products() {
  return (
    <section id="products" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What we&apos;re building
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            CityLyfe is a product company first. These are the things we build and
            run ourselves — the client work below pays for them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const href = productHref(product);
            const external = isExternal(product);

            return (
              <article
                key={product.id}
                id={product.id}
                className="flex flex-col border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition scroll-mt-20"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                  <span
                    className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[product.status]}`}
                  >
                    {statusLabels[product.status]}
                  </span>
                </div>

                <p className="text-blue-700 font-medium mb-3">{product.tagline}</p>

                <p className="text-gray-600 mb-4 leading-relaxed">{product.summary}</p>

                <ul className="text-sm text-gray-600 space-y-1.5 mb-5">
                  {product.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2">
                      <span aria-hidden="true" className="text-blue-500 mt-0.5">
                        &bull;
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* mt-auto keeps the footer row aligned across cards of unequal height */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-3">{product.statusNote}</p>

                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition"
                    >
                      Visit {product.name}
                      <FaExternalLinkAlt size={12} />
                    </a>
                  ) : product.internalHref ? (
                    <Link
                      href={href}
                      className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition group"
                    >
                      How it works
                      <FaArrowRight
                        size={12}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  ) : (
                    <span className="text-sm text-gray-400">
                      Not yet public
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
