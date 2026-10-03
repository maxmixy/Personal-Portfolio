import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "../components/layout/Container";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import SectionHeading from "../components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Achievements & Recognition | Yuri Morrison",
  description:
    "Credly certifications, TOPCIT Level 4, and project recognition earned by Yuri Morrison.",
};

interface CredlyBadge {
  id: string;
  name: string;
  issuer: string;
  category: string;
  imageUrl: string | null;
  issuedAt: string | null;
  expiresAt: string | null;
}

interface CredlyPage {
  data: unknown[];
  totalPages: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function toCredlyBadge(value: unknown): CredlyBadge | null {
  if (!isRecord(value) || value.public !== true || value.is_private_badge === true || value.state !== "accepted") {
    return null;
  }

  const template = value.badge_template;
  if (!isRecord(template) || typeof value.id !== "string" || typeof template.name !== "string") {
    return null;
  }

  const issuer = isRecord(value.issuer) ? value.issuer : null;
  const issuerEntities = issuer && Array.isArray(issuer.entities) ? issuer.entities : [];
  const primaryIssuer = issuerEntities.find((entity) =>
    isRecord(entity) && entity.primary === true && isRecord(entity.entity),
  );
  const issuerEntity = isRecord(primaryIssuer) && isRecord(primaryIssuer.entity)
    ? primaryIssuer.entity
    : null;
  const issuerName = issuerEntity ? getString(issuerEntity.name) : null;
  const imageUrl = getString(value.image_url) ?? getString(template.image_url);

  return {
    id: value.id,
    name: template.name,
    issuer: issuerName ?? "Issuer not listed",
    category: getString(template.type_category) ?? "Credly credential",
    imageUrl: imageUrl?.startsWith("https://images.credly.com/images/") ? imageUrl : null,
    issuedAt: getString(value.issued_at_date),
    expiresAt: getString(value.expires_at_date),
  };
}

async function fetchCredlyPage(page: number): Promise<CredlyPage> {
  const response = await fetch(
    `https://www.credly.com/users/yuri-morrison/badges.json?per=48&page=${page}`,
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) {
    throw new Error(`Credly returned ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!isRecord(payload) || !Array.isArray(payload.data)) {
    throw new Error("Credly returned an unexpected badge response");
  }

  const metadata = isRecord(payload.metadata) ? payload.metadata : null;
  const totalPages = metadata && typeof metadata.total_pages === "number"
    ? Math.max(1, metadata.total_pages)
    : 1;

  return { data: payload.data, totalPages };
}

async function getCredlyBadges(): Promise<CredlyBadge[] | null> {
  try {
    const firstPage = await fetchCredlyPage(1);
    const pages = await Promise.all(
      Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
        fetchCredlyPage(index + 2),
      ),
    );

    return [firstPage, ...pages]
      .flatMap((page) => page.data)
      .map(toCredlyBadge)
      .filter((badge): badge is CredlyBadge => badge !== null)
      .sort((a, b) => (b.issuedAt ?? "").localeCompare(a.issuedAt ?? ""));
  } catch {
    return null;
  }
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

export default async function AchievementsPage() {
  const credlyBadges = await getCredlyBadges();
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="page-width py-16 md:py-24" aria-labelledby="achievements-title">
          <p className="eyebrow">Achievements / Recognition</p>
          <div className="mt-8 grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-14">
            <h1 id="achievements-title" className="max-w-4xl text-5xl font-medium leading-[0.98] tracking-tight md:text-7xl">
              Recognition earned through building and delivery
              <span className="accent-period">.</span>
            </h1>
            <p className="max-w-xl pb-1 text-sm leading-7 text-[var(--ink-soft)] md:text-base">
              A short record of professional and academic project recognition.
              Each distinction is kept in its own context rather than folded
              into a general list of credentials.
            </p>
          </div>
        </section>

        <section className="section-band py-14 md:py-20" aria-labelledby="credentials-title">
          <Container>
            <SectionHeading
              id="credentials-title"
              eyebrow="01 / Credentials"
              title="Earned and verifiable."
              description="The Credly wallet below is fetched from its public badge feed and revalidated hourly. Each badge opens its own Credly verification page."
            />

            <div className="mb-6 grid gap-4 border border-[var(--line)] bg-[var(--paper)] p-5 sm:grid-cols-[100px_1fr_auto] sm:items-center sm:gap-6 md:p-6">
              <span className="flex h-20 w-20 items-center justify-center border border-[var(--line)] bg-[var(--paper-deep)] font-mono text-xs text-[var(--ink-soft)]">
                PDF
              </span>
              <div>
                <p className="project-type">TOPCIT / Level 4</p>
                <h2 className="mt-2 text-lg font-medium">TOPCIT Level 4 Certificate</h2>
                <p className="mt-1 text-xs text-[var(--ink-soft)]">Personal certificate · PDF</p>
              </div>
              <a
                href="/Yuri%20Andrei%20Morrison%20-%20Topcit%20Certificate.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--coral)] hover:decoration-[var(--coral)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--coral)]"
              >
                View certificate <span aria-hidden="true">↗</span>
              </a>
            </div>

            {credlyBadges && credlyBadges.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {credlyBadges.map((badge) => (
                  <a
                    key={badge.id}
                    href={`https://www.credly.com/badges/${encodeURIComponent(badge.id)}/public_url`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${badge.name}, issued by ${badge.issuer}, on Credly (opens in a new tab)`}
                    className="group flex min-h-64 flex-col border border-[var(--line)] bg-[var(--paper)] p-5 transition-colors hover:border-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--coral)]"
                  >
                    <div className="flex items-start gap-4">
                      {badge.imageUrl ? (
                        <Image
                          src={badge.imageUrl}
                          alt=""
                          width={88}
                          height={88}
                          className="h-[88px] w-[88px] shrink-0 object-contain"
                        />
                      ) : (
                        <span className="flex h-[88px] w-[88px] shrink-0 items-center justify-center border border-[var(--line)] bg-[var(--paper-deep)] font-mono text-xs text-[var(--ink-soft)]">
                          BADGE
                        </span>
                      )}
                      <div className="min-w-0 pt-1">
                        <p className="project-type">{badge.category}</p>
                        <p className="mt-2 text-xs leading-5 text-[var(--ink-soft)]">{badge.issuer}</p>
                      </div>
                    </div>
                    <h3 className="mt-5 text-base font-semibold leading-6 group-hover:text-[var(--coral)]">
                      {badge.name}
                    </h3>
                    <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-5 text-xs text-[var(--ink-soft)]">
                      {badge.issuedAt && <span>Issued {formatDate(badge.issuedAt)}</span>}
                      {badge.expiresAt && <span>Expires {formatDate(badge.expiresAt)}</span>}
                      <span className="font-medium">Verify on Credly ↗</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p role="status" className="border border-[var(--line)] bg-[var(--paper)] p-5 text-sm leading-7 text-[var(--ink-soft)]">
                Credly badges are temporarily unavailable. You can still view the
                public badge wallet on <a className="underline underline-offset-4" href="https://www.credly.com/users/yuri-morrison" target="_blank" rel="noopener noreferrer">Credly ↗</a>.
              </p>
            )}
          </Container>
        </section>

        <section className="py-14 md:py-20" aria-labelledby="awards-title">
          <Container>
            <SectionHeading
              id="awards-title"
              eyebrow="02 / Professional award"
              title="Recognition for professional contribution."
              description="Recognition received during the software engineering internship."
            />

            <article className="grid gap-6 border-y border-[var(--line)] py-7 md:grid-cols-[110px_1fr_auto] md:items-center md:gap-10 md:py-9">
              <span className="project-type">Award / 01</span>
              <div>
                <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
                  Best Intern
                </h2>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">
                  Student Internship Program · Department recognition
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
                  Following the internship, I was also invited to apply for a
                  software engineering opening. Company-specific details remain
                  confidential.
                </p>
              </div>
              <Link href="/experience" className="text-link">
                Internship experience <span aria-hidden="true">↗</span>
              </Link>
            </article>
          </Container>
        </section>

        <section className="page-width py-14 md:py-20" aria-labelledby="competition-title">
          <SectionHeading
            id="competition-title"
            eyebrow="03 / Capstone competition"
            title="Recognition for a project built to solve a real problem."
          />

          <article className="grid gap-6 border-y border-[var(--line)] py-7 md:grid-cols-[110px_1fr_auto] md:items-center md:gap-10 md:py-9">
            <span className="project-type">Competition / 01</span>
            <div>
              <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
                3rd Best Capstone Project Overall
              </h2>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                Department Level · Waste-To-Worth
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
                The project combined image-based material recognition,
                knowledge retrieval, and LLM generation to help users find
                recycling and upcycling guidance. The recorded pilot results
                are documented separately in the case study.
              </p>
            </div>
            <Link href="/projects/waste-to-worth" className="text-link">
              Read the case study <span aria-hidden="true">↗</span>
            </Link>
          </article>
        </section>

        <section className="contact-section" aria-labelledby="achievements-next-title">
          <Container className="contact-inner">
            <p className="eyebrow">Recognition follows the work</p>
            <h2 id="achievements-next-title">
              See the projects<br />behind the outcomes
              <span className="accent-period">.</span>
            </h2>
            <p>Explore the systems, decisions, and results in the project portfolio.</p>
            <Link className="contact-link" href="/projects">
              Explore projects <span aria-hidden="true">↗</span>
            </Link>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}