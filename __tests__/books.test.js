process.env.NODE_ENV = "test";
const db = require("../db");
const request = require("supertest");
const app = ('../app')



const b1 = {
    "isbn": "0691161518",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Matthew Lane",
    "language": "english",
    "pages": 264,
    "publisher": "Princeton University Press",
    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    "year": 2017
  };
const b2 = {
    "isbn": "0312860439",
    "amazon_url": "http://a.co/B0001MC046",
    "author": "Catherine Asaro",
    "language": "english",
    "pages": 352,
    "publisher": "Tor Books",
    "title": "Catch the Lightning",
    "year": 1996
  };

beforeEach(async function () {
    await db.query("DELETE FROM books");
    await db.query(`INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) VALUES (${b1})`);
    await db.query(`INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year) VALUES (${b2})`);
});

afterEach(async function() {
    await db.query("DELETE FROM books");
});

describe("POST /books", function () {
    test("can create", async function () {
      let b = await request(app).post('/books').send({
        "isbn": "0812550234",
        "amazon_url": "http://a.co/B00AFGKJHI",
        "author": "Catherine Asaro",
        "language": "english",
        "pages": 384,
        "publisher": "Tor Books",
        "title": "Primary Inversion",
        "year": 1996
      });
  
      expect(b.body).toEqual({
        "isbn": "0812550234",
        "amazon_url": "http://a.co/B00AFGKJHI",
        "author": "Catherine Asaro",
        "language": "english",
        "pages": 384,
        "publisher": "Tor Books",
        "title": "Primary Inversion",
        "year": 1996
      });
    });
})
  
describe("GET /books/:id", function () {
    test("can get", async function () {
        let b = await request(app).get("/books/0312860439");
        expect(b.statusCode).toEqual(200);
        expect(b.body).toEqual({
            isbn: "0312860439",
            amazon_url: "http://a.co/B0001MC046",
            author: "Catherine Asaro",
            language: "english",
            pages: 352,
            publisher: "Tor Books",
            title: "Catch the Lightning",
            year: 1996
        });
    });
})
    
describe("GET /books", function () {
    test("can get all", async function () {
        let bAll = await request(app).get('/books');
        expect(bAll.statusCode).toBe(200);
        expect(bAll.body).toEqual({books: [{
            isbn: "0691161518",
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            year: 2017
          }, {
            isbn: "0312860439",
            amazon_url: "http://a.co/B0001MC046",
            author: "Catherine Asaro",
            language: "english",
            pages: 352,
            publisher: "Tor Books",
            title: "Catch the Lightning",
            year: 1996
        }]});
    });
})
  
describe("PUT /books/:isbn", function () {
    test("can update", async function () {
        let b = await request(app).put("/books/0812550234").send({
          isbn: "0812550234",
          amazon_url: "https://smile.amazon.com/Primary-Inversion-Catherine-Asaro/dp/0312857640/ref=tmm_hrd_swatch_0?_encoding=UTF8&qid=&sr=",
          author: "Catherine Asaro",
          language: "english",
          pages: 384,
          publisher: "Tor Books",
          title: "Primary Inversion",
          year: 1996
        });
    
        expect(b.body).toEqual({
          isbn: "0812550234",
          amazon_url: "https://smile.amazon.com/Primary-Inversion-Catherine-Asaro/dp/0312857640/ref=tmm_hrd_swatch_0?_encoding=UTF8&qid=&sr=",
          author: "Catherine Asaro",
          language: "english",
          pages: 384,
          publisher: "Tor Books",
          title: "Primary Inversion",
          year: 1996
        });
    });
})

describe("DELETE /books/:isbn", function () {
    test("can remove", async function () {
        let b = await request(app).delete("/books/0691161518");
        expect(b.body).toContain("Book deleted");
    });
})

afterAll(async function() {
    await db.end();
});
  