import { getMoviesByGenre, getGenres } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const genres = await getGenres().catch(() => ({ genres: [] }));
  const genre = genres.genres.find((g) => g.id === Number(id));
  return {
    title: genre ? `${genre.name} Movies - MoviesForYou` : "Genre - MoviesForYou",
  };
}

export default async function GenrePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { page } = await searchParams;
  const genreId = Number(id);
  const currentPage = Number(page) || 1;

  if (isNaN(genreId)) notFound();

  const [genres, movies] = await Promise.all([
    getGenres().catch(() => ({ genres: [] })),
    getMoviesByGenre(genreId, currentPage).catch(() => null),
  ]);

  const genre = genres.genres.find((g) => g.id === genreId);
  if (!genre) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Genre</p>
        <h1 className="text-3xl font-bold text-white">{genre.name} Movies</h1>
      </div>

      {movies && movies.results.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <Pagination
            currentPage={movies.page}
            totalPages={Math.min(movies.total_pages, 500)}
            basePath={`/genre/${genreId}`}
          />
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400">No movies found in this genre</p>
        </div>
      )}
    </div>
  );
}
