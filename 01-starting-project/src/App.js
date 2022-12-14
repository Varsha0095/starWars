import React, { useCallback, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  let id;
  
  const fetchMoviesHandler = async () => {
    setIsLoading(true);
    setError(null);
    try{
      const response = await fetch("https://swapi.dev/api/films/");
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
};
    if(error){
       id = setTimeout(fetchMoviesHandler, 5000);
    }
    const stopRetryingHandler = useCallback(() => {
      clearTimeout(id);
      setError(null);
    },[id])

    let content = <p>No Movies Found</p>

    if(movies.length > 0) {
      content = <MoviesList movies={movies} />
    }
    if(error){
      content = <h4>{error}</h4>
    }

    if(isLoading){
      content = <p><b>Loading...</b></p>
    }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        <button onClick={stopRetryingHandler}>Cancel Retrying</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
