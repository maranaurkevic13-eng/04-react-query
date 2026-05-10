import { useState } from 'react';
import { useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../../services/movieService';
import type { MovieResponse } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import toast, { Toaster } from 'react-hot-toast';
import type { ReactPaginateProps } from 'react-paginate';
import ReactPaginateModule from 'react-paginate';
import type { ComponentType } from 'react';
import css from './App.module.css';    

type ModuleWithDefault<T> = { default: T };
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery<MovieResponse>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    placeholderData: keepPreviousData,
    enabled: !!query, 
  });

   useEffect(() => {
    if (isSuccess && data?.results?.length === 0 && query) {
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, data, query]);

const totalPages = data ? data.total_pages : 0;

  const handleSearch = (newQuery: string) => {
    if (!newQuery.trim()) {
      toast.error('Please enter your search query.');
      return;
    }
    setQuery(newQuery);
    setPage(1); 
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" />

      {(isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage />}                
      {data && data.results.length > 0 && (
        <>
          <MovieGrid
            movies={data.results}
            onSelect={(movie) => setSelectedMovie(movie)}
          />
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default App;