const { expect } = require("chai");
const request = require("supertest");
const { Book } = require("../src/models");
const app = require("../src/app");

describe("/books", () => {
  before(async () => Book.sequelize.sync({ force: true }));

  beforeEach(async () => {
    await Book.destroy({ where: {} });
  });

  describe("with no records in the database", () => {
    describe("POST /books", () => {
      it("creates a new book in the database", async () => {
        const response = await request(app).post("/books").send({
          title: "Pride and Prejudice",
          author: "Jane Austen",
          genre: "Romance",
          ISBN: "9780141439518",
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal("Pride and Prejudice");
        expect(newBookRecord.title).to.equal("Pride and Prejudice");
        expect(newBookRecord.author).to.equal("Jane Austen");
        expect(newBookRecord.genre).to.equal("Romance");
        expect(newBookRecord.ISBN).to.equal("9780141439518");
      });
    });
  });

  describe("with records in the database", () => {
    let books;

    beforeEach(async () => {
      await Book.destroy({ where: {} });

      books = await Promise.all([
        Book.create({
          title: "Pride and Prejudice",
          author: "Jane Austen",
          genre: "Romance",
          ISBN: "9780141439518",
        }),
        Book.create({
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          genre: "Fiction",
          ISBN: "9780061120084",
        }),
        Book.create({
          title: "1984",
          author: "George Orwell",
          genre: "Dystopian",
          ISBN: "9780451524935",
        }),
      ]);
    });

    describe("GET /books", () => {
      it("gets all book records", async () => {
        const response = await request(app).get("/books");

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
          expect(book.genre).to.equal(expected.genre);
          expect(book.ISBN).to.equal(expected.ISBN);
        });
      });
    });

    describe("GET /books/:id", () => {
      it("gets book record by id", async () => {
        const book = books[0];
        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.author).to.equal(book.author);
        expect(response.body.genre).to.equal(book.genre);
        expect(response.body.ISBN).to.equal(book.ISBN);
      });

      it("returns a 404 if the book does not exist", async () => {
        const response = await request(app).get("/books/12345");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The book could not be found.");
      });
    });

    describe("PATCH /books/:id", () => {
      it("updates book genre by id", async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ genre: "Classic" });
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.genre).to.equal("Classic");
      });

      it("returns a 404 if the book does not exist", async () => {
        const response = await request(app)
          .patch("/books/12345")
          .send({ genre: "Mystery" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The book could not be found.");
      });
    });

    describe("DELETE /books/:id", () => {
      it("deletes book record by id", async () => {
        const book = books[0];
        const response = await request(app).delete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it("returns a 404 if the book does not exist", async () => {
        const response = await request(app).delete("/books/12345");
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The book could not be found.");
      });
    });
  });
});
