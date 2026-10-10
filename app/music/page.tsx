import type { Metadata } from "next";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import MusicDashboard from "./MusicDashboard";

export const metadata: Metadata = {
  title: "Music | Yuri Morrison",
  description: "A personal snapshot of Yuri Morrison’s listening history on Spotify.",
};

export default async function MusicPage({ searchParams }: { searchParams: Promise<{ setup?: string; error?: string; owner?: string; connected?: string; disconnected?: string; ownerError?: string }> }) {
  const params = await searchParams;
  const configured = Boolean(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET && process.env.SPOTIFY_REDIRECT_URI && process.env.SPOTIFY_TOKEN_ENCRYPTION_KEY && process.env.SPOTIFY_OWNER_KEY && process.env.DATABASE_URL);
  return <div className="home-page"><Navbar /><MusicDashboard configured={configured} setupRequired={params.setup === "required"} authorizationError={params.error ?? null} ownerMode={params.owner === "1"} connected={params.connected === "1"} disconnected={params.disconnected === "1"} ownerError={params.ownerError === "1"} storageError={params.error === "storage"} /><Footer /></div>;
}
