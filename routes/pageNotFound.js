const router = require('express').Router();
const NotFoundPage = require('../errors/NoUserFoundError');

// eslint-disable-next-line no-unused-vars
router.get('*', (req, res) => {
  throw new NotFoundPage('Запрашиваемый ресурс не найден');
});

// eslint-disable-next-line no-unused-vars
router.post('*', (req, res) => {
  throw new NotFoundPage('Запрашиваемый ресурс не найден');
});

module.exports = router;
