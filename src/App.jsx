import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import Navbar from './components/Navbar';
import Search from './components/Search';
import MoviesDetails from './components/MoviesDetails';
import Loader from './components/Loader';
import WatchedSummary from './components/WatchedSummary';
import WatchMovieList from './components/WatchMovieList';
import useMovies from './useMovies';
import useLocalStorageState from './useLocalStorageState';

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = '81a84935';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], 'watched');

  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem('watched', JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // useEffect(
  //   function () {
  //     const controller = new AbortController();
  //     async function fetchMovies() {
  //       try {
  //         setIsLoading(true);
  //         setError('');
  //         const res = await fetch(
  //           `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
  //           { signal: controller.signal }
  //         );

  //         if (!res.ok) throw new Error('Something went wrong fetching movies');

  //         const data = await res.json();
  //         if (data.Response === 'False') throw new Error(' Movie not found');

  //         setMovies(data.Search);
  //         setError('');
  //       } catch (err) {
  //         console.error(err.message);

  //         if (err.name !== 'AbortError') {
  //           setError(err.message);
  //         }
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }

  //     if (query.length < 3) {
  //       setMovies([]);
  //       setError('');
  //       return;
  //     }

  //     handleCloseMovie();
  //     fetchMovies();

  //     return function () {
  //       controller.abort;
  //     };
  //   },
  //   [query]
  // );

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
          )}
          {error && <ErroMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MoviesDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
              KEY={KEY}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} average={average} />
              <WatchMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErroMessage({ message }) {
  return (
    <p className='error'>
      <span>⛔️</span>
      {message}
    </p>
  );
}

function NumResults({ movies }) {
  return (
    <p className='num-results'>
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className='main'>{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>

      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className='list list-movies'>
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}
function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
