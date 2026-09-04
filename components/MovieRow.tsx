"use client";

import { useRef } from "react";
import MovieCard from "./MovieCard";
import type { Movie } from "@/types/tmdb";

export default function MovieRow({
  title,
  movies,
}: {
  title: string;
  movies: Movie[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative group/row">
      <div className="flex items-center justify-between mb-3 px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-xl font-semibold text-white">{title}</h2>
      </div>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-8 z-10 w-12 bg-gradient-to-r from-gray-950 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="w-[150px] sm:w-[180px] shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-8 z-10 w-12 bg-gradient-to-l from-gray-950 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
