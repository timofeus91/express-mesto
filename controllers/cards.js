/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable indent */
const Card = require('../models/card.js');

const NoCardFoundError = require('../errors/NoCardFoundError.js');
const ValidationError = require('../errors/ValidationError.js');
const Error500 = require('../errors/Error500.js');
const NoRightError = require('../errors/NoRightError.js');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      throw new Error500('Ошибка по умолчанию. Проверь код');
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NoCardFoundError('По данному id карточка не найдена');
      } else {
        throw new Error500('Ошибка по умолчанию. Проверь код');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NoCardFoundError('По данному id карточка не найдена');
      } else if (card.owner.toString() !== req.user._id) {
        throw new NoRightError('Нет прав на удаление чужой карточки');
      }

      Card.findByIdAndRemove(req.params.id)
      .then((card) => res.status(200).send(card))
      .catch((err) => {
        if (err.name === 'CastError') {
          throw new ValidationError('Переданы некорректные данные');
        } else {
          throw new Error500('Ошибка по умолчанию. Проверь код');
        }
      })
      .catch(next);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные');
      } else if (err.message === 'NotFound') {
        throw new NoCardFoundError('По данному id карточка не найдена');
      } else {
        throw new Error500('Ошибка по умолчанию. Проверь код');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные');
      } else if (err.message === 'NotFound') {
        throw new NoCardFoundError('По данному id карточка не найдена');
      } else {
        throw new Error500('Ошибка по умолчанию. Проверь код');
      }
    })
    .catch(next);
};
