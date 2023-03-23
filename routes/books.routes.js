const express = require("express");
const router = express.Router();
const Book = require("../models/Book.model");
const Author = require("../models/Author.model");

/* GET home page */
router.get("/books/", (req, res, next) => {
  Book.find()
    .populate("author")
    .then((result) => {
      const data = { books: result };
      res.render("books/books-list", data);
    })
    .catch((err) => {
      console.log("Error getting book list");
      console.error(err);
      next(err);
    });
});

router.get("/books/create", (req, res, next) => {
  Author.find()
    .then((result) => {
      const data = {
        authors: result,
      };
      res.render("books/book-create", data);
    })
    .catch((err) => {
      console.log("Could not get list of authors. ", err);
      console.error(err);
    });
});

router.post("/books", (req, res, next) => {
  // console.log(req.body);

  Book.create(req.body)
    .then((result) => {
      // console.log(result);
      res.redirect("/books");
    })
    .catch((err) => {
      console.log("Could not create new book. ", err);
      console.error(err);
    });
});

// GET route to display the form to update a specific book
router.get("/books/:id/edit", (req, res, next) => {
  const data = {};
  Book.findById(req.params.id)
    .populate("author")
    .then((result) => {
      data.book = result;
      return Author.find();
    })
    .then((result) => {
      data.authors = result;
      res.render("books/book-edit.hbs", data);
    })
    .catch((err) => {
      console.log("Could not show book for update. ", err), console.error(err);
    });
});

// POST route to actually make updates on a specific book
router.post("/books/:id/edit", (req, res, next) => {
  const { title, description, author, rating } = req.body;

  Book.findByIdAndUpdate(
    req.params.id,
    { title, description, author, rating },
    { new: true, runValidators: true }
  )
    .then((updatedBook) => res.redirect(`/books/${updatedBook.id}`)) // go to the details page to see the updates
    .catch((error) => next(error));
});

// GET route fto the detail page of a specific book
router.get("/books/:id", (req, res, next) => {
  Book.findById(req.params.id)
    .populate("author")
    .then((result) => {
      const data = { book: result };
      res.render("books/book", data);
    })
    .catch((err) => {
      console.log("Error getting book details");
      console.error(err);
      next(err);
    });
});

// POST route to delete a book from the database
router.post("/books/:id/delete", (req, res, next) => {
  Book.findByIdAndDelete(req.params.id)
    .then(() => res.redirect("/books"))
    .catch((error) => next(error));
});

module.exports = router;
