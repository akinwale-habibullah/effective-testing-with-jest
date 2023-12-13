const {
  getRecipesByIngredient,
  getRecipeNutrition
} = require('../services/recipe')

const getRecipe = async (req, res) => {
  const ingredient = req.params.ingredient

  let recipes;
  try {
    recipes = await getRecipesByIngredient(ingredient)
  } catch (error) {
    return res.status(500).send(error.message)
  }
  
  const requests = [];
  if (recipes.length > 0) {
    recipes.map((recipe, index) => {
      const nutritionPromise = getRecipeNutrition(recipe.title).then((nutrition) => {
        recipe.nutrition = nutrition
      })
      requests.push(nutritionPromise)
    })

    await Promise.all(requests).then(() => {
      return res.json(recipes)
    })
  }

  return res.json(recipes)
}

module.exports = {
  getRecipe
}
