const request = require('supertest');
const http = require('http');
const { app, addUser, addBook, addReview, validateUser, validateBook, validateReview } = require('../index');


jest.mock("../index", () => ({
  ...jest.requireActual("../index"),
  addUser: jest.fn(),
  addBook: jest.fn(),
  addReview: jest.fn(),
  validateUser: jest.fn((user) => {
    if (!user.name || typeof user.name !== 'string') {
      return 'Name is required and should be a string.';
    } else if (!user.email || typeof user.email !== 'string') {
      return 'Email is required and should be a string.';
    }
    return null;
  }),
  validateBook: jest.fn((book) => {
    if (! book.title || typeof book.title !== "string") {
      return "Title is required and should be a string."
    } else if (! book.author || typeof book.author !== "string") {
      return "Author is required and should be a string."
    } else {
      return null;
    }
  }),
  validateReview: jest.fn((review) => {
    if ( ! review.content || typeof review.content !== "string") {
      return "Content is required and should be a string";
    } else if (! review.userId || typeof review.userId !== "number") {
      return "UserId required and should be a number"
    } else {
      return null;
    }
  }),
}));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe('API Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
// Exercise 4: Test add a new user with valid input
  it('POST /api/users should add a new user with valid input', async () => {
    const addedUser = { id: 1, name: 'Alice', email: 'alice@example.com' };
    addUser.mockResolvedValue(addedUser);

    const result = await request(server)
      .post('/api/users')
      .send({ name: 'Alice', email: 'alice@example.com' });

    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(addedUser);
  });
  // Exercise 5: Test add a new user with invalid input
  it("POST API /api/users should return 404 for invalid input", async () => {
    let result = await request(server).post("/api/users").send({ name: "Alice "});
    expect(result.statusCode).toEqual(400);
    expect(result.text).toEqual('Email is required and should be a string.');
  });
  // Exercise 6: Test add a new book with valid input
  it("POST API /api/books should add new book and return status code as 201", async () => {
    let addedBook = { id: 1,  title: "Moby Dick", author: "Herman Melville"};
    addBook.mockResolvedValue(addedBook);
    let result = await request(server).post("/api/books").send({ title: "Moby Dick", author: "Herman Melville" });
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(addedBook);
  });
  // Exercise 7: Test add a new book with invalid input
  it("POST API /api/books should return 404 for invalid input", async () => {
    let result = await request(server).post("/api/books").send({ title: "Moby Dick" });
    expect(result.statusCode).toEqual(400);
    expect(result.text).toEqual("Author is required and should be a string.");
  });
  // Exercise 8: Test add a new review with valid input
  it("POST API /api/reviews should add new review and return status code as 201", async () => {
    let addedReview = { id: 1, content: "Great Book!", userId: 1};
    addReview.mockResolvedValue(addedReview);
    let result = await request(server).post("/api/reviews").send({ content: "Great Book!", userId: 1 });
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(addedReview);
  });
  // Exercise 9: Test add a new review with invalid input
  it("POST API /api/reviews should return 400 for invalid input", async () => {
    let result = await request(server).post("/api/reviews").send({  content: "Great Book!" });
    expect(result.statusCode).toEqual(400);
    expect(result.text).toEqual("UserId required and should be a number");
  });
});
describe("Validation Functions Testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Exercise 10: Test user validation function
  it("validateUser function should validate input correctly", () => {
    expect(validateUser({ name: 'Alice', email: 'alice@example.com' })).toBeNull();
    expect(validateUser({name: 'Alice'})).toEqual("Email is required and should be a string.");
    expect(validateUser({email: 'alice@example.com'})).toEqual("Name is required and should be a string.");
  });
  // Exercise 11: Test book validation function.
  it("validateBook function should validate book input correctly", () => {
    expect(validateBook({title: "Moby Dick", author: "Herman Melville"})).toBeNull();
    expect(validateBook({author: "Herman Melville"})).toEqual("Title is required and should be a string.");
    expect(validateBook({title: "Moby Dick"})).toEqual("Author is required and should be a string.");
  });
  // Exercise 12: Test review validation function
  it("validateReview function should validate review input correctly", () => {
    expect(validateReview({content: "Great Book!", userId: 1})).toBeNull();
    expect(validateReview({userId: 1})).toEqual("Content is required and should be a string");
    expect(validateReview({content: "Great Book!"})).toEqual("UserId required and should be a number");
  });
});