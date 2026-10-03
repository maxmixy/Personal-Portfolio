import Image from "next/image";
import Link from "next/link";
import Badge from "../ui/Badge";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  href?: string;
  repositoryUrl?: string;
  image?: string;
  featured?: boolean;
}

export default function ProjectCard({
  title,
  description,
  technologies,
  href,
  repositoryUrl,
  image,
  featured = false,
}: ProjectCardProps) {
  const cardContent = (
    <>
      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--coral)]">
          {featured ? "Featured" : "Project preview"}
        </span>

        {(href || repositoryUrl) && (
          <span className="text-xs text-[var(--ink-soft)]">
            {href ? "Case Study →" : "Source code"}
          </span>
        )}
      </div>

      <h3 className="text-2xl font-semibold tracking-tight">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {technologies.map((technology) => (
          <Badge key={technology}>{technology}</Badge>
        ))}
      </div>
    </>
  );

  return (
    <article className="group overflow-hidden border border-[var(--line)] bg-[var(--paper)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--ink)]">
      {image && (
        <div className="relative aspect-[3/2] overflow-hidden bg-[var(--paper-deep)]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      )}

      <div className="p-6 md:p-7">
        {href && (
          <Link
            href={href}
            aria-label={`Open the ${title} case study`}
            className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--coral)]"
          >
            {cardContent}
          </Link>
        )}

        {!href && cardContent}

        {repositoryUrl && (
          <a
            href={repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View the ${title} repository on GitHub (opens in a new tab)`}
            className="mt-7 inline-flex text-sm font-medium underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--coral)] hover:decoration-[var(--coral)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--coral)]"
          >
            View on GitHub <span aria-hidden="true" className="ml-1">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}