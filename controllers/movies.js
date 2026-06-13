import { MovieModel } from "../models/movie.js";
import { validateSchema, validatePartialMovie } from "../schemas/movies.js";

export class MovieController {
  static getAll = async (req, res) => {
    const { genre } = req.query;
    const movies = await MovieModel.getAll({ genre });
    res.json(movies);
  };

  static getById = async (req, res) => {
    const { id } = req.params;

    const movie = await MovieModel.getById({ id });

    if (movie) return res.json(movie);

    res.status(404).send("<h1>Not found</h1>");
  };

  static createMovie = async (req, res) => {
    const info = req.body;
    const result = validateSchema(info);

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = await MovieModel.createMovie(result.data);

    res.status(201).json(newMovie);
  };

  static modifiedMovie = async (req, res) => {
    const { id } = req.params;
    const result = validatePartialMovie(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = await MovieModel.modifiedMovie(id, result);

    if (!newMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(201).json(newMovie);
  };
}
