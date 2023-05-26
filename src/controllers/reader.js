const { Reader } = require("../models");
const reader = require("../models/reader");

exports.create = async (req, res) => {
  try {
    const newReader = await Reader.create(req.body);
    res.status(201).json(newReader);
  } catch (error) {
    // Handle specific error cases
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ error: "Validation error: Invalid data provided." });
    }
    // Handle other error cases or generic error message
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const readers = await Reader.findAll({ raw: true });
    res.status(200).json(readers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.findByPk = async (req, res) => {
  try {
    const reader = await Reader.findByPk(req.params.id);
    if (!reader) {
      return res.status(404).json({ error: "The reader could not be found." });
    }
    res.status(200).json(reader);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const reader = await Reader.findByPk(id);
    if (!reader) {
      return res.status(404).json({ error: "The reader could not be found." });
    }
    const updatedReader = await reader.update({ name, email });
    res.status(200).json(updatedReader);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const reader = await Reader.findByPk(id);
    if (!reader) {
      return res.status(404).json({ error: "The reader could not be found." });
    }
    await reader.destroy();
    res.status(204).json(reader);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};
