const { Book } = require("../models");
const book = require("../models/book");

exports.create = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const books = await Book.findAll({ raw: true });
    res.status(200).json(books);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving books." });
  }
};

exports.findByPk = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "The book could not be found." });
    }
    res.status(200).json(book);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the book." });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, ISBN } = req.body;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: "The book could not be found." });
    }
    const updatedBookRecord = await book.update({ title, author, genre, ISBN });
    res.status(200).json(updatedBookRecord);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: "The book could not be found." });
    }
    await book.destroy();
    res.status(204).json(book);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the book." });
  }
};
