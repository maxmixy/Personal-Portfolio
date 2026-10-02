import Image from "next/image";
import Link from "next/link";
import Badge from "../ui/Badge";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  href: string;
  image?: string;
  featured?: boolean;
}

export default function ProjectCard({
  title,
  description,
  technologies,
  href,
  image,
  featured = false,
}: ProjectCardProps) {
  return (
    <article className="group overflow-hidden border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--foreground)]">
      {image && (
        <div className="relative aspect-[3/2] overflow-hidden bg-neutral-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      )}

      <div className="p-6 md:p-7">
        <div className="mb-5 flex items-center justify-between">
          {featured && (
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
              Featured
            </span>
          )}

          {!featured && <span />}
          
          <span className="text-xs text-[var(--muted)]">
            Case Study →
          </span>
        </div>

        <h3 className="text-2xl font-semibold tracking-tight">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <Badge key={technology}>{technology}</Badge>
          ))}
        </div>

        <Link
          href={href}
          className="mt-7 inline-flex text-sm font-medium underline decoration-[var(--border)] underline-offset-4 transition-colors hover:decoration-[var(--foreground)]"
        >
          View Project
        </Link>
      </div>
    </article>
  );
}