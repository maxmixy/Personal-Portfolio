import Link from "next/link";

export default function Home() {
  return (
    <div className="home-page">
      <header className="site-header">
        <nav className="site-nav page-width" aria-label="Main navigation">
          <Link href="#top" className="wordmark" aria-label="Yuri Morrison home">
            YM<span>.</span>
          </Link>
          <div className="nav-links">
            <Link href="#work">Work</Link>
            <Link href="#experience">Experience</Link>
            <Link href="#profile">Profile</Link>
          </div>
          <Link href="#contact" className="nav-contact">
            Get in touch <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

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

          <div className="hero-visual" aria-label="Waste-to-Worth material recognition project results">
            <div className="visual-topline">
              <span>FIELD NOTES / 001</span>
              <span>WASTE-TO-WORTH</span>
            </div>
            <div className="scan-panel">
              <div className="scan-grid" aria-hidden="true" />
              <div className="scan-object" aria-hidden="true">
                <span className="bottle-cap" />
                <span className="bottle-neck" />
                <span className="bottle-body" />
                <span className="bottle-label" />
              </div>
              <span className="scan-corner corner-tl" />
              <span className="scan-corner corner-tr" />
              <span className="scan-corner corner-bl" />
              <span className="scan-corner corner-br" />
              <span className="scan-crosshair" aria-hidden="true">+</span>
              <div className="scan-caption"><span>INPUT / 014</span><span>POLYMER · PET</span></div>
            </div>
            <div className="result-line">
              <div>
                <p className="result-label">Pilot classification rate</p>
                <p className="result-detail">117 successful results / 136 scans</p>
              </div>
              <p className="result-number">86<span>%</span></p>
            </div>
            <div className="visual-bottomline">
              <span>RECOGNIZE</span><i /><span>RECOMMEND</span><i /><span>REUSE</span>
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
                  <Link href="#contact" aria-label="Ask about the Waste-to-Worth project">Discuss the project <span aria-hidden="true">↗</span></Link>
                </div>
              </article>

              <article className="project-row" id="experience">
                <div className="project-number">02</div>
                <div className="project-copy">
                  <p className="project-type">Software Engineering / Internship</p>
                  <h3>Electronic Science Corporation</h3>
                  <p>Engineering work across product features, data processing, debugging, and cloud deployment.</p>
                  <div className="tag-list"><span>AWS ECS</span><span>Lambda</span><span>S3</span><span>JavaScript</span></div>
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

      <footer className="site-footer page-width">
        <span>Yuri Morrison <span className="accent-period">/</span> Software & AI</span>
        <span>Designed to be useful. © 2026</span>
        <Link href="#top">Back to top ↑</Link>
      </footer>
    </div>
  );
}
