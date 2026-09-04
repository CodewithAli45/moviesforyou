import { Suspense } from "react";
import { searchMovies } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps) {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q} - MoviesForYou` : "Search - MoviesForYou",
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, page } = await searchParams;
  const query = q || "";
  const currentPage = Number(page) || 1;

  let results = null;
  if (query) {
    results = await searchMovies(query, currentPage);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Search Movies</h1>

      <Suspense>
        <SearchBar />
      </Suspense>

      <div className="mt-8">
        {query && results && (
          <>
            <p className="text-sm text-gray-400 mb-6">
              {results.total_results.toLocaleString()} results for &ldquo;{query}&rdquo;
            </p>

            {results.results.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {results.results.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>

                <Pagination
                  currentPage={results.page}
                  totalPages={Math.min(results.total_pages, 500)}
                  basePath={`/search?q=${encodeURIComponent(query)}`}
                />
              </>
            ) : (
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-gray-400">No movies found for &ldquo;{query}&rdquo;</p>
              </div>
            )}
          </>
        )}

        {!query && (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-400">Start typing to search for movies</p>
          </div>
        )}
      </div>
    </div>
  );
}
