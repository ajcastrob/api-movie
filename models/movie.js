import movies from "../movies.json" with { type: "json" };
import crypto from "node:crypto";

export class MovieModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      return movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase()),
      );
    }
    return movies;
  };

  static getById = async ({ id }) => {
    const movie = movies.find((item) => item.id === id);

    return movie;
  };

  static createMovie = async (input) => {
    const newMovie = {
      id: crypto.randomUUID(), //uuid versión 4
      ...input,
    };

    //Esto no sería REST, ya que muta el estado de la aplicación.
    movies.push(newMovie);

    return newMovie;
  };

  static modifiedMovie = async (id, result) => {
    const movieIndex = movies.findIndex((movie) => movie.id === id);

    if (movieIndex < 0) return false;

    const updateMovie = {
      ...movies[movieIndex],
      ...result,
    };

    movies[movieIndex] = updateMovie;

    return updateMovie;
  };
}
