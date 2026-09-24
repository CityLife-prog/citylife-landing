import Head from 'next/head';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

// Plain-language explainer for the homelab line.
//
// Audience: someone with no technical background who asked a polite question
// and deserves a real answer. Every specific claim comes from the homelab repo
// (citylyfe-dev/homelab: README.md and ARCHITECTURE.md). No pricing, no package
// tiers — the close is deliberately soft.

export default function HomelabPage() {
  return (
    <>
      <Head>
        <title>What a homelab actually is | CityLyfe LLC</title>
        <meta
          name="description"
          content="A plain-language explanation of what a homelab is, what it replaces, and why you might want one. No jargon, no sales pitch."
        />
        <meta property="og:title" content="What a homelab actually is | CityLyfe LLC" />
        <meta
          property="og:description"
          content="A plain-language explanation of what a homelab is, what it replaces, and why you might want one."
        />
        <meta property="og:url" content="https://citylyfe.net/homelab" />
      </Head>

      <main>
        {/* Opening */}
        <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-wide text-blue-300 mb-4">
              Homelab
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              What a homelab actually is
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              People keep asking what the thing in my house does, and &ldquo;it&apos;s
              a homelab&rdquo; is a useless answer. So here is the real one, without
              the jargon.
            </p>
          </div>
        </section>

        {/* The plain answer */}
        <section className="py-14 px-4">
          <div className="max-w-3xl mx-auto prose-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              The short version
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-5">
              It&apos;s a small, quiet computer that stays on all the time in your
              house. It holds your files — photos, documents, video — and it runs a
              handful of useful things that you would otherwise pay a monthly
              subscription for, or trust to a company that might change the terms
              next year.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-5">
              That&apos;s genuinely it. It is not a server rack. It does not hum. It
              is roughly the size of a hardback book, and it costs a few dollars of
              electricity a month to run.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-5">
              What it replaces
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Most households are already renting these things without thinking
              about it:
            </p>
            <ul className="space-y-3 text-lg text-gray-700 mb-5">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">&bull;</span>
                <span>
                  <strong>Cloud photo and file storage.</strong> The same photos,
                  on a drive you own, with no per-gigabyte bill and no risk of an
                  account lockout taking the lot with it.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">&bull;</span>
                <span>
                  <strong>A streaming library.</strong> Your own movies and shows,
                  playing to any TV in the house, without checking whether
                  something got removed from a service this month.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">&bull;</span>
                <span>
                  <strong>Backups that actually happen.</strong> Every computer in
                  the house backing itself up automatically, to something in the
                  house, on a schedule nobody has to remember.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">&bull;</span>
                <span>
                  <strong>Ad and tracker blocking for the whole house.</strong> Not
                  a browser extension on one laptop — every device on the
                  network, including the ones you can&apos;t install anything on.
                </span>
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-5">
              Why three machines and not one
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              This is the part that sounds excessive until you&apos;ve had the
              alternative. The jobs get separated so that one of them going down
              doesn&apos;t take the others with it.
            </p>
          </div>

          {/* Simple three-tier diagram. Deliberately not a rack layout - the
              point is which job lives where, not what it physically looks like. */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 my-8">
            <div className="border-2 border-green-200 bg-green-50 rounded-xl p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-2">
                Always on
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">The main box</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Holds the files and runs the services. Small, low-power, sat in a
                cupboard. This is the one doing the actual work.
              </p>
            </div>
            <div className="border-2 border-green-200 bg-green-50 rounded-xl p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-2">
                Always on
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                A tiny box for names
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                A Raspberry Pi that does one job: turning website names into
                addresses, and refusing the ad and tracker ones. It&apos;s separate
                so that restarting the main box doesn&apos;t knock the whole
                house&apos;s internet out mid-movie.
              </p>
            </div>
            <div className="border-2 border-slate-200 bg-slate-50 rounded-xl p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
                Only when needed
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                The powerful one
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                A desktop with a serious graphics card, for heavy work. It sleeps
                until something wakes it, because leaving it running would cost
                more in electricity than it saves.
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-5">
              The whole lot sits behind a battery, so a power cut is a non-event
              rather than a corrupted drive.
            </p>
          </div>
        </section>

        {/* The LEGO build */}
        <section className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              The case is made of LEGO
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-5">
              This is usually the point where the conversation stops being polite
              and becomes genuinely interested, so: yes, really. The enclosure
              holding the main box and the Raspberry Pi is built from LEGO, sat
              inside an ordinary computer case alongside the network switch, the
              drives, and the power monitoring.
            </p>

            {/* PLACEHOLDER — swap for a real photo of the enclosure.
                Drop the image at public/homelab-lego.jpg and replace this whole
                <div> with:
                  <img
                    src="/homelab-lego.jpg"
                    alt="The LEGO enclosure holding the main box and the Raspberry Pi"
                    className="w-full rounded-xl border border-gray-200 mb-6"
                  />
                Landscape works best here. A photo with the side panel off, so
                the standoffs and the airflow path are visible, does more work
                than the three paragraphs below it. */}
            <div className="w-full aspect-[16/10] rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 flex flex-col items-center justify-center text-center px-6 mb-6">
              <p className="text-gray-500 font-medium">Photo of the build goes here</p>
              <p className="text-gray-400 text-sm mt-1">
                public/homelab-lego.jpg
              </p>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-5">
              It started as something to do and turned into a genuinely useful
              constraint. Plastic is a terrible conductor of heat — about a
              thousand times worse than the aluminum a normal case is made of.
              A metal case helps cool the machine inside it. A LEGO one contributes
              nothing at all.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-5">
              Which means <em>all</em> of the cooling has to come from moving air
              through it, and the build has to earn that: the machine stands off
              the base so air can get underneath, vents go in the bottom on the
              opposite side from the exhaust, and a fan up top pulls hot air out
              in the direction the machine is already pushing it.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Get that wrong and you have a very expensive brick oven. Get it
              right and it runs cooler than the metal case it replaced, because
              you were forced to think about airflow instead of assuming the box
              would handle it.
            </p>
          </div>
        </section>

        {/* Honest limits */}
        <section className="py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              What it isn&apos;t
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-5">
              A homelab in your house is not, on its own, a backup. If the house
              floods, everything in it is gone together. Anything genuinely
              irreplaceable still needs a copy somewhere else — which costs
              well under a dollar a month, and is the part people skip.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              It also isn&apos;t free. It&apos;s a real machine with real drives,
              and drives fail. The honest pitch is that you trade a monthly
              subscription for owning the thing outright, and take on the job of
              looking after it — or have someone else look after it for you.
            </p>
          </div>
        </section>

        {/* Soft close. Deliberately not a pricing table. */}
        <section className="py-14 px-4 bg-slate-900 text-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Currently building these
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              I&apos;m building this one first, in my own house, and writing down
              every step as I go — partly so the build guide is tested before
              anyone else has to follow it, and partly because I kept wanting a
              document like this and couldn&apos;t find one.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              If you&apos;ve read this far and thought &ldquo;I&apos;d like one of
              those&rdquo;, I&apos;m happy to talk about what it would take. No
              pitch — I&apos;d mostly want to know what you&apos;re actually
              trying to solve first.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 text-blue-300 font-semibold hover:text-blue-200 transition group"
            >
              Get in touch
              <FaArrowRight
                size={13}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
