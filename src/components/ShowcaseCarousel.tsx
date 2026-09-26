import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import {
  showcaseItems,
  detailHref,
  kindLabels,
  statusLabels,
  statusStyles,
} from '@/data/showcase';

// Everything CityLyfe provides or plans to provide, near the top of the page.
//
// Built on native scroll-snap rather than a transform track: touch, trackpad
// and keyboard scrolling all work for free, and it degrades to a plain
// horizontal scroller if JS is slow to hydrate.
//
// Every card shows its status. That is the point of the component — some of
// these are shipped, some are in development, one is explicitly a prototype,
// and the card has to carry that difference rather than making them all look
// equally finished.

const AUTOPLAY_MS = 6000;

export default function ShowcaseCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Any deliberate interaction stops autoplay for good — nothing is more
  // irritating than a carousel that moves while you are reading it.
  const [userEngaged, setUserEngaged] = useState(false);

  const scrollToIndex = useCallback((next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[next] as HTMLElement | undefined;
    if (card) track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
  }, []);

  // Derive the active index from scroll position, so dragging and arrow keys
  // keep the dots in sync without a second source of truth.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const children = Array.from(track.children) as HTMLElement[];
        const nearest = children.reduce(
          (best, child, i) => {
            const distance = Math.abs(child.offsetLeft - track.scrollLeft);
            return distance < best.distance ? { i, distance } : best;
          },
          { i: 0, distance: Infinity }
        );
        setIndex(nearest.i);
      });
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (paused || userEngaged) return;
    if (typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => {
        const next = (current + 1) % showcaseItems.length;
        scrollToIndex(next);
        return next;
      });
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, userEngaged, scrollToIndex]);

  const step = (direction: -1 | 1) => {
    setUserEngaged(true);
    const next = Math.min(
      Math.max(index + direction, 0),
      showcaseItems.length - 1
    );
    scrollToIndex(next);
  };

  return (
    <section
      id="showcase"
      className="py-14 px-4 bg-white border-b border-gray-100"
      aria-roledescription="carousel"
      aria-label="What CityLyfe builds and provides"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              What we build and provide
            </h2>
            <p className="text-gray-600 text-lg">
              Our own apps, client websites, the services we offer, and what
              we&apos;re prototyping next.
            </p>
          </div>

          <div className="hidden md:flex gap-2 shrink-0">
            <button
              onClick={() => step(-1)}
              disabled={index === 0}
              aria-label="Previous"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              onClick={() => step(1)}
              disabled={index >= showcaseItems.length - 1}
              aria-label="Next"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="showcase-track flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-1 px-1"
          tabIndex={0}
          onPointerDown={() => setUserEngaged(true)}
          onKeyDown={() => setUserEngaged(true)}
        >
          {showcaseItems.map((item, i) => {
            const href = detailHref(item);

            return (
              <article
                key={item.id}
                id={item.id}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${showcaseItems.length}: ${item.name}`}
                className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[46%] lg:w-[31.5%] flex flex-col border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition scroll-mt-20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {kindLabels[item.kind]}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[item.status]}`}
                  >
                    {statusLabels[item.status]}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-blue-700 font-medium mb-3">{item.tagline}</p>
                <p className="text-gray-600 leading-relaxed mb-4">{item.summary}</p>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-3">{item.statusNote}</p>

                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition group"
                  >
                    {item.kind === 'service' ? 'What this covers' : 'Learn more'}
                    <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Dots double as the mobile control, where the arrows are hidden. */}
        <div className="flex justify-center gap-2 mt-2">
          {showcaseItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => {
                setUserEngaged(true);
                scrollToIndex(i);
              }}
              aria-label={`Go to ${item.name}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .showcase-track {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .showcase-track::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
