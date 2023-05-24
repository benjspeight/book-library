const { Reader } = require("../models");
const reader = require("../models/reader");

exports.create = async (req, res) => {
  const newReader = await Reader.create(req.body);
  res.status(201).json(newReader);
};

exports.findAll = async (req, res) => {
  const readers = await Reader.findAll({ raw: true });
  res.status(200).json(readers);
};

exports.findByPk = async (req, res) => {
  const reader = await Reader.findByPk(req.params.id);

  if (!reader) {
    return res.status(404).json({ error: "The reader could not be found." });
  }

  res.status(200).json(reader);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const reader = await Reader.findByPk(id);

  if (!reader) {
    return res.status(404).json({ error: "The reader could not be found." });
  }

  const updatedReader = await reader.update({ name, email });
  res.status(200).json(updatedReader);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const reader = await Reader.findByPk(id);

  if (!reader) {
    return res.status(404).json({ error: "The reader could not be found." });
  }

  await reader.destroy();
  res.status(204).json(reader);
};
