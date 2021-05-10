const Card = require('../models/card.js');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: err.message }));
};
