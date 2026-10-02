import Link from "next/link";
import Container from "./Container";

export default function Footer() {
  return (
    <footer>
      <Container className="site-footer">
        <span>Yuri Morrison <span className="accent-period">/</span> Software &amp; AI</span>
        <span>Designed to be useful. &copy; 2026</span>
        <Link href="/#top">Back to top ↑</Link>
      </Container>
    </footer>
  );
}