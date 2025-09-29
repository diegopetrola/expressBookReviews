const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const User = require("../models/user.js");
const Book = require("../models/books.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = async (username, password) => {
  // Filter the users array for any user with the same username and password
  let user = await User.findOne({ username, password });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  let user = User.findOne({ username, password }, { username: 1, _id: 1 });
  if (user) {
    let accessToken = jwt.sign(
      {
        data: user._id,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Middleware to authenticate requests to "/auth" endpoint
regd_users.use("/auth", function auth(req, res, next) {
  if (req.session.authorization) {
    let token = req.session.authorization["accessToken"];

    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

// Middleware to authenticate requests to "/auth" endpoint
regd_users.delete("/auth/review/:id", async (req, res, next) => {
  let book = await Book.findById(req.params.id);
  let user = req.session.authorization.username;
  if (book) {
    delete book.reviews[user];
    book.markModified("reviews");
    await book.save();
    return res.status(200).json("Review deleted.");
  }
  return res.status(404).json("Book not found.");
});

// Add a book review
regd_users.put("/auth/review/:id", async (req, res) => {
  let book = await Book.findById(req.params.id);
  let user = req.session.authorization.username;
  if (book) {
    book.reviews[user] = req.body.review;
    console.log(book);
    book.markModified("reviews");
    await book.save();
    return res.status(200).json("Review saved.");
  }
  return res.status(404).json("Book not found.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
