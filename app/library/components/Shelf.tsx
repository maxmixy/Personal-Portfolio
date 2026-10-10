import type { ReactNode } from "react";

interface ShelfProps {
  children: ReactNode;
  label: string;
}

export default function Shelf({ children, label }: ShelfProps) {
  return (
    <div className="bookshelf-shelf" role="list" aria-label={label}>
      {children}
    </div>
  );
}
