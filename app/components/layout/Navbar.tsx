import Link from "next/link";
import Container from "./Container";

export default function Navbar() {
  return (
    <header className="site-header">
      <nav aria-label="Main navigation">
        <Container className="site-nav">
          <Link href="/#top" className="wordmark" aria-label="Yuri Morrison home">
            YM<span>.</span>
          </Link>
          <div className="nav-links">
            <Link href="/projects">Projects</Link>
            <Link href="/experience" className="component-nav-secondary">Experience</Link>
            <Link href="/skills" className="component-nav-secondary">Skills</Link>
            <Link href="/achievements" className="component-nav-secondary">Achievements</Link>
            <Link href="/about">About</Link>
          </div>
          <Link href="/contact" className="nav-contact">
            Get in touch <span aria-hidden="true">↗</span>
          </Link>
        </Container>
      </nav>
    </header>
  );
}
