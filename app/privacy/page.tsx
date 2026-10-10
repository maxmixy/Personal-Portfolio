import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

export const metadata: Metadata = {
  title: "Privacy | Yuri Morrison",
  description: "How the personal portfolio handles Spotify data shown on the public music page.",
};

export default function PrivacyPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-width privacy-page">
        <p className="eyebrow">Policy / Privacy</p>
        <h1>Spotify data on this site</h1>
        <p className="privacy-updated">Last updated: October 10, 2026</p>

        <section>
          <h2>Whose data is shown</h2>
          <p>The <Link href="/music">Music page</Link> displays the site owner’s Spotify top tracks and artists. Visitors do not connect Spotify accounts, and this site does not request or collect visitors’ Spotify listening data.</p>
        </section>

        <section>
          <h2>What Spotify data is used</h2>
          <p>With the owner’s authorization, the site requests Spotify’s <code>user-top-read</code> permission to retrieve top tracks and artists for short-, medium-, and long-term periods. Track and artist names, Spotify links, artist genres, and Spotify-provided artwork are shown on the Music page.</p>
        </section>

        <section>
          <h2>Storage and publication</h2>
          <p>The owner’s access and refresh tokens are encrypted before being stored in the site’s Neon database. They are used only by the server and are never sent to visitors’ browsers. Public snapshots of the selected tracks and artists are stored temporarily in the same database and may be viewed by anyone visiting the Music page. Snapshots are refreshed periodically when requested and are removed when the owner disconnects Spotify.</p>
        </section>

        <section>
          <h2>Owner control</h2>
          <p>The owner can disconnect Spotify and clear the stored tokens and snapshots from <Link href="/music?owner=1">Music owner settings</Link>. The owner can also revoke this site’s Spotify access through the connected apps settings in their Spotify account.</p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>For questions about this notice, use the <Link href="/contact">contact page</Link>.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
