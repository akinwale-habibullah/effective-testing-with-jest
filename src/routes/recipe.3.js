const express = require('express');
const { getRecipe } = require('../controllers/recipe.3');

const router = express.Router();

router.get('/:ingredient', getRecipe);

module.exports = router;
