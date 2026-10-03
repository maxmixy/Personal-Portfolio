import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "../../components/ui/Badge";
import Container from "../../components/layout/Container";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import SectionHeading from "../../components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Waste-To-Worth | Project Case Study",
  description:
    "How Waste-To-Worth combines image recognition, knowledge retrieval, and LLM generation to support recycling and upcycling recommendations.",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: "waste-to-worth" }];
}

const technologies = [
  "React Native",
  "Expo",
  "Python",
  "Flask",
  "Firebase Authentication",
  "Cloud Firestore",
  "Image Recognition",
  "Retrieval-Augmented Generation",
];

const architectureSteps = [
  {
    step: "01",
    title: "Capture",
    detail: "A user scans or uploads a material image in the React Native app.",
  },
  {
    step: "02",
    title: "Identify",
    detail: "The Flask service runs image recognition and identifies a material or category.",
  },
  {
    step: "03",
    title: "Retrieve",
    detail: "Relevant recycling and upcycling records are retrieved from Firestore.",
  },
  {
    step: "04",
    title: "Generate",
    detail: "Retrieved records provide context for an LLM to form a relevant recommendation.",
  },
  {
    step: "05",
    title: "Guide",
    detail: "The app presents the recommendation and supports tracking user activity.",
  },
];

export default async function ProjectCaseStudy({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;

  if (slug !== "waste-to-worth") {
    notFound();
  }

  return (
    <div className="home-page">
      <Navbar />

      <main>
        <Container className="py-12 md:py-20">
          <Link href="/projects" className="text-link">
            <span aria-hidden="true">←</span> All projects
          </Link>

          <section className="mt-12 grid gap-8 border-b border-[var(--line)] pb-12 md:mt-16 md:grid-cols-[1.2fr_0.8fr] md:items-end md:gap-16 md:pb-16" aria-labelledby="case-title">
            <div>
              <p className="eyebrow">Project case study / Applied AI</p>
              <h1 id="case-title" className="mt-5 max-w-4xl text-5xl font-medium leading-[0.98] tracking-tight md:text-7xl">
                Waste-To-Worth<span className="accent-period">.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--ink-soft)] md:text-lg">
                Environmentally Transformative Use of Image Recognition and
                Artificial Intelligence
              </p>
            </div>

            <dl className="grid grid-cols-[112px_1fr] gap-x-4 gap-y-3 border-t border-[var(--line)] pt-5 text-sm md:border-t-0 md:pt-0">
              <dt className="project-type">Role</dt>
              <dd className="m-0">Principal Researcher / Developer</dd>
              <dt className="project-type">Format</dt>
              <dd className="m-0">Academic capstone / mobile and web</dd>
              <dt className="project-type">Recognition</dt>
              <dd className="m-0">3rd Best Capstone Project Overall, Department Level</dd>
            </dl>
          </section>

          <section className="grid gap-10 py-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:py-16" aria-labelledby="overview-title">
            <SectionHeading
              id="overview-title"
              eyebrow="01 / Overview"
              title="Make responsible disposal easier to act on."
            />
            <div className="max-w-3xl">
              <p className="text-base leading-8 text-[var(--ink-soft)]">
                Waste-To-Worth is an AI-powered recycling and upcycling
                application. A person identifies a waste material by scanning
                it, then receives relevant recycling, disposal, or reuse
                guidance. The system combines image recognition with existing
                knowledge records and generated recommendations.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {technologies.map((technology) => (
                  <Badge key={technology}>{technology}</Badge>
                ))}
              </div>
            </div>
          </section>

          <section className="section-band -mx-6 px-6 py-12 md:-mx-10 md:px-10 md:py-16 lg:-mx-12 lg:px-12" aria-labelledby="problem-title">
            <Container className="!w-full !max-w-none !px-0">
              <div className="grid gap-10 md:grid-cols-2 md:gap-16">
                <div>
                  <SectionHeading
                    id="problem-title"
                    eyebrow="02 / Problem"
                    title="Recycling guidance is fragmented."
                  />
                  <p className="max-w-xl text-sm leading-7 text-[var(--ink-soft)]">
                    People may need to identify a material, find out whether it
                    can be recycled, and locate useful disposal or reuse
                    guidance across separate sources. The project explored
                    whether one scan could make that next step easier to find.
                  </p>
                </div>
                <div className="md:border-l md:border-[var(--line)] md:pl-10">
                  <SectionHeading
                    eyebrow="03 / Goal"
                    title="Ground new ideas in existing knowledge."
                  />
                  <p className="max-w-xl text-sm leading-7 text-[var(--ink-soft)]">
                    The goal was to identify materials and return useful,
                    contextually relevant recycling and upcycling guidance.
                    Rather than asking an LLM to answer without context, the
                    system retrieves related records first and uses them to
                    inform generation.
                  </p>
                </div>
              </div>
            </Container>
          </section>

          <section className="py-12 md:py-16" aria-labelledby="architecture-title">
            <SectionHeading
              id="architecture-title"
              eyebrow="04 / Architecture"
              title="From material scan to contextual recommendation."
              description="The retrieval step supplies existing project knowledge before generation, grounding the result in records related to the identified material."
            />
            <ol className="grid gap-x-6 gap-y-7 border-t border-[var(--line)] pt-6 sm:grid-cols-2 lg:grid-cols-5">
              {architectureSteps.map(({ step, title, detail }) => (
                <li key={step} className="list-none border-b border-[var(--line)] pb-5">
                  <span className="project-type">Step {step}</span>
                  <h3 className="mt-3 text-lg font-medium">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                    {detail}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section className="section-band -mx-6 px-6 py-12 md:-mx-10 md:px-10 md:py-16 lg:-mx-12 lg:px-12" aria-labelledby="pilot-title">
            <Container className="!w-full !max-w-none !px-0">
              <SectionHeading
                id="pilot-title"
                eyebrow="05 / Pilot results"
                title="What the recorded pilot showed."
                description="The project README reports a pilot with 36 users. These figures describe that evaluation, not production-scale performance."
              />
              <dl className="grid grid-cols-2 border-t border-[var(--line)] sm:grid-cols-3 lg:grid-cols-5">
                <div className="border-b border-r border-[var(--line)] py-5 pr-4 sm:py-6">
                  <dd className="m-0 text-3xl font-medium tracking-tight">36</dd>
                  <dt className="mt-2 text-xs leading-5 text-[var(--ink-soft)]">pilot users</dt>
                </div>
                <div className="border-b border-[var(--line)] py-5 pl-4 sm:border-r sm:px-5 sm:py-6">
                  <dd className="m-0 text-3xl font-medium tracking-tight">136</dd>
                  <dt className="mt-2 text-xs leading-5 text-[var(--ink-soft)]">scans recorded</dt>
                </div>
                <div className="border-b border-r border-[var(--line)] py-5 pr-4 sm:px-5 sm:py-6 lg:border-r">
                  <dd className="m-0 text-3xl font-medium tracking-tight">117 / 136</dd>
                  <dt className="mt-2 text-xs leading-5 text-[var(--ink-soft)]">successful classifications</dt>
                </div>
                <div className="border-b border-[var(--line)] py-5 pl-4 sm:border-r sm:px-5 sm:py-6">
                  <dd className="m-0 text-3xl font-medium tracking-tight">53</dd>
                  <dt className="mt-2 text-xs leading-5 text-[var(--ink-soft)]">completed projects</dt>
                </div>
                <div className="col-span-2 border-b border-[var(--line)] py-5 sm:col-span-1 sm:pl-5 sm:py-6">
                  <dd className="m-0 text-3xl font-medium tracking-tight">83 / 100</dd>
                  <dt className="mt-2 text-xs leading-5 text-[var(--ink-soft)]">materials with climate-specific disposal methods</dt>
                </div>
              </dl>
              <p className="mt-5 max-w-3xl text-xs leading-6 text-[var(--ink-soft)]">
                117 successful classifications out of 136 scans is approximately
                86%. The figure should be read as a recorded pilot result, not a
                general accuracy guarantee. The 83/100 measure counts materials
                with climate-specific disposal methods in the project dataset.
              </p>
            </Container>
          </section>

          <section className="grid gap-10 py-12 md:grid-cols-2 md:gap-16 md:py-16" aria-labelledby="decisions-title">
            <div>
              <SectionHeading
                id="decisions-title"
                eyebrow="06 / Engineering decisions"
                title="Retrieve first, then generate."
              />
              <p className="max-w-xl text-sm leading-7 text-[var(--ink-soft)]">
                Existing recycling and upcycling records are retrieved after
                material identification and supplied as context to the LLM.
                This lets generation build on related project knowledge and is
                intended to reduce duplicate recommendations.
              </p>
            </div>
            <div className="md:border-l md:border-[var(--line)] md:pl-10">
              <SectionHeading
                eyebrow="07 / Next improvements"
                title="Broaden and localize the guidance."
              />
              <ul className="space-y-3 text-sm leading-6 text-[var(--ink-soft)]">
                <li>Improve recognition accuracy and expand supported materials.</li>
                <li>Grow the knowledge base and improve retrieval relevance.</li>
                <li>Expand localized and climate-specific disposal recommendations.</li>
                <li>Continue refining personalization and gamification.</li>
              </ul>
            </div>
          </section>

          <section className="border-t border-[var(--line)] py-8 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <p className="project-type">Source and project recognition</p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                Capstone project recognized as 3rd Best Capstone Project Overall
                at the Department Level.
              </p>
            </div>
            <a
              href="https://github.com/maxmixy/mob-waste-worth"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex text-sm font-medium underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--coral)] hover:decoration-[var(--coral)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--coral)] md:mt-0"
            >
              View repository <span aria-hidden="true" className="ml-1">↗</span>
            </a>
          </section>

          <div className="border-t border-[var(--line)] pt-6">
            <Link href="/projects" className="text-link">
              <span aria-hidden="true">←</span> Back to all projects
            </Link>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}