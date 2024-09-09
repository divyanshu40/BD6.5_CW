let express = require("express");
let app = express();
app.use(express.json());

let users = [];
let books = [];
let reviews = [];
// function to add new user.
async function addUser(newUserData) {
  let addedUser = { id: users.length + 1, ...newUserData};
  users.push(addedUser);
  return addedUser;
}
// function to add new book.
async function addBook(newBookData) {
  let addedBook = { id: books.length + 1, ...newBookData };
  books.push(addedBook);
  return addedBook;
}
// function to add new review.
async function addReview(newReviewData) {
  let addedReview = { id: reviews.length + 1, ...newReviewData };
  reviews.push(addedReview);
  return addedReview;
}

// validation function for adding new user
function validateUser(user) {
  if (! user.name || typeof user.name !== "string") {
    return "Name is required and should be a string."
  } else if (! user.email || typeof user.email !== "string") {
    return "Email is required and should be a string."
  } else {
    return null;
  }
}
// validation function for adding new book
function validateBook(book) {
if (! book.title || typeof book.title !== "string") {
  return "Title is required and should be a string."
} else if (! book.author || typeof book.author !== "string") {
  return "Author is required and should be a string."
} else {
  return null;
}
}
// validation function to add new review.
function validateReview(review) {
  if ( ! review.content || typeof review.content !== "string") {
    return "Content is required and should be a string";
  } else if (! review.userId || typeof review.userId !== "number") {
    return "UserId required and should be a number"
  } else {
    return null;
  }
}

// Exercise 1: Add a New User
app.post("/api/users", async (req, res) => {
  let newUserData = req.body;
  try {
    let error = validateUser(newUserData);
  if (error) {
    return res.status(400).send(error);
  }
  let result = await addUser(newUserData);
  res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: "Internal server error"});
  }
  });
  // Exercise 2: Add a New Book
  app.post("/api/books", async (req, res) => {
    let newBookData = req.body;
    try {
      let error = validateBook(newBookData);
      if (error) {
        return res.status(400).send(error);
      }
      let result = await addBook(newBookData);
      return res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal server error"});
    }
  }) ;
  // Exercise 3: Add a New Review
  app.post("/api/reviews", async (req, res) => {
    let newReviewData = req.body;
    try {
      let error = validateReview(newReviewData);
      if (error) {
        return res.status(400).send(error);
      }
      let result = await addReview(newReviewData);
      return res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal server error"});
    }
  });
  module.exports = { app, addUser, addBook, addReview, validateUser, validateBook, validateReview };