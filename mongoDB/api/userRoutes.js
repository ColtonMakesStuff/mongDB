const { ObjectId } = require('mongoose').Types;
const { User, Post} = require('../models');
const express = require('express');
const router = express.Router();

// Create a user
router.post('/users', async (req, res) => {
  const user = new User();
  await user.createUser(req, res);
});
//get all users
router.get('/users', async (req, res) => {
  const user = new User();
  await user.getAllUsers(req, res);
});
// add to following
router.put('/users/following/:id', async (req, res) => {
  const user = new User();
  await user.addToFollowing(req, res);
});

module.exports = router;