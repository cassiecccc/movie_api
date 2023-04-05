const express = require("express"),
  morgan = require("morgan");
fs = require("fs");
path = require("path");
const bodyParser = require("body-parser"),
  methodOverride = require("method-override");

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

app.use(morgan("common"));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to my movieapi!");
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

//error handling
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
