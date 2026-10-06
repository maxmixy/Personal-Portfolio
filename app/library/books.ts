export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publicationYear: number;
  genre: string;
  tags: string[];
  description: string;
  acquiredAt: string;
  ownershipStatus: "Owned" | "Available";
  location: string;
  readingStatus: "Want to Read" | "Reading" | "Completed" | "Abandoned" | "Re-reading";
}

export const books: Book[] = [
  {
    id: "designing-data-intensive-applications",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    isbn: "978-1491910519",
    publisher: "O'Reilly Media",
    publicationYear: 2017,
    genre: "Software architecture",
    tags: ["systems design", "distributed systems", "architecture"],
    description:
      "A practical guide to building reliable, scalable, and maintainable data systems. The book examines the architectural trade-offs behind modern data platforms and the decisions that shape their behavior.",
    acquiredAt: "2025-03-18",
    ownershipStatus: "Owned",
    location: "Personal collection",
    readingStatus: "Completed",
  },
  {
    id: "clean-code",
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0136083238",
    publisher: "Pearson",
    publicationYear: 2008,
    genre: "Software engineering",
    tags: ["code quality", "refactoring", "craftsmanship"],
    description:
      "A collection of principles and practices for writing readable, maintainable software. It explores how teams can improve code quality through disciplined design and consistent habits.",
    acquiredAt: "2025-01-10",
    ownershipStatus: "Owned",
    location: "Personal collection",
    readingStatus: "Re-reading",
  },
  {
    id: "the-pragmatic-programmer",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    isbn: "978-0135957059",
    publisher: "Addison-Wesley",
    publicationYear: 1999,
    genre: "Software engineering",
    tags: ["professional development", "testing", "automation"],
    description:
      "A field guide to the habits and practices that make software professionals effective. The book emphasizes iteration, communication, and thoughtful automation.",
    acquiredAt: "2024-11-20",
    ownershipStatus: "Owned",
    location: "Personal collection",
    readingStatus: "Completed",
  },
  {
    id: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    isbn: "978-1452188613",
    publisher: "Simon & Schuster",
    publicationYear: 2016,
    genre: "Productivity",
    tags: ["focus", "attention", "work habits"],
    description:
      "A practical framework for protecting focused work in a distracted environment. It presents routines for reducing interruptions and improving the quality of deep work.",
    acquiredAt: "2024-08-02",
    ownershipStatus: "Owned",
    location: "Personal collection",
    readingStatus: "Want to Read",
  },
  {
    id: "bird-by-bird",
    title: "Bird by Bird",
    author: "Anne Lamarr",
    isbn: "978-1530282581",
    publisher: "HarperCollins",
    publicationYear: 2015,
    genre: "Writing",
    tags: ["storytelling", "creative writing", "craft"],
    description:
      "A guided introduction to building a creative writing practice. It offers approachable techniques for developing ideas, finding a voice, and working through the writing process.",
    acquiredAt: "2024-06-12",
    ownershipStatus: "Owned",
    location: "Personal collection",
    readingStatus: "Reading",
  },
  {
    id: "the-creative-act",
    title: "The Creative Act",
    author: "Rick Rubin",
    isbn: "978-0593652886",
    publisher: "W. W. Norton",
    publicationYear: 2023,
    genre: "Creativity",
    tags: ["creative practice", "mindset", "artmaking"],
    description:
      "A broad reflection on creativity as a practice rather than a special trait. The book explores how creative work can be approached with curiosity, intention, and restraint.",
    acquiredAt: "2024-01-15",
    ownershipStatus: "Owned",
    location: "Personal collection",
    readingStatus: "Abandoned",
  },
];

export function getBookById(id: string): Book | undefined {
  return books.find((book) => book.id === id);
}
