const router = require('express').Router();

const {
  getUsers, getUser, updateInfo, updateAvatar, getUserMe,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.patch('/users/me', getUserMe);
router.patch('/users/me', updateInfo);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
