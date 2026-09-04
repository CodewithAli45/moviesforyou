"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getGenres } from "@/lib/tmdb";
import type { Genre } from "@/types/tmdb";

export default function GenreChips() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    getGenres().then((data) => setGenres(data.genres));
  }, []);

  const currentGenreId = pathname.startsWith("/genre/")
    ? pathname.split("/genre/")[1]
    : null;

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-4 sm:px-6 lg:px-8">
      {genres.map((genre) => (
        <Link
          key={genre.id}
          href={`/genre/${genre.id}`}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            String(genre.id) === currentGenreId
              ? "bg-white text-gray-950"
              : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/30"
          }`}
        >
          {genre.name}
        </Link>
      ))}
    </div>
  );
}
