import Link from "next/link";
import Image from "next/image";
import { getBackdropUrl } from "@/lib/tmdb";
import type { Movie } from "@/types/tmdb";

export default function HeroBanner({ movie }: { movie: Movie }) {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
      <div className="absolute inset-0 animate-kenburns">
        <Image
          src={getBackdropUrl(movie.backdrop_path, "original")}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            {movie.title}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <svg
                className="w-5 h-5 text-yellow-400 fill-yellow-400"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm font-medium text-white">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-sm text-gray-400">
                ({movie.vote_count.toLocaleString()} votes)
              </span>
            </div>
            {movie.release_date && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-sm text-gray-300">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              </>
            )}
          </div>

          <p className="text-sm sm:text-base text-gray-300 line-clamp-3 mb-6 leading-relaxed">
            {movie.overview}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/movie/${movie.id}`}
              className="inline-flex items-center gap-2 bg-white text-gray-950 px-6 py-3 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
              More Info
            </Link>
            <Link
              href={`/search?q=${encodeURIComponent(movie.title)}`}
              className="inline-flex items-center gap-2 bg-gray-800/80 text-white px-6 py-3 rounded-full font-medium text-sm border border-gray-700/50 hover:bg-gray-700/80 transition-colors"
            >
              Similar Movies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
