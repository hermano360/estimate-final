var express = require("express");
const path = require("path");

// Create out app

var app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "/dist")));

if (process.env.NODE_ENV !== "production") {
  const webpackMiddleware = require("webpack-dev-middleware");
  const webpack = require("webpack");
  const webpackConfig = require("./webpack.config.js");
  app.use(webpackMiddleware(webpack(webpackConfig)));
} else {
  app.use(express.static("dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist/html"));
  });
}

app.listen(PORT, () => console.log("Express server is listening on " + PORT));
