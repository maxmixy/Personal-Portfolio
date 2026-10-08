export function slugifyCatalogTitle(title: string): string {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || "book";
}

export function getCatalogBookSlug(book: { id: number; title: string }): string {
  return `${slugifyCatalogTitle(book.title)}-${book.id}`;
}

export function parseCatalogBookIdFromSlug(slug: string): number | undefined {
  const match = slug.trim().match(/(?:^|-)(\d+)$/);
  if (!match) {
    return undefined;
  }

  const id = Number.parseInt(match[1], 10);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}
