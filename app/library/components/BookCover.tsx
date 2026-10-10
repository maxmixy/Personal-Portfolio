import Image from "next/image";
import { getCoverUrlForSize } from "../lib/catalog.display";

interface BookCoverProps {
  src: string | null;
  title: string;
  size?: "S" | "M" | "L";
  priority?: boolean;
}

const COVER_SIZES = {
  S: { width: 72, height: 108 },
  M: { width: 180, height: 270 },
  L: { width: 320, height: 480 },
} as const;

export default function BookCover({
  src,
  title,
  size = "M",
  priority = false,
}: BookCoverProps) {
  const { width, height } = COVER_SIZES[size];
  const imageSrc = getCoverUrlForSize(src, size);

  if (!imageSrc) {
    return (
      <div
        className={`book-cover-fallback${size === "S" ? " book-cover-fallback-compact" : ""}`}
        style={{ aspectRatio: `${width} / ${height}` }}
        aria-hidden="true"
      >
        <span>No cover</span>
        <strong>{title}</strong>
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={`Cover of ${title}`}
      width={width}
      height={height}
      priority={priority}
      className="book-cover-image"
    />
  );
}
