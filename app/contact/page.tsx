import type { Metadata } from "next";
import Link from "next/link";
import Container from "../components/layout/Container";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

export const metadata: Metadata = {
  title: "Contact Yuri Morrison | Software & AI Engineer",
  description:
    "Contact Yuri Morrison about software engineering, applied AI, and building useful systems.",
};

export default function ContactPage() {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="page-width grid gap-8 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-16 md:py-24" aria-labelledby="contact-title">
          <div>
            <p className="eyebrow">Contact / Start a conversation</p>
            <h1 id="contact-title" className="mt-7 max-w-4xl text-5xl font-medium leading-[0.98] tracking-tight md:text-7xl">
              Let&apos;s talk about useful software
              <span className="accent-period">.</span>
            </h1>
          </div>
          <p className="max-w-xl pb-1 text-sm leading-7 text-[var(--ink-soft)] md:text-base">
            I&apos;m interested in software engineering, applied AI, and the
            systems that help turn ideas into working products. Choose whichever
            contact channel works best for you.
          </p>
        </section>

        <section className="section-band py-14 md:py-20" aria-labelledby="contact-options-title">
          <Container>
            <div className="mb-9 max-w-2xl">
              <p className="eyebrow">Contact channels</p>
              <h2 id="contact-options-title" className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
                Choose how to reach me<span className="accent-period">.</span>
              </h2>
            </div>

            <div className="grid gap-x-10 md:grid-cols-2 md:gap-x-16">
              <article className="border-t border-[var(--line)] py-6">
                <p className="project-type">01 / Professional network</p>
                <h3 className="mt-3 text-xl font-medium">LinkedIn</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                  Connect with me about professional opportunities and collaboration.
                </p>
                <a
                  className="mt-4 inline-flex text-sm font-medium underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--coral)] hover:decoration-[var(--coral)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--coral)]"
                  href="https://www.linkedin.com/in/yuri-andrei-morrison/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Yuri Morrison's LinkedIn profile (opens in a new tab)"
                >
                  linkedin.com/in/yuri-andrei-morrison <span aria-hidden="true" className="ml-1">↗</span>
                </a>
              </article>

              <article className="border-t border-[var(--line)] py-6">
                <p className="project-type">02 / Email</p>
                <h3 className="mt-3 text-xl font-medium">Email</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                  For project inquiries, opportunities, or a thoughtful hello.
                </p>
                <a
                  className="mt-4 inline-flex text-sm font-medium underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--coral)] hover:decoration-[var(--coral)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--coral)]"
                  href="mailto:Morrisonyuriandrei2@gmail.com"
                >
                  Morrisonyuriandrei2@gmail.com <span aria-hidden="true" className="ml-1">↗</span>
                </a>
              </article>

              <article className="border-t border-[var(--line)] py-6">
                <p className="project-type">03 / Message</p>
                <h3 className="mt-3 text-xl font-medium">Text message</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                  Please send a message rather than calling. I usually assume cold calls are fraud, who doesn&apos;t in this day and age right? HAHAHAHAH
                </p>
                <a
                  className="mt-4 inline-flex text-sm font-medium underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--coral)] hover:decoration-[var(--coral)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--coral)]"
                  href="sms:+639190045161"
                  aria-label="Send Yuri Morrison a text message at plus 63 919 004 5161"
                >
                  +63 919 004 5161 <span aria-hidden="true" className="ml-1">↗</span>
                </a>
              </article>

              <article className="border-t border-[var(--line)] py-6">
                <p className="project-type">04 / Code</p>
                <h3 className="mt-3 text-xl font-medium">GitHub</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                  Browse the public repositories behind selected projects.
                </p>
                <a
                  className="mt-4 inline-flex text-sm font-medium underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--coral)] hover:decoration-[var(--coral)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--coral)]"
                  href="https://github.com/maxmixy"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Yuri Morrison's GitHub profile (opens in a new tab)"
                >
                  github.com/maxmixy <span aria-hidden="true" className="ml-1">↗</span>
                </a>
              </article>
            </div>
          </Container>
        </section>

        <section className="page-width grid gap-8 py-14 md:grid-cols-2 md:gap-16 md:py-20">
          <div>
            <p className="eyebrow">Before we talk</p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
              See what I&apos;ve been building.
            </h2>
          </div>
          <div className="flex flex-wrap items-start gap-x-8 gap-y-4 md:justify-end">
            <Link href="/projects" className="text-link">
              Explore projects <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/about" className="text-link">
              Read about me <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}