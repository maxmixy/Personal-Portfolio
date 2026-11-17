import Link from "next/link";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import ImageSlideshow from "./components/ui/ImageSlideshow";
import { profileImages } from "./components/ui/slideshow-images";

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <main id="top">
        <section className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-mark" /> Software / AI Engineer</p>
            <h1 id="hero-title">Yuri<br />Morrison<span className="accent-period">.</span></h1>
            <p className="hero-summary">
              I build thoughtful software and intelligent systems, bringing the
              technical work and the people around it into focus.
            </p>
            <div className="hero-actions">
              <Link href="#work" className="button button-dark">Explore selected work <span aria-hidden="true">↓</span></Link>
              <Link href="#profile" className="text-link">A little about me <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="hero-index" aria-label="Portfolio focus areas">
              <span>01 / Engineering</span>
              <span>02 / Collaboration</span>
              <span>03 / Curiosity</span>
            </div>
          </div>

          <div className="hero-visual hero-profile-visual" aria-label="Portrait of Yuri Morrison">
            <div className="visual-topline">
              <span>PROFILE / 001</span>
              <span>YURI MORRISON</span>
            </div>
            <ImageSlideshow
              images={profileImages}
              label="Yuri Morrison photo gallery"
              aspectRatio="4 / 5"
              fit="cover"
              sizes="(max-width: 640px) 90vw, (max-width: 900px) 42vw, 38vw"
              priority
              className="hero-portrait-panel"
            />
            <div className="visual-bottomline hero-profile-caption">
              <span>SOFTWARE / AI ENGINEER</span><i /><span>BUILD · CONNECT · COMMUNICATE</span>
            </div>
          </div>
          <div className="hero-side-note">BUILDING AT THE INTERSECTION<br />OF PEOPLE & SYSTEMS</div>
        </section>

        <section className="work-section section-band" id="work" aria-labelledby="work-title">
          <div className="page-width">
            <div className="section-intro">
              <div>
                <p className="eyebrow">Selected work</p>
                <h2 id="work-title">Ideas, made<br />useful<span className="accent-period">.</span></h2>
              </div>
              <p className="section-aside">A few ways I turn technical problems into tools people can actually use.</p>
            </div>

            <div className="project-list">
              <article className="project-row project-featured">
                <div className="project-number">01</div>
                <div className="project-copy">
                  <p className="project-type">AI / Mobile / Research</p>
                  <h3>Waste-to-Worth</h3>
                  <p>An image-recognition and recommendation app that helps people find a second life for everyday materials.</p>
                  <div className="tag-list"><span>React Native</span><span>Flask</span><span>Firebase</span><span>Retrieval + AI</span></div>
                </div>
                <div className="project-metric">
                  <span className="metric-rule" />
                  <strong>53</strong>
                  <span>reuse projects completed<br />in the pilot</span>
                  <Link href="/projects/waste-to-worth" aria-label="Read the Waste-to-Worth case study">
                    Read case study <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>

              <article className="project-row" id="experience">
                <div className="project-number">02</div>
                <div className="project-copy">
                  <p className="project-type">Software Engineering / Internship</p>
                  <h3>Electronic Science Corporation</h3>
                  <p>Engineering work across product features, data processing, debugging, and cloud deployment.</p>
                  <div className="tag-list"><span>AWS ECS</span><span>Lambda</span><span>S3</span><span>JavaScript</span></div>
                  <Link href="/experience" className="mt-5 inline-flex text-sm font-medium underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--coral)] hover:decoration-[var(--coral)]">
                    View experience <span aria-hidden="true" className="ml-1">↗</span>
                  </Link>
                </div>
                <div className="project-metric metric-highlight">
                  <span className="metric-rule" />
                  <strong>~80<span>%</span></strong>
                  <span>less runtime for a<br />bulk-data workflow</span>
                  <p>Recognized as Best Intern</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="profile-section page-width" id="profile" aria-labelledby="profile-title">
          <div className="profile-heading">
            <p className="eyebrow">How I work</p>
            <h2 id="profile-title">Good engineering<br />is a team sport<span className="accent-period">.</span></h2>
          </div>
          <div className="profile-content">
            <p className="profile-lead">I like the whole shape of a problem: understanding what matters, building the system, and helping a team move from a rough idea to something real.</p>
            <div className="capability-list">
              <div><span>01</span><strong>Build</strong><p>Full-stack products, APIs, and applied AI.</p></div>
              <div><span>02</span><strong>Connect</strong><p>Clear communication across technical and creative teams.</p></div>
              <div><span>03</span><strong>Explore</strong><p>Music, games, books, and the systems behind them.</p></div>
            </div>
            <div className="leadership-note"><span className="leadership-index">SIDE PROJECT / COMMUNITY</span><p>Coordinated people and industry speakers for <strong>NOSEDIVE</strong>, a recurring student seminar series.</p></div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="page-width contact-inner">
            <p className="eyebrow">Next up</p>
            <h2 id="contact-title">Let’s make something<br />that matters<span className="accent-period">.</span></h2>
            <p>Open to thoughtful conversations about software, AI, and the work that connects them.</p>
            <Link className="contact-link" href="#work">Explore selected work <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
