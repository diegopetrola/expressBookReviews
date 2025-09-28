const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
const mongoose = require("mongoose");

require("dotenv").config();
var MongoDBStore = require("connect-mongodb-session")(session);

const app = express();

const mongoURI = process.env.MONGODB_URL;

mongoose
  .connect(mongoURI)
  .then(() => console.log("Successfully connected to MongoDB database."))
  .catch((err) => console.error("MongoDB connection error:", err));

var store = new MongoDBStore({
  uri: mongoURI,
  collection: "sessions",
  databaseName: "bookstore",
});

app.use(express.json());

app.use(
  "/customer",
  session({
    store: store,
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    let token = req.session.authorization["accessToken"];

    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next(); // Proceed to the next middleware
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
