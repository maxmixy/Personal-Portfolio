import type { Metadata } from "next";
import Link from "next/link";
import Container from "../components/layout/Container";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import SectionHeading from "../components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "About Yuri Morrison | Software & AI Engineer",
  description:
    "Meet Yuri Morrison: a Software / AI Engineer who builds practical systems and brings technical work, collaboration, and communication together.",
};

const leadershipRoles = [
  { years: "2022-2023", role: "Associate External Vice President" },
  { years: "2023-2024", role: "Internal Vice President" },
  { years: "2024-2025", role: "President" },
  { years: "2025-2026", role: "Internal Vice President" },
];

export default function AboutPage() {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="page-width py-16 md:py-24" aria-labelledby="about-title">
          <p className="eyebrow">Profile / About</p>
          <div className="mt-8 grid gap-9 md:grid-cols-[1.15fr_0.85fr] md:gap-14">
            <h1
              id="about-title"
              className="max-w-4xl text-5xl font-medium leading-[0.98] tracking-tight md:text-7xl"
            >
              I build software with the whole picture in mind
              <span className="accent-period">.</span>
            </h1>
            <div className="max-w-xl md:pt-5">
              <p className="text-base leading-8 text-[var(--ink-soft)] md:text-lg">
                I&apos;m Yuri Morrison, a Software / AI Engineer interested in
                building practical systems and making complex work useful to
                people.
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
                I like working across the shape of a problem: understanding
                what people need, how the system fits together, and what it
                takes to move an idea into a working product.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-6">
                <Link href="/#work" className="button button-dark">
                  Explore selected work <span aria-hidden="true">↓</span>
                </Link>
                <Link href="/contact" className="text-link">
                  Get in touch <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-16 grid border-y border-[var(--line)] md:grid-cols-3">
            <div className="py-5 md:border-r md:border-[var(--line)] md:pr-6">
              <p className="project-type">01 / Build</p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                Software, data, and applied AI shaped around a real problem.
              </p>
            </div>
            <div className="border-t border-[var(--line)] py-5 md:border-r md:border-t-0 md:px-6">
              <p className="project-type">02 / Connect</p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                Clear collaboration between people, disciplines, and systems.
              </p>
            </div>
            <div className="border-t border-[var(--line)] py-5 md:border-t-0 md:pl-6">
              <p className="project-type">03 / Communicate</p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                Thoughtful writing and technical context that help work move.
              </p>
            </div>
          </div>
        </section>

        <section className="section-band py-16 md:py-24" aria-labelledby="practice-title">
          <Container>
            <SectionHeading
              id="practice-title"
              eyebrow="Practice"
              title="Engineering is the center. The rest helps it travel."
              description="I bring technical execution together with product thinking, coordination, and communication."
            />

            <div className="grid gap-9 border-t border-[#bfc3b5] pt-7 md:grid-cols-3 md:gap-8">
              <article>
                <p className="project-type">01 / Engineering</p>
                <h2 className="mt-3 text-xl font-medium tracking-tight">
                  Systems people can use
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                  Waste-To-Worth brings image-based material recognition
                  together with retrieval and personalized recycling or
                  upcycling recommendations. In my software engineering
                  internship, I worked across application features, cloud
                  services, data processing, and debugging.
                </p>
              </article>

              <article className="md:border-l md:border-[#bfc3b5] md:pl-7">
                <p className="project-type">02 / Leadership</p>
                <h2 className="mt-3 text-xl font-medium tracking-tight">
                  Helping teams move
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                  At the Bedan Information Technology Society, I took on
                  progressively broader responsibilities in external
                  relations, internal operations, and organizational
                  leadership. That work strengthened how I plan, delegate,
                  coordinate stakeholders, and follow through.
                </p>
              </article>

              <article className="md:border-l md:border-[#bfc3b5] md:pl-7">
                <p className="project-type">03 / Communication</p>
                <h2 className="mt-3 text-xl font-medium tracking-tight">
                  Making the work clear
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                  My work with The Bedan Herald included research, editorial
                  writing, circulation, and web management. It taught me to
                  consider how information is structured, understood, and
                  maintained, not only how it is produced.
                </p>
              </article>
            </div>
          </Container>
        </section>

        <section className="page-width grid gap-12 py-16 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:py-24" aria-labelledby="leadership-title">
          <div>
            <p className="eyebrow">A chapter in practice</p>
            <h2 id="leadership-title" className="mt-4 text-4xl font-medium leading-tight tracking-tight md:text-5xl">
              Leadership through doing<span className="accent-period">.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--ink-soft)]">
              My roles at the Bedan Information Technology Society taught me to
              balance initiative with reliable execution and to leave teams
              with work they can continue.
            </p>

            <div className="mt-9 border-t border-[var(--line)]">
              {leadershipRoles.map(({ years, role }) => (
                <div
                  key={years}
                  className="grid grid-cols-[92px_1fr] gap-4 border-b border-[var(--line)] py-4"
                >
                  <span className="project-type">{years}</span>
                  <span className="text-sm font-medium">{role}</span>
                </div>
              ))}
            </div>
          </div>

          <article className="self-end border-l-2 border-[var(--coral)] pl-6 md:mb-1 md:pl-8">
            <p className="project-type">Initiative / NOSEDIVE</p>
            <h3 className="mt-3 text-2xl font-medium tracking-tight">
              Bringing industry practice closer to students.
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--ink-soft)]">
              NOSEDIVE is a recurring seminar series connecting IT students
              with industry professionals. I helped coordinate people and
              speakers around practical conversations, turning an idea into a
              program that could continue across teams.
            </p>
          </article>
        </section>

        <section className="contact-section" aria-labelledby="direction-title">
          <Container className="contact-inner">
            <p className="eyebrow">Looking ahead</p>
            <h2 id="direction-title">
              Building toward software<br />{" "}and AI engineering
              <span className="accent-period">.</span>
            </h2>
            <p>
              Project coordination and communication are part of how I work;
              my direction is to keep building software and intelligent
              systems.
            </p>
            <Link className="contact-link" href="/#work">
              See what I&apos;ve built <span aria-hidden="true">↗</span>
            </Link>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}