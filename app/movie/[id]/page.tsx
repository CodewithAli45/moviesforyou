import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMovieDetail, getImageUrl, getBackdropUrl } from "@/lib/tmdb";
import TrailerModal from "@/components/TrailerModal";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetail(Number(id)).catch(() => null);
  if (!movie) return { title: "Movie Not Found" };
  return {
    title: `${movie.title} - MoviesForYou`,
    description: movie.overview?.slice(0, 160),
  };
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params;
  const movieId = Number(id);

  if (isNaN(movieId)) notFound();

  let movie;
  try {
    movie = await getMovieDetail(movieId);
  } catch {
    notFound();
  }

  const trailer = movie.videos.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  ) || movie.videos.results.find((v) => v.site === "YouTube");

  const director = movie.credits.crew.find((c) => c.job === "Director");
  const writers = movie.credits.crew
    .filter((c) => c.department === "Writing")
    .slice(0, 3);

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "N/A";
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  };

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return "N/A";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div>
      <div className="relative w-full h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src={getBackdropUrl(movie.backdrop_path, "original")}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0 w-48 sm:w-56 md:w-64">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-gray-800">
              <Image
                src={getImageUrl(movie.poster_path, "w500")}
                alt={movie.title}
                fill
                sizes="256px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 pt-4 md:pt-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-lg text-gray-400 italic mb-4">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                <svg
                  className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="font-medium text-white">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-gray-400 text-sm">
                  ({movie.vote_count.toLocaleString()})
                </span>
              </div>
              <span className="text-gray-600">•</span>
              <span className="text-gray-300">
                {new Date(movie.release_date).getFullYear()}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-300">{formatRuntime(movie.runtime)}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/genre/${genre.id}`}
                  className="px-3 py-1 rounded-full bg-gray-800/50 text-sm text-gray-300 border border-gray-700/30 hover:bg-gray-700/50 hover:text-white transition-colors"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">{movie.overview}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                <p className="text-sm text-white">{movie.status}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Budget</p>
                <p className="text-sm text-white">{formatCurrency(movie.budget)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Revenue</p>
                <p className="text-sm text-white">{formatCurrency(movie.revenue)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Language</p>
                <p className="text-sm text-white uppercase">
                  {movie.original_language}
                </p>
              </div>
            </div>

            {director && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Director</p>
                <p className="text-sm text-white">{director.name}</p>
              </div>
            )}
            {writers.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Writers
                </p>
                <p className="text-sm text-white">
                  {writers.map((w) => w.name).join(", ")}
                </p>
              </div>
            )}

            {trailer && <TrailerModal videoKey={trailer.key} />}
          </div>
        </div>
      </div>

      {movie.credits.cast.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="text-xl font-semibold text-white mb-6">Cast</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {movie.credits.cast.slice(0, 20).map((person) => (
              <div key={person.id} className="shrink-0 w-28 text-center">
                <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-800 mb-2">
                  {person.profile_path ? (
                    <Image
                      src={getImageUrl(person.profile_path, "w185")}
                      alt={person.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium text-white truncate">
                  {person.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{person.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {movie.similar.results.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <h2 className="text-xl font-semibold text-white mb-6">Similar Movies</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {movie.similar.results.slice(0, 12).map((m) => (
              <Link
                key={m.id}
                href={`/movie/${m.id}`}
                className="group"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                  <Image
                    src={getImageUrl(m.poster_path, "w342")}
                    alt={m.title}
                    fill
                    sizes="150px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-xs text-gray-300 mt-1 truncate group-hover:text-white transition-colors">
                  {m.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
        {movie.production_companies.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-gray-800/50">
            <span className="text-xs text-gray-500">Production:</span>
            {movie.production_companies.map((company) => (
              <span key={company.id} className="text-xs text-gray-400">
                {company.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
