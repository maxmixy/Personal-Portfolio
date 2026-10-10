"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type SpotifyTopItem = { id: string; name: string; url: string; image: string | null; subtitle: string };

type Range = "short_term" | "medium_term" | "long_term";
type DashboardData = { range: Range; updatedAt: string; stale?: boolean; tracks: SpotifyTopItem[]; artists: SpotifyTopItem[] };
type ErrorCode = "setup" | "not_published" | "owner_authorization_expired" | "storage_unavailable" | "spotify_unavailable" | "rate_limited" | "network";

const ranges: { value: Range; label: string }[] = [
  { value: "short_term", label: "Last 4 weeks" },
  { value: "medium_term", label: "Last 6 months" },
  { value: "long_term", label: "Long term" },
];

const messages: Record<ErrorCode, string> = {
  setup: "Spotify is not configured yet. Add the server environment variables listed in the setup notes.",
  not_published: "The owner’s Spotify dashboard has not been connected yet.",
  owner_authorization_expired: "The owner needs to reconnect Spotify. The last published snapshot may still be shown.",
  storage_unavailable: "The music dashboard is temporarily unavailable.",
  spotify_unavailable: "Spotify could not return your listening data. Try again in a moment.",
  rate_limited: "Spotify is receiving too many requests. Wait a little and try again.",
  network: "The music dashboard could not reach the server. Check your connection and try again.",
};

export default function MusicDashboard({ configured, setupRequired, authorizationError, ownerMode, connected, disconnected, ownerError, storageError }: { configured: boolean; setupRequired: boolean; authorizationError: string | null; ownerMode: boolean; connected: boolean; disconnected: boolean; ownerError: boolean; storageError: boolean }) {
  const [range, setRange] = useState<Range>("medium_term");
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<ErrorCode | null>(setupRequired ? "setup" : storageError ? "storage_unavailable" : authorizationError ? "spotify_unavailable" : null);
  const [loading, setLoading] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [cardMotion, setCardMotion] = useState<{ phase: "idle" | "exit" | "enter"; direction: -1 | 1 }>({ phase: "idle", direction: 1 });
  const transitionBusy = useRef(false);
  const transitionTimers = useRef<number[]>([]);

  const featuredTrack = data?.tracks[featuredIndex] ?? data?.tracks[0];

  const moveFeatured = useCallback((direction: -1 | 1) => {
    const count = data?.tracks.length ?? 0;
    if (count < 2 || transitionBusy.current) return;
    const nextIndex = (featuredIndex + direction + count) % count;
    if (reducedMotion) {
      setFeaturedIndex(nextIndex);
      return;
    }

    transitionBusy.current = true;
    setCardMotion({ phase: "exit", direction });
    transitionTimers.current.push(window.setTimeout(() => {
      setFeaturedIndex(nextIndex);
      setCardMotion({ phase: "enter", direction });
      transitionTimers.current.push(window.setTimeout(() => {
        setCardMotion({ phase: "idle", direction });
        transitionBusy.current = false;
      }, 420));
    }, 420));
  }, [data?.tracks.length, featuredIndex, reducedMotion]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    setFeaturedIndex(0);
    setPaused(false);
    transitionBusy.current = false;
    transitionTimers.current.forEach(window.clearTimeout);
    transitionTimers.current = [];
    setCardMotion({ phase: "idle", direction: 1 });
  }, [range]);

  useEffect(() => () => transitionTimers.current.forEach(window.clearTimeout), []);

  useEffect(() => {
    if (paused || interacting || reducedMotion || (data?.tracks.length ?? 0) < 2) return;
    const timer = window.setInterval(() => {
      moveFeatured(1);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [data?.tracks.length, paused, interacting, reducedMotion, moveFeatured]);

  const load = useCallback(async (nextRange: Range) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/music/api/data?range=${nextRange}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) {
        const code = payload.error as ErrorCode;
        setData(null);
        setError(code in messages ? code : "spotify_unavailable");
      } else {
        setData(payload as DashboardData);
      }
    } catch {
      setError("network");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!configured || setupRequired) return;
    const timer = window.setTimeout(() => void load(range), 0);
    return () => window.clearTimeout(timer);
  }, [configured, setupRequired, range, load]);

  return (
    <main className="music-page page-width">
      <header className="music-heading">
        <div className="music-heading-copy">
          <p className="eyebrow"><span className="eyebrow-mark" /> PERSONAL DASHBOARD / 01</p>
          <h1>What I’ve<br /><span>been listening to.</span></h1>
          <p className="music-intro">A snapshot of my most played tracks and artists, based on my Spotify listening history.</p>
        </div>
        {featuredTrack ? <div className={`music-feature-wrap ${cardMotion.phase === "exit" ? `is-exiting-${cardMotion.direction === 1 ? "next" : "previous"}` : cardMotion.phase === "enter" ? `is-entering-${cardMotion.direction === 1 ? "next" : "previous"}` : ""}`} onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteracting(false); }}>
          <a className="music-feature" href={featuredTrack.url} target="_blank" rel="noreferrer" aria-label={`Featured track: ${featuredTrack.name} by ${featuredTrack.subtitle}. Open on Spotify`}>
            <span className="music-feature-label">ON REPEAT <span>{String(featuredIndex + 1).padStart(2, "0")} / {String(data?.tracks.length ?? 0).padStart(2, "0")}</span></span>
            {featuredTrack.image ? <Image key={featuredTrack.id} src={featuredTrack.image} alt="" width={320} height={320} unoptimized /> : <span className="music-feature-art-placeholder" aria-hidden="true">♫</span>}
            <span className="music-feature-copy"><strong>{featuredTrack.name}</strong><span>{featuredTrack.subtitle}</span><i aria-hidden="true">↗</i></span>
          </a>
          {(data?.tracks.length ?? 0) > 1 ? <div className="music-feature-controls" aria-label="Featured track controls">
            <button type="button" onClick={() => { setPaused(true); moveFeatured(-1); }} aria-label="Previous featured track">←</button>
            <button type="button" onClick={() => setPaused((value) => !value)} disabled={reducedMotion} aria-label={reducedMotion ? "Automatic rotation is disabled by your reduced motion setting" : paused ? "Resume featured track rotation" : "Pause featured track rotation"}>{reducedMotion ? "Manual" : paused ? "Play" : "Pause"}</button>
            <button type="button" onClick={() => { setPaused(true); moveFeatured(1); }} aria-label="Next featured track">→</button>
          </div> : null}
        </div> : <div className="music-hero-graphic" aria-hidden="true"><span>♫</span><span>♪</span><span>♬</span></div>}
      </header>

      {connected ? <p className="music-notice" role="status">Your Spotify account is connected. The public dashboard will update as each listening period is loaded.</p> : null}
      {disconnected ? <p className="music-notice" role="status">The Spotify connection and published listening snapshots have been removed.</p> : null}
      {error && (
        <section className="music-state" aria-live="polite">
          <div><p className="music-state-label">{error === "not_published" ? "DASHBOARD NOT PUBLISHED" : error === "owner_authorization_expired" ? "OWNER ACTION REQUIRED" : error === "setup" ? "SETUP REQUIRED" : "DATA UNAVAILABLE"}</p><p>{messages[error]}</p></div>
          {configured && error !== "not_published" ? <button className="button button-dark" onClick={() => void load(range)}>Try again</button> : null}
        </section>
      )}

      {ownerMode && <section className="music-owner-panel">
        <p className="music-state-label">OWNER CONTROLS</p>
        <h2>Manage the public snapshot</h2>
        <p>Authorize the Spotify account whose top tracks and artists should appear on this page. Visitors do not connect their accounts.</p>
        {ownerError ? <p className="music-owner-error" role="alert">Enter the correct owner key and confirm public sharing to continue.</p> : null}
        <form action="/music/api/connect" method="post" className="music-owner-form">
          <label htmlFor="owner-key">Owner key</label>
          <input id="owner-key" name="ownerKey" type="password" autoComplete="current-password" required />
          <label className="music-consent"><input name="publishConsent" type="checkbox" required /> I agree that the account’s top tracks and artists will be visible to anyone who visits this site. See the <a href="/privacy">Spotify data privacy notice</a>.</label>
          <button className="button button-dark" type="submit">Connect owner Spotify <span aria-hidden="true">↗</span></button>
        </form>
        <form action="/music/api/disconnect" method="post" className="music-owner-form music-owner-disconnect">
          <label htmlFor="disconnect-owner-key">Remove the connection and published snapshots</label>
          <input id="disconnect-owner-key" name="ownerKey" type="password" autoComplete="current-password" required />
          <button type="submit">Disconnect and clear data</button>
        </form>
      </section>}

      {data && (
        <>
          <div className="music-toolbar">
            <div className="music-range" role="group" aria-label="Listening period">
              {ranges.map((option) => <button key={option.value} className={range === option.value ? "is-active" : ""} aria-pressed={range === option.value} onClick={() => setRange(option.value)}>{option.label}</button>)}
            </div>
            <p>{loading ? "Updating…" : `${data.stale ? "Saved snapshot · " : "Updated "}${new Date(data.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`}</p>
          </div>

          <section className="music-list-section">
            <div className="music-section-heading"><p className="eyebrow">01 / MOST PLAYED</p><h2>Tracks</h2></div>
            {data.tracks.length ? <ol className="music-list">{data.tracks.map((track, index) => <li key={track.id}><span className="music-rank">{String(index + 1).padStart(2, "0")}</span>{track.image ? <Image src={track.image} alt="" width={64} height={64} unoptimized /> : <span className="music-art-placeholder" aria-hidden="true">♫</span>}<div className="music-item-copy"><strong>{track.name}</strong><span>{track.subtitle}</span></div><a className="music-external" href={track.url} target="_blank" rel="noreferrer" aria-label={`Open ${track.name} on Spotify`}>↗</a></li>)}</ol> : <p className="music-empty">No top tracks are available for this period yet.</p>}
          </section>

          <section className="music-list-section music-artists-section">
            <div className="music-section-heading"><p className="eyebrow">02 / MOST PLAYED</p><h2>Artists</h2></div>
            {data.artists.length ? <ol className="music-artist-list">{data.artists.map((artist, index) => <li key={artist.id}><a href={artist.url} target="_blank" rel="noreferrer" className="music-artist-link">{artist.image ? <Image src={artist.image} alt="" width={220} height={220} unoptimized /> : <span className="music-art-placeholder" aria-hidden="true">♫</span>}<span className="music-rank">{String(index + 1).padStart(2, "0")}</span><span className="music-item-copy"><strong>{artist.name}</strong><span>{artist.subtitle}</span></span><span className="music-external" aria-hidden="true">↗</span></a></li>)}</ol> : <p className="music-empty">No top artists are available for this period yet.</p>}
          </section>
          <div className="music-credit"><a href="https://www.spotify.com/" className="spotify-attribution" aria-label="Spotify, source of this listening data"><Image src="/spotify-full-logo.svg" alt="Spotify" width={160} height={72} /><span>Listening data provided by Spotify</span></a><a href="/music?owner=1">Owner settings</a></div>
        </>
      )}
      {!configured && !error && <section className="music-state"><div><p className="music-state-label">SETUP REQUIRED</p><p>{messages.setup}</p></div></section>}
      {!ownerMode && !data && <p className="music-owner-link"><a href="/music?owner=1">Owner settings</a></p>}
    </main>
  );
}
