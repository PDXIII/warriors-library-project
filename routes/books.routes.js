const express = require("express");
const router = express.Router();
const Book = require("../models/Book.model");

/* GET home page */
router.get("/books/", (req, res, next) => {
  Book.find()
    .then((booksArr) => {
      res.render("books/books-list", { books: booksArr });
    })
    .catch((err) => {
      console.log("Error getting book list");
      console.error(err);
      next(err);
    });
});

router.get("/books/create", (req, res, next) => {
  res.render("books/book-create");
});

router.post("/books", (req, res, next) => {
  // console.log(req.body);

  Book.create(req.body)
    .then((result) => {
      console.log(result);
      res.redirect("/books");
    })
    .catch((err) => {
      console.log("Could not create new book. ", err), console.error(err);
    });
});

router.get("/books/:bookId", (req, res, next) => {
  Book.findById(req.params.bookId)
    .then((result) => {
      res.render("books/book", { book: result });
    })
    .catch((err) => {
      console.log("Error getting book details");
      console.error(err);
      next(err);
    });
});

module.exports = router;
