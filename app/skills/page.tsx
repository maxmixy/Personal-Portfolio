import type { Metadata } from "next";
import Link from "next/link";
import Badge from "../components/ui/Badge";
import Container from "../components/layout/Container";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import SectionHeading from "../components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Skills | Yuri Morrison",
  description:
    "A categorized overview of Yuri Morrison's software, AI, data, cloud, and engineering skills.",
};

const skillGroups = [
  {
    number: "01",
    title: "Languages",
    description: "Languages used across coursework, applications, and web systems.",
    skills: ["Python", "Java", "JavaScript", "PHP", "HTML", "CSS", "SQL"],
  },
  {
    number: "02",
    title: "Frameworks & application development",
    description: "Tools for building interfaces, services, and cross-platform applications.",
    skills: ["React", "React Native", "Angular", "Node.js", "Flask", "Next.js", "Tailwind CSS"],
  },
  {
    number: "03",
    title: "Databases",
    description: "Relational and document-oriented data systems.",
    skills: ["Firebase Firestore", "MySQL", "MariaDB", "SQL / NoSQL concepts"],
  },
  {
    number: "04",
    title: "Cloud & infrastructure",
    description: "Cloud services and deployment foundations used in project and internship work.",
    skills: ["AWS ECS", "AWS Lambda", "Amazon S3", "Amazon Cognito", "Docker", "Hostinger"],
  },
  {
    number: "05",
    title: "AI & data",
    description: "Applied intelligent systems, external services, and data workflows.",
    skills: ["AI Agents", "LLM APIs", "Retrieval-Augmented Generation", "Image Recognition", "API Integration", "Data Processing"],
  },
  {
    number: "06",
    title: "Tools & collaboration",
    description: "Development, testing, delivery, and team coordination tools.",
    skills: ["Git", "GitHub", "Postman", "Jira", "Confluence", "VS Code", "MySQL Workbench", "Agile"],
  },
];

const practices = [
  "Full-Stack Development",
  "Responsive Web Development",
  "UI/UX Implementation",
  "Software Testing",
  "Debugging",
  "Database Design",
  "System Integration",
  "Requirements Analysis",
];

export default function SkillsPage() {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="page-width py-16 md:py-24" aria-labelledby="skills-title">
          <p className="eyebrow">Skills / Engineering toolkit</p>
          <div className="mt-8 grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-14">
            <h1 id="skills-title" className="max-w-4xl text-5xl font-medium leading-[0.98] tracking-tight md:text-7xl">
              Tools for building useful systems<span className="accent-period">.</span>
            </h1>
            <p className="max-w-xl pb-1 text-sm leading-7 text-[var(--ink-soft)] md:text-base">
              A categorized view of technologies and practices used across
              academic, professional, and personal software work. This is a map
              of experience, not a proficiency ranking.
            </p>
          </div>
        </section>

        <section className="section-band py-14 md:py-20" aria-labelledby="toolkit-title">
          <Container>
            <SectionHeading
              id="toolkit-title"
              eyebrow="01 / Technical toolkit"
              title="Grouped by the work they support."
              description="The technologies are presented by role in a system rather than as a single keyword list."
            />

            <div className="border-t border-[var(--line)]">
              {skillGroups.map(({ number, title, description, skills }) => (
                <section key={number} className="grid gap-4 border-b border-[var(--line)] py-6 md:grid-cols-[60px_0.8fr_1.2fr] md:gap-6 md:py-7">
                  <span className="project-type">{number}</span>
                  <div>
                    <h2 className="text-lg font-medium tracking-tight">{title}</h2>
                    <p className="mt-2 max-w-sm text-xs leading-6 text-[var(--ink-soft)]">
                      {description}
                    </p>
                  </div>
                  <ul className="m-0 flex list-none flex-wrap content-start gap-2 p-0">
                    {skills.map((skill) => (
                      <li key={skill}><Badge>{skill}</Badge></li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </Container>
        </section>

        <section className="page-width grid gap-8 py-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-20" aria-labelledby="practices-title">
          <div>
            <p className="eyebrow">02 / Engineering practices</p>
            <h2 id="practices-title" className="mt-4 text-4xl font-medium leading-tight tracking-tight md:text-5xl">
              How I approach the work<span className="accent-period">.</span>
            </h2>
          </div>
          <div>
            <p className="max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
              Technology is one part of an outcome. I also work across analysis,
              implementation, testing, debugging, and integration to help a
              system fit its users and constraints.
            </p>
            <ul className="mt-6 grid list-none grid-cols-1 gap-x-8 p-0 sm:grid-cols-2">
              {practices.map((practice) => (
                <li key={practice} className="border-t border-[var(--line)] py-3 text-sm">
                  {practice}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="contact-section" aria-labelledby="skills-next-title">
          <Container className="contact-inner">
            <p className="eyebrow">See the toolkit in context</p>
            <h2 id="skills-next-title">
              Skills matter most<br />in the systems they shape
              <span className="accent-period">.</span>
            </h2>
            <p>Explore selected projects and the engineering decisions behind them.</p>
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