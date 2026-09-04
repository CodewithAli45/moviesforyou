"use client";

import Link from "next/link";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { getImageUrl } from "@/lib/tmdb";
import type { Movie } from "@/types/tmdb";

function getWatchlistSnapshot(movieId: number): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(`watchlist_${movieId}`);
}

function subscribeToWatchlist(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export default function MovieCard({ movie }: { movie: Movie }) {
  const inWatchlist = useSyncExternalStore(
    subscribeToWatchlist,
    () => getWatchlistSnapshot(movie.id),
    () => false
  );

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      localStorage.removeItem(`watchlist_${movie.id}`);
    } else {
      localStorage.setItem(`watchlist_${movie.id}`, JSON.stringify(movie));
    }
    window.dispatchEvent(new Event("storage"));
  };

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  return (
    <Link href={`/movie/${movie.id}`} className="group block shrink-0">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800">
        <Image
          src={getImageUrl(movie.poster_path, "w342")}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs font-medium text-white">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>

        <button
          onClick={toggleWatchlist}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
        >
          <svg
            className={`w-4 h-4 transition-colors ${
              inWatchlist ? "text-red-500 fill-red-500" : "text-white"
            }`}
            fill={inWatchlist ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-1">
          {movie.title}
        </h3>
        {year && (
          <p className="text-xs text-gray-500 mt-0.5">{year}</p>
        )}
      </div>
    </Link>
  );
}
