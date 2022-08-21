import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image.js";
import { Dispatch, SetStateAction, useState } from "react";
import { clientEnv } from "../env/schema.mjs";

type Movie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

type MoviePage = {
  page: number;
  results: Movie[];
};
type MoviePages = Array<MoviePage>;

interface FetchMovieButtonProps {
  setMovies: Dispatch<SetStateAction<Movie[]>>;
  fetchMovies: () => Promise<MoviePages>;
}

const FetchMovieButton = (props: FetchMovieButtonProps) => {
  const { setMovies, fetchMovies } = props;
  const [fetching, setFetching] = useState(false);

  const getMovies = () => {
    setFetching(true);
    fetchMovies().then((moviePages) => {
      setFetching(false);
      const movies = moviePages?.map((page) => {
        return page?.results;
      });
      const flat = movies.flatMap((movie) => movie);
      setMovies(flat);
    });
  };

  return (
    <div className="rounded-md shadow">
      <button
        onClick={getMovies}
        className="transition-all w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
      >
        {fetching ? (
          <>
            Laddar
            <div role="status" className="ml-4">
              <svg
                className="inline mr-2 w-6 h-6 text-white animate-spin fill-green-500"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </>
        ) : (
          "Hämta filmer"
        )}
      </button>
    </div>
  );
};

interface MovieListProps {
  movies: Movie[];
}

const MovieList = (props: MovieListProps) => {
  const { movies } = props;
  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
    >
      {movies.map((movie) => (
        <li key={movie.title} className="relative">
          <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`Poster image for ${movie.title}`}
              width={500}
              height={800}
              className="object-cover pointer-events-none group-hover:opacity-75"
            />
            <button
              type="button"
              className="absolute inset-0 focus:outline-none"
            >
              <span className="sr-only">View details for {movie.title}</span>
            </button>
          </div>
          <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
            {movie.title}
          </p>
          <p className="block text-sm font-medium text-gray-500 pointer-events-none">
            {movie.popularity}
          </p>
        </li>
      ))}
    </ul>
  );
};

const Home: NextPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  // Denna funktion bör egentligen definieras i någon annan fil med andra api requests
  const fetchMoviePage = (page = 1) => {
    return fetch(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Bearer ${clientEnv.NEXT_PUBLIC_API_KEY}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fetchMovies = () => {
    return Promise.all([
      fetchMoviePage(1),
      fetchMoviePage(2),
      fetchMoviePage(3),
      fetchMoviePage(4),
      fetchMoviePage(5),
    ]);
  };

  return (
    <>
      <Head>
        <title>The Movie DB</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative bg-gray-50 overflow-hidden min-h-screen">
        <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl sm:tracking-tight md:text-6xl md:tracking-tight">
              <span className="block xl:inline">themovie</span>
              <span className="block text-indigo-600 xl:inline">db</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Tryck på knappen för att hämta de populäraste 100 filmerna just
              nu.
            </p>
            {movies?.length === 0 ? (
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <FetchMovieButton
                  setMovies={setMovies}
                  fetchMovies={fetchMovies}
                />
              </div>
            ) : (
              <MovieList movies={movies} />
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
