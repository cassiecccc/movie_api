const express = require("express"),
  morgan = require("morgan");
fs = require("fs");
path = require("path");

let topMovies = [
  {
    title: "Se7en",
    director: "David Fincher",
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
  },
  {
    title: "Reservoir Dogs",
    director: "Quentin Tarantino",
  },
  {
    title: "Fight Club",
    director: "David Fincher",
  },
  {
    title: "Her",
    director: "Spike Jonze",
  },
  {
    title: "Catch Me If You Can",
    director: "Steven Spielberg",
  },
  {
    title: "Identity",
    director: "James Mangold",
  },
  {
    title: "Shutter Island",
    director: "Martin Scorsese",
  },
  {
    title: "A Beautiful Mind",
    director: "Ron Howard",
  },
  {
    title: "The Legend of 1900",
    director: "Giuseppe Tornatore",
  },
  {
    title: "The Best Offer",
    director: "Giuseppe Tornatore",
  },
  {
    title: "Cinema Paradiso",
    director: "Giuseppe Tornatore",
  },
  {
    title: "The Invisible Guest",
    director: "Oriol Paulo",
  },
  {
    title: "American Psycho",
    director: "Mary Harron",
  },
];
const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

app.use(morgan("common"));

app.get("/", (req, res) => {
  res.send("Welcome to my movieapi!");
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

//error handling

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.use(express.static("public"));

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
