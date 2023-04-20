const mongoose = require("mongoose");
const Models = require("./model.js");
mongoose.connect("mongodb://localhost:27017/mfDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Movies = Models.Movie;
const Users = Models.User;

const express = require("express"),
  morgan = require("morgan"),
  app = express(),
  uuid = require("uuid"),
  bodyParser = require("body-parser"),
  fs = require("fs"),
  path = require("path");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

app.use(morgan("common"));

app.get("/", (req, res) => {
  res.send("Welcome to my movieapi!");
});

//new user register || Create
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

//update user info || Create
app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//update favorite movie || Update
app.post("/users/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.MovieID },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//delete favorite movie || Delete
app.delete("/users/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: { FavoriteMovies: req.params.MovieID },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//deregister
app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//return a list of movie || Read

app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

//return a single movie || Read

app.get("/movies/:title", (req, res) => {
  // const title = req.params.title; common form below;
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("no such movie");
  }
});

//return genre || Read

app.get("/movies/genre/:genreName", (req, res) => {
  // const title = req.params.title; common form below;
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("no such genre");
  }
});

//return director || Read

app.get("/movies/directors/:directorName", (req, res) => {
  // const title = req.params.title; common form below;
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.Director.Name === directorName
  ).Director;
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("no such director");
  }
});

//error handling

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.use("/documentation", express.static("public/documentation.html"));

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
