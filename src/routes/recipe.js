const express = require('express');
const { getRecipe } = require('../controllers/recipe.js');

const router = express.Router();

router.get('/:ingredient', getRecipe);

module.exports = router;
