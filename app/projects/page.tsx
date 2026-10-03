import type { Metadata } from "next";
import Link from "next/link";
import Container from "../components/layout/Container";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import ProjectCard from "../components/projects/ProjectCard";
import SectionHeading from "../components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Projects | Yuri Morrison",
  description:
    "Selected software projects by Yuri Morrison, including applied AI and web-based systems.",
};

export default function ProjectsPage() {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="page-width py-16 md:py-24" aria-labelledby="projects-title">
          <p className="eyebrow">Engineering / Selected work</p>
          <div className="mt-8 grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-14">
            <h1
              id="projects-title"
              className="max-w-4xl text-5xl font-medium leading-[0.98] tracking-tight md:text-7xl"
            >
              Ideas made useful through engineering
              <span className="accent-period">.</span>
            </h1>
            <p className="max-w-xl pb-1 text-sm leading-7 text-[var(--ink-soft)] md:text-base">
              A selection of applied AI and software engineering work. Each
              project starts with a problem, then follows the decisions and
              trade-offs that shaped the result.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-y border-[var(--line)] py-4 text-xs text-[var(--ink-soft)]">
            <span><span className="project-type">01</span> Applied AI</span>
            <span><span className="project-type">02</span> Mobile systems</span>
            <span><span className="project-type">03</span> Cloud workflows</span>
          </div>
        </section>

        <section className="section-band py-16 md:py-24" aria-labelledby="selected-work-title">
          <Container>
            <SectionHeading
              id="selected-work-title"
              eyebrow="Selected work / 04 entries"
              title="Built around real constraints."
              description="Applied AI, interactive web systems, learning tools, and administration software."
            />

            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              <ProjectCard
                title="Waste-To-Worth"
                description="An AI-powered recycling and upcycling app that combines image-based material recognition with retrieval and personalized recommendations. In the recorded pilot, 117 of 136 scans were successfully classified, alongside 53 completed reuse projects."
                technologies={[
                  "React Native",
                  "Expo",
                  "Flask",
                  "Firebase",
                  "Image Recognition",
                  "Retrieval + AI",
                ]}
                href="/projects/waste-to-worth"
                repositoryUrl="https://github.com/maxmixy/mob-waste-worth"
                featured
              />

              <ProjectCard
                title="Real-Time Basketball Management System"
                description="A web-based basketball system with player registration, team and player statistics, and game and bracket views."
                technologies={["HTML", "PHP", "SQL"]}
                repositoryUrl="https://github.com/maxmixy/BasketBallPage"
              />

              <ProjectCard
                title="ABC Learning Center"
                description="A learning-center application with member and book pages, plus a book return workflow."
                technologies={["Python", "HTML", "SQL"]}
                repositoryUrl="https://github.com/maxmixy/ABCLearningCenter"
              />

              <ProjectCard
                title="Herald Admin System"
                description="A PHP administration system for assigning and tracking tasks, with account, announcement, and template management."
                technologies={["PHP", "JavaScript", "CSS"]}
                repositoryUrl="https://github.com/maxmixy/Herald-Admin-System"
              />
            </div>

            <p className="mt-7 max-w-2xl text-xs leading-6 text-[var(--ink-soft)]">
              Pilot figures describe the recorded project evaluation; they are
              not a claim of production-scale performance.
            </p>
          </Container>
        </section>

        <section className="page-width grid gap-6 py-16 md:grid-cols-[1fr_auto] md:items-center md:py-20">
          <div>
            <p className="eyebrow">Beyond implementation</p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
              The way I work matters, too.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
              Project outcomes depend on clear decisions, useful communication,
              and teams that can carry the work forward.
            </p>
          </div>
          <Link href="/about" className="text-link">
            Read about my approach <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}