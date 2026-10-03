import type { Metadata } from "next";
import Link from "next/link";
import Badge from "../components/ui/Badge";
import Container from "../components/layout/Container";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import SectionHeading from "../components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Experience | Yuri Morrison",
  description:
    "Software engineering, organizational leadership, and editorial experience that shape how Yuri Morrison builds and communicates software.",
};

const leadershipRoles = [
  { years: "2025-2026", role: "Internal Vice President" },
  { years: "2024-2025", role: "President" },
  { years: "2023-2024", role: "Internal Vice President" },
  { years: "2022-2023", role: "Associate External Vice President" },
];

const internshipTechnologies = [
  "JavaScript",
  "Angular",
  "AWS ECS",
  "AWS Lambda",
  "Amazon S3",
  "Amazon Cognito",
  "Git",
  "Postman",
  "Jira",
  "Confluence",
];

export default function ExperiencePage() {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="page-width py-16 md:py-24" aria-labelledby="experience-title">
          <p className="eyebrow">Experience / Selected contributions</p>
          <div className="mt-8 grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-14">
            <h1 id="experience-title" className="max-w-4xl text-5xl font-medium leading-[0.98] tracking-tight md:text-7xl">
              Building systems and helping teams move<span className="accent-period">.</span>
            </h1>
            <p className="max-w-xl pb-1 text-sm leading-7 text-[var(--ink-soft)] md:text-base">
              Software engineering is the center of my work. Professional,
              leadership, and editorial roles have each strengthened how I
              understand problems, coordinate people, and carry work through.
            </p>
          </div>
        </section>

        <section className="section-band py-14 md:py-20" aria-labelledby="professional-title">
          <Container>
            <SectionHeading
              id="professional-title"
              eyebrow="01 / Professional"
              title="Software Engineering Intern"
              description="Electronic Science Corporation"
            />

            <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
              <div className="border-t border-[var(--line)] pt-5">
                <p className="project-type">Engineering outcome</p>
                <p className="mt-4 text-5xl font-medium tracking-tight">~80<span className="text-2xl">%</span></p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--ink-soft)]">
                  less runtime for a bulk-data workflow, reduced to about 20% of
                  its original duration.
                </p>
                <p className="mt-5 border-l-2 border-[var(--coral)] pl-4 text-xs leading-6 text-[var(--ink-soft)]">
                  Best Intern recognition; invited to apply for a software
                  engineering opening.
                </p>
              </div>

              <div>
                <p className="max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
                  Worked across application features, UI/UX, data processing,
                  debugging, API integration, and cloud services. The bulk-data
                  improvement came from an asynchronous processing workflow;
                  implementation details are kept general to protect company
                  confidentiality.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {internshipTechnologies.map((technology) => (
                    <Badge key={technology}>{technology}</Badge>
                  ))}
                </div>
                <Link href="/projects" className="mt-7 inline-flex text-sm font-medium underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--coral)] hover:decoration-[var(--coral)]">
                  View software projects <span aria-hidden="true" className="ml-1">↗</span>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section className="page-width grid gap-10 py-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-20" aria-labelledby="leadership-title">
          <div>
            <SectionHeading
              id="leadership-title"
              eyebrow="02 / Leadership"
              title="Bedan Information Technology Society"
              description="Progressively broader roles supporting a student technology organization."
            />
            <p className="max-w-lg text-sm leading-7 text-[var(--ink-soft)]">
              The organization included approximately 150 members and more than
              20 officers and staff. My responsibilities included coordinating
              people, planning events, building external relationships, and
              helping teams follow through.
            </p>
          </div>

          <ol className="border-t border-[var(--line)]">
            {leadershipRoles.map(({ years, role }, index) => (
              <li key={years} className="grid grid-cols-[94px_1fr] gap-5 border-b border-[var(--line)] py-5 sm:grid-cols-[120px_1fr]">
                <span className="project-type">{years}</span>
                <div>
                  <p className="text-sm font-semibold">{role}</p>
                  <p className="mt-2 text-xs leading-6 text-[var(--ink-soft)]">
                    {index === 0 && "Supported internal operations and continuity across the officer team."}
                    {index === 1 && "Led the organization and coordinated its officers, projects, and events."}
                    {index === 2 && "Helped manage internal operations and cross-functional execution."}
                    {index === 3 && "Supported external relations and engagement with partners."}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="section-band py-14 md:py-20" aria-labelledby="nosedive-title">
          <Container>
            <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
              <div>
                <p className="eyebrow">Initiative / NOSEDIVE</p>
                <h2 id="nosedive-title" className="mt-4 text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                  Industry practice, closer to students<span className="accent-period">.</span>
                </h2>
              </div>
              <div className="max-w-2xl">
                <p className="text-sm leading-7 text-[var(--ink-soft)]">
                  NOSEDIVE is a recurring seminar series connecting IT students
                  with industry professionals. The work involved shaping the
                  initiative, coordinating speakers and teams, and supporting
                  delivery across officer transitions.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge>Event planning</Badge>
                  <Badge>Industry engagement</Badge>
                  <Badge>Team coordination</Badge>
                  <Badge>Continuity</Badge>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="page-width grid gap-8 py-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-20" aria-labelledby="editorial-title">
          <div>
            <p className="eyebrow">03 / Editorial & communication</p>
            <h2 id="editorial-title" className="mt-4 text-4xl font-medium leading-tight tracking-tight md:text-5xl">
              The Bedan Herald<span className="accent-period">.</span>
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-sm leading-7 text-[var(--ink-soft)]">
              Research, circulation, editorial writing, and web management
              brought another perspective to technical work: how information is
              organized, published, and maintained for the people who need it.
            </p>
            <p className="mt-4 text-xs leading-6 text-[var(--ink-soft)]">
              Experience includes research and circulation work, Circulations
              Manager, Web Manager, and senior editorial writing.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>WordPress</Badge>
              <Badge>Web publishing</Badge>
              <Badge>Research</Badge>
              <Badge>Technical communication</Badge>
            </div>
          </div>
        </section>

        <section className="contact-section" aria-labelledby="next-title">
          <Container className="contact-inner">
            <p className="eyebrow">Continue exploring</p>
            <h2 id="next-title">
              Work shaped by people<br />and technical choices
              <span className="accent-period">.</span>
            </h2>
            <p>See the systems I have built and the decisions behind them.</p>
            <Link className="contact-link" href="/projects">
              Explore projects <span aria-hidden="true">↗</span>
            </Link>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}