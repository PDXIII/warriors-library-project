const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the Book model to whatever makes sense in this case
const bookSchema = new Schema(
  {
    title: String,
    description: String,
    author: String,
    rating: Number,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Book = model("Book", bookSchema);

module.exports = Book;
