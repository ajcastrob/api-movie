import express from "express";
import movies from "./movies.json" with { type: "json" };
import crypto from "node:crypto";
import { validateSchema, validatePartialMovie } from "./schemas/movies.js";
import cors from "cors";

const app = express();

const PORT = process.env.PORT ?? 1234;

const HOSTNAME = "localhost";

app.disable("x-powered-by");

//Middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Movies API 1.0" });
});

app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filterMovies = movies.filter((movie) =>
      movie.genre.some((item) => item.toLowerCase() === genre.toLowerCase()),
    );
    return res.json(filterMovies);
  }

  return res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const id = req.params.id;
  const movie = movies.find((item) => item.id === id);
  console.log(movie);

  if (movie) return res.json(movie);

  res.status(404).send("<h1>Not found</h1>");
});

app.post("/movies", (req, res) => {
  const info = req.body;
  const result = validateSchema(info);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(), //uuid versión 4
    ...result.data,
  };

  //Esto no sería REST, ya que muta el estado de la aplicación.
  movies.push(newMovie);

  res.status(201).json(newMovie);
});

app.patch("/movies/:id", (req, res) => {
  const { id } = req.params;
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex < 0)
    return res.status(404).json({ message: "Movie not found" });

  const updateMovie = {
    ...movies[movieIndex],
    ...result,
  };

  movies[movieIndex] = updateMovie;

  res.status(201).json(updateMovie);
});

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server listening at http://${HOSTNAME}:${PORT}`);
});
