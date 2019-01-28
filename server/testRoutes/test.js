const express = require("express");
const Router = express.Router();

Router.get("/", (req, res, next) => {
  res.status(200).send("respond with a resource");
});

module.exports = Router;
