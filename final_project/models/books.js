const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  reviews: {
    type: Object,
    default: {},
  },
});

const Book = mongoose.model("Book", bookSchema, "books");

module.exports = Book;
