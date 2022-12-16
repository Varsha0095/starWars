import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-http-1e4da-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();
      // console.log(data);

      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const addMovieHandler = async (movie) => {
    try {
      const response = await fetch(
        "https://react-http-1e4da-default-rtdb.firebaseio.com/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      //fetching movie without loading and updating state
      movie.id = data.name;
      setMovies([...movies, movie]);
    } catch (error) {
      setError(error.message);
    }
  };
  const deleteMovieHandler = useCallback(async (title) => {
    let id;
    let elementToBeDeleted;
    console.log("movies before loop", movies);
    for (let i = 0; i < movies.length; i++) {
      if (movies[i].title === title) {
        elementToBeDeleted = i;
        id = movies[i].id;
        break;
      }
    }
    try {
      console.log(id, 'to be deleted')
      const response = await fetch(
        `https://react-http-1e4da-default-rtdb.firebaseio.com/movies/${id}.json`,
        {
          method: "DELETE",
          body: null,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // remove deleted element from movie array and update the state
      movies.splice(elementToBeDeleted, 1);
      setMovies([...movies]);
    } catch (error) {
      setError(error.message);
    }
  });

  // const deleteMovieHandler = async (id) => {
  //   try{ const response = await fetch(
  //     `https://react-http-1e4da-default-rtdb.firebaseio.com/movies/${id}.json`,
  //     {
  //       method: "DELETE",
  //       body: null,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   movies.splice(id, 1);
  //   setMovies([...movies])
  //   } catch(error){
  //     setError(error.message);
  //   } 
  // };

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} onDeleteMovie={deleteMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
