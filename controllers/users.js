const User = require('../models/user.js');

const ERROR_CODE500_MESSAGE = 'Ошибка по умолчанию. Проверь код';
const ERROR_CODE400_MESSAGE = 'Переданы некорректные данные';
const ERROR_CODE404_MESSAGE_USER = 'По данному id пользователь не найден';

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: ERROR_CODE500_MESSAGE }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: ERROR_CODE400_MESSAGE });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: ERROR_CODE404_MESSAGE_USER });
      } else {
        res.status(500).send({ message: ERROR_CODE500_MESSAGE });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: ERROR_CODE400_MESSAGE });
      } else {
        res.status(500).send({ message: ERROR_CODE500_MESSAGE });
      }
    });
};

module.exports.updateInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: ERROR_CODE404_MESSAGE_USER });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: ERROR_CODE400_MESSAGE });
      } else {
        res.status(500).send({ message: ERROR_CODE500_MESSAGE });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: ERROR_CODE404_MESSAGE_USER });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: ERROR_CODE400_MESSAGE });
      } else {
        res.status(500).send({ message: ERROR_CODE500_MESSAGE });
      }
    });
};
