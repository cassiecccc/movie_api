const express = require("express"),
  morgan = require("morgan");
fs = require("fs");
path = require("path");

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
  res.json();
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
