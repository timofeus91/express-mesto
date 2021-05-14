const Card = require('../models/card.js');

const ERROR_CODE500_MESSAGE = 'Ошибка по умолчанию. Проверь код';
const ERROR_CODE400_MESSAGE = 'Переданы некорректные данные';
const ERROR_CODE404_MESSAGE_CARD = 'По данному id карточка не найдена';

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: ERROR_CODE500_MESSAGE }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: ERROR_CODE400_MESSAGE });
      } else {
        res.status(500).send({ message: ERROR_CODE500_MESSAGE });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: ERROR_CODE400_MESSAGE });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: ERROR_CODE404_MESSAGE_CARD });
      } else {
        res.status(500).res.send({ message: ERROR_CODE500_MESSAGE });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: ERROR_CODE400_MESSAGE });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: ERROR_CODE404_MESSAGE_CARD });
      } else {
        res.status(500).res.send({ message: ERROR_CODE500_MESSAGE });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: ERROR_CODE400_MESSAGE });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: ERROR_CODE404_MESSAGE_CARD });
      } else {
        res.status(500).res.send({ message: ERROR_CODE500_MESSAGE });
      }
    });
};
