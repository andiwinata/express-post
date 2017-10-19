const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const fs = require("fs");
const targetFile = "data.txt";

const appendDataToTargetFile = data => {
  fs.appendFile(targetFile, data + "\r\n", function(err) {
    if (err) throw err;
    console.log("Saved!");
  });
};

app.use(bodyParser.text());
app.use(cors());

app.get("/", function(req, res) {
  res.send("I'm sorry, only accepting POST request now :(");
});

app.post("/", function(req, res) {
  appendDataToTargetFile(req.body);
  res.send(`POST request to homepage ${req.body}`);
});

app.listen(2999, function() {
  console.log("Example app listening on port 2999!");
});
