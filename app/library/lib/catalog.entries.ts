export interface LibraryEntry {
  raw: string;
  title: string;
  author?: string;
  isbn?: string;
  authorOnly?: boolean;
}

const ISBN_COMPACT = /^(?:\d{9}[\dXx]|\d{13})$/;

export function compactIsbn(value: string): string {
  return value.replace(/[-\s]/g, "");
}

export function isIsbnValue(value: string): boolean {
  return ISBN_COMPACT.test(compactIsbn(value));
}

export function parseLibraryEntries(input: string, authorInput = ""): LibraryEntry[] {
  const bookEntries = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 10)
    .map(parseLibraryEntry);
  const authorEntries = authorInput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((author): LibraryEntry => ({ raw: author, title: "", author, authorOnly: true }));
  return [...bookEntries, ...authorEntries].slice(0, 10);
}

export function parseLibraryEntry(raw: string): LibraryEntry {
  const line = raw.trim();
  const isbn = compactIsbn(line);

  if (ISBN_COMPACT.test(isbn)) {
    return {
      raw: line,
      title: line,
      isbn: isbn.toUpperCase(),
    };
  }

  const parts = line.split(/\s+[—–−-]\s+/);
  if (parts.length >= 2) {
    const title = parts[0]?.trim();
    const author = parts.slice(1).join(" — ").trim();
    return {
      raw: line,
      title: title || line,
      ...(author ? { author } : {}),
    };
  }

  return {
    raw: line,
    title: line,
  };
}
