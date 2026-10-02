import Badge from "./ui/Badge";
import Button from "./ui/Button";
import SectionHeading from "./ui/SectionHeading";
import ProjectCard from "./projects/ProjectCard";
import Container from "./layout/Container";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

export default function ComponentSheet() {
  return (
    <>
      <Navbar />

      <main>
        <Container>
          <header className="py-20 md:py-28">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--coral)]">
              Development Sandbox
            </p>

            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
              Component Sheet
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">
              A visual laboratory for testing and refining the portfolio
              component system.
            </p>
          </header>

          <div className="space-y-24 pb-24">
            {/* Buttons */}
            <section>
              <SectionHeading
                eyebrow="UI"
                title="Buttons"
                description="Interactive actions and navigation."
              />

              <div className="flex flex-wrap gap-4">
                <Button>Primary Button</Button>
                <Button href="/#work">View Selected Work</Button>
              </div>
            </section>

            {/* Badges */}
            <section>
              <SectionHeading
                eyebrow="UI"
                title="Badges"
                description="Used for technologies, categories, and metadata."
              />

              <div className="flex flex-wrap gap-2">
                <Badge>React</Badge>
                <Badge>Next.js</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Python</Badge>
                <Badge>AI</Badge>
              </div>
            </section>

            {/* Section Heading */}
            <section>
              <SectionHeading
                eyebrow="Component"
                title="Section Heading"
                description="A reusable heading structure for major sections."
              />
            </section>

            {/* Project Cards */}
            <section>
              <SectionHeading
                eyebrow="Projects"
                title="Project Cards"
                description="The primary component for presenting portfolio projects."
              />

              <div className="grid gap-6 lg:grid-cols-2">
                <ProjectCard
                  title="Waste-To-Worth"
                  description="An AI-powered recycling and upcycling platform using image recognition, retrieval, and personalized recommendations."
                  technologies={[
                    "React Native",
                    "Flask",
                    "Firebase",
                    "AI / RAG",
                  ]}
                  featured
                />

                <ProjectCard
                  title="Software Engineering Internship"
                  description="Professional software engineering work involving application development, cloud services, data processing, and UI/UX."
                  technologies={[
                    "AWS",
                    "JavaScript",
                    "Cloud",
                    "Data Processing",
                  ]}
                />
              </div>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}