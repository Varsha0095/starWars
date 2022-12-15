import React, { useState, useCallback, useEffect } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  let id;
  const fetchMoviesHandler = useCallback (async () => {
    setIsLoading(true);
    setError(null);
    try{
      const response = await fetch("https://swapi.dev/api/films");
      if(!response.ok){
        throw new Error ('Something went wrong! ...Retrying')
      }
      const data = await response.json();
  
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message)
  }
    setIsLoading(false);

  },[]);
  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler])

  if(error){
    id = setTimeout(fetchMoviesHandler, 5000);
 }
 const stopRetryHandler = useCallback(() => {
   clearTimeout(id);
   setError(null);
 },[id])
  
  let content = <p><b>No Movies Found</b></p>;
  if(movies.length > 0){
    content = <MoviesList movies={movies} />
  }
  if(error){
    content = <p>{error}</p>;
  }
  if(isLoading){
    content = <p>Loading...</p>
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        <button onClick={stopRetryHandler}>Cancel Retrying</button>
      </section>
      <section>
       {content}
      </section>
    </React.Fragment>
  );
}

export default App;
