const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const hexValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      return helpers.message('Неправильный формат ссылки');
    }),
  }),
}), createCard);

router.delete('/cards/:cardId', hexValidation, deleteCard);

router.put('/cards/:cardId/likes', hexValidation, likeCard);

router.delete('/cards/:cardId/likes', hexValidation, dislikeCard);

module.exports = router;
