CREATE TABLE "authors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "authors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"openLibraryKey" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "authors_openLibraryKey_unique" UNIQUE("openLibraryKey")
);
--> statement-breakpoint
CREATE TABLE "book_authors" (
	"bookId" integer NOT NULL,
	"authorId" integer NOT NULL,
	CONSTRAINT "book_authors_bookId_authorId_pk" PRIMARY KEY("bookId","authorId")
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "books_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"subtitle" text,
	"description" text,
	"coverUrl" text,
	"firstPublishedYear" integer,
	"openLibraryKey" text,
	"isbn10" text,
	"isbn13" text,
	"pageCount" integer,
	"language" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "books_openLibraryKey_unique" UNIQUE("openLibraryKey")
);
--> statement-breakpoint
ALTER TABLE "book_authors" ADD CONSTRAINT "book_authors_bookId_books_id_fk" FOREIGN KEY ("bookId") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_authors" ADD CONSTRAINT "book_authors_authorId_authors_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;