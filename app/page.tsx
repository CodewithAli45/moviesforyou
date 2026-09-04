import { getTrending, getNowPlaying, getTopRated, getPopular } from "@/lib/tmdb";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [trending, nowPlaying, topRated, popular] = await Promise.all([
    getTrending("day"),
    getNowPlaying(),
    getTopRated(),
    getPopular(),
  ]);

  const heroMovie = trending.results[0];

  return (
    <div>
      {heroMovie && <HeroBanner movie={heroMovie} />}

      <div className="space-y-10 py-8">
        <MovieRow title="Trending Now" movies={trending.results} />
        <MovieRow title="Now Playing" movies={nowPlaying.results} />
        <MovieRow title="Top Rated" movies={topRated.results} />
        <MovieRow title="Popular" movies={popular.results} />
      </div>
    </div>
  );
}
