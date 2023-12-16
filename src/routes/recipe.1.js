const express = require('express');
const { getRecipe } = require('../controllers/recipe.1.js');

const router = express.Router();

router.get('/:ingredient', getRecipe);

module.exports = router;
