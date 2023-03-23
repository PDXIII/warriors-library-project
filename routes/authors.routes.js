const express = require("express");
const router = express.Router();
// const Book = require("../models/Book.model");
const Author = require("../models/Author.model");

router.get("/authors/", (req, res, next) => {
  Author.find()
    .then((result) => {
      //   console.log(result);
      const data = { authors: result };
      res.render("authors/authors-list", data);
    })
    .catch((err) => {
      console.log("Error getting author list");
      console.error(err);
      next(err);
    });
});

module.exports = router;
