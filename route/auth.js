const express = require('express');
//const passport = require('passport');
//const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    userId: req.body.userId, //??
  });
});

module.exports = router;
