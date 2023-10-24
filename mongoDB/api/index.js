const { ObjectId } = require('mongoose').Types;
const { User, Thought} = require('../models');

const express = require('express');
const router = express.Router();

// Thought routes
router.route('/thoughts')
  .post(async (req, res) => { await Thought.createThought(req, res); })
  .get(async (req, res) => { await Thought.getAllThoughts(req, res); });

router.route('/thoughts/:id')
  .get(async (req, res) => { await Thought.getThoughtById(req, res); })
  .put(async (req, res) => { await Thought.updateThought(req, res); })
  .delete(async (req, res) => { await Thought.deleteThought(req, res); });

// Reaction routes
router.route('/reactions')
  .put(async (req, res) => { await Thought.createReaction(req, res); })
  .get(async (req, res) => { await Thought.getAllReactions(req, res); });

router.route('/reactions/:id')
  .delete(async (req, res) => { await Thought.deleteReaction(req, res); });

// User routes
router.route('/users')
  .post(async (req, res) => { await User.createUser(req, res); })
  .get(async (req, res) => { await User.getAllUsers(req, res); });

router.route('/users/:id')
  .put(async (req, res) => { await User.addToFollowing(req, res); });

module.exports = router;
