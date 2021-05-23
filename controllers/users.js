const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const NoUserFoundErrod = require('../errors/NoUserFoundError.js');
const AuthorizationError = require('../errors/AuthorizationError.js');
const ValidationError = require('../errors/ValidationError.js');
const ConflictError = require('../errors/ConflictError.js');
const Error500 = require('../errors/Error500.js');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      throw new Error500('Ошибка по умолчанию. Проверь код');
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные');
      } else if (err.message === 'NotFound') {
        throw new NoUserFoundErrod('По данному id пользователь не найден');
      } else {
        throw new Error500('Ошибка по умолчанию. Проверь код');
      }
    })
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные');
      } else if (err.message === 'NotFound') {
        throw new NoUserFoundErrod('По данному id пользователь не найден');
      } else {
        throw new Error500('Ошибка по умолчанию. Проверь код');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные');
      } else if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Пользователь с такими данными уже существует');
      } else {
        throw new Error500('Ошибка по умолчанию. Проверь код');
      }
    })
    .catch(next);
};

module.exports.updateInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        throw new NoUserFoundErrod('По данному id пользователь не найден');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные');
      } else if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные');
      } else {
        throw new Error500('Ошибка по умолчанию. Проверь код');
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        throw new NoUserFoundErrod('По данному id пользователь не найден');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные');
      } else if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные');
      } else {
        throw new Error500('Ошибка по умолчанию. Проверь код');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // пользователь найден
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          // хеши не совпали — отклоняем промис
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }
        return user;
      });
    })
    // аутентификация успешна
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'super-strong-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      throw new AuthorizationError('Неправильные почта или пароль');
    })
    .catch(next);
};
