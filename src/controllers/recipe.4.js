const { getRecipeWithNutrition } = require('../services/recipe.4.js')

const getRecipe = async (req, res) => {
  const ingredient = req.params.ingredient

  let recipes;
  try {
    recipes = await getRecipeWithNutrition(ingredient)
  } catch (error) {
    return res.status(500).send(error.message)
  }

  return res.json(recipes)
}

module.exports = {
  getRecipe
}
