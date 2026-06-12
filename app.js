import express from "express";
import cors from "cors";
import { moviesRouter } from "./routes/movies.js";

const app = express();

const port = process.env.PORT || 1234;

app.disable("x-powered-by");

//Middleware
app.use(express.json());
app.use(cors());

app.use("/movies", moviesRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
