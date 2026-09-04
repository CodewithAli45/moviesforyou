"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/tmdb";
import type { Movie } from "@/types/tmdb";

function getWatchlistMovies(): Movie[] {
  if (typeof window === "undefined") return [];
  const items: Movie[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("watchlist_")) {
      try {
        const data = JSON.parse(localStorage.getItem(key)!);
        items.push(data);
      } catch {
        localStorage.removeItem(key);
      }
    }
  }
  items.sort((a, b) => b.popularity - a.popularity);
  return items;
}

function subscribeToWatchlist(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export default function WatchlistPage() {
  const movies = useSyncExternalStore(
    subscribeToWatchlist,
    getWatchlistMovies,
    () => []
  );

  const removeFromWatchlist = (movieId: number) => {
    localStorage.removeItem(`watchlist_${movieId}`);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
          <p className="text-sm text-gray-400 mt-1">
            {movies.length} {movies.length === 1 ? "movie" : "movies"} saved
          </p>
        </div>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-20">
          <svg
            className="w-16 h-16 text-gray-700 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <p className="text-gray-400 mb-4">Your watchlist is empty</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-gray-950 px-6 py-3 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <div key={movie.id} className="group relative">
              <Link href={`/movie/${movie.id}`}>
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800">
                  <Image
                    src={getImageUrl(movie.poster_path, "w342")}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-2 px-0.5">
                  <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-1">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "TBA"}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => removeFromWatchlist(movie.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 z-10"
                title="Remove from watchlist"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
