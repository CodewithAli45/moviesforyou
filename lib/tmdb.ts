import type {
  Movie,
  MovieDetailWithCredits,
  PaginatedResponse,
  NowPlayingResponse,
  Genre,
} from "@/types/tmdb";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

async function fetchTMDB<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", process.env.TMDB_API_KEY!);
  url.searchParams.set("language", "en-US");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getTrending(
  timeWindow: "day" | "week" = "day"
): Promise<PaginatedResponse<Movie>> {
  return fetchTMDB(`/trending/movie/${timeWindow}`);
}

export async function getNowPlaying(): Promise<NowPlayingResponse> {
  return fetchTMDB("/movie/now_playing");
}

export async function getTopRated(): Promise<PaginatedResponse<Movie>> {
  return fetchTMDB("/movie/top_rated");
}

export async function getPopular(): Promise<PaginatedResponse<Movie>> {
  return fetchTMDB("/movie/popular");
}

export async function getMovieDetail(
  id: number
): Promise<MovieDetailWithCredits> {
  return fetchTMDB(`/movie/${id}`, {
    append_to_response: "videos,credits,similar,recommendations",
  });
}

export async function searchMovies(
  query: string,
  page: number = 1
): Promise<PaginatedResponse<Movie>> {
  return fetchTMDB("/search/movie", {
    query,
    page: String(page),
    include_adult: "false",
  });
}

export async function getMoviesByGenre(
  genreId: number,
  page: number = 1
): Promise<PaginatedResponse<Movie>> {
  return fetchTMDB("/discover/movie", {
    with_genres: String(genreId),
    sort_by: "popularity.desc",
    page: String(page),
  });
}

export async function getGenres(): Promise<{ genres: Genre[] }> {
  return fetchTMDB("/genre/movie/list");
}

export function getImageUrl(
  path: string | null,
  size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w500"
): string {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: "w300" | "w780" | "w1280" | "original" = "w1280"
): string {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE}/${size}${path}`;
}
