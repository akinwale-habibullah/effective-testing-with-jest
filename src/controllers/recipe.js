const {
  getRecipesByIngredient
} = require('../services/recipe')

const getRecipe = async (req, res) => {
  const ingredient = req.params.ingredient

  let recipes;
  try {
    recipes = await getRecipesByIngredient(ingredient)
  } catch (error) {
    return res.status(500).send(error.message)
  }

  return res.json(recipes)
}

module.exports = {
  getRecipe
}
