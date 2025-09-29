const express = require("express");
let books = require("./booksdb.js");
const Book = require("../models/books.js");
const User = require("../models/user.js");
const public_users = express.Router();

public_users.post("/register", async (req, res) => {
  console.log(req.body);

  try {
    if (!req.body.password)
      return res.status(400).json("Password is required.");
    if (!req.body.username)
      return res.status(400).json("username is required.");
    if (await User.findOne({ username: req.body.username }))
      return res.status(400).json("User already exists.");

    let user = new User(req.body);

    await user.save();
    return res.status(200).json("User created. You can now log in.");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Something went wrong, please try again.");
  }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  let books = await Book.find({}, { title: 1, author: 1, reviews: 1 }).limit(
    10
  );
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:id", async function (req, res) {
  let book = await Book.findById(req.params.id, {
    _id: 1,
    title: 1,
    author: 1,
    reviews: 1,
  });
  console.log(book);
  if (book) return res.status(200).json(book);
  else return res.status(404).json("Book not found.");
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  let books = await Book.find(
    { author: req.params.author },
    { title: 1, author: 1, reviews: 1 }
  );
  if (books) {
    return res.status(200).json(books);
  }
  return res.status(404).json(`No book found of author:${req.params.author}`);
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  let books = await Book.find(
    { title: { $regex: req.params.title, $options: "i" } },
    { title: 1, author: 1, reviews: 1 }
  );
  return res.status(200).json(books);
});

//  Get book review
public_users.get("/review/:id", async (req, res) => {
  let book = await Book.findById(req.params.id, {
    _id: 1,
    title: 1,
    author: 1,
    reviews: 1,
  });
  if (book) return res.status(200).json(book);
  else return res.status(404).json("Book not found.");
});

module.exports.general = public_users;
