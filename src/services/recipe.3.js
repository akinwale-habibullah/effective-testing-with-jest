require('dotenv').config()
const axios = require('axios')

// Get nutrition for recipe
function getRecipeNutritionPromise (recipe) {
  let correlatedPromise = new Promise((resolve, reject) => {
    const RapidAPIKey = process.env.Rapid_API_Key
    const headers = {
      'X-RapidAPI-Key': RapidAPIKey,
      'X-RapidAPI-Host': 'recipe-by-api-ninjas.p.rapidapi.com'
    }
    const params = {
      query: recipe
    }
    axios.get(`https://recipe-by-api-ninjas.p.rapidapi.com/v1/nutrition`, { headers, params })
      .then((resp) => {
        resolve({ nutrition: resp.data, ...recipe })
      })
      .catch((error) => {
        reject(error)
      })
  });

  return correlatedPromise
}

// Dynamic Split-join
const getRecipeWithNutrition = async (ingredient) => {
  const RapidAPIKey = process.env.Rapid_API_Key
  const headers = {
    'X-RapidAPI-Key': RapidAPIKey,
    'X-RapidAPI-Host': 'recipe-by-api-ninjas.p.rapidapi.com'
  }
  const params = {
    query: ingredient
  }
  let recipeList = await axios.get(`https://recipe-by-api-ninjas.p.rapidapi.com/v1/recipe`, { headers, params })

  let recipeNutritionPromises = recipeList.data.map((recipe) => getRecipeNutritionPromise(recipe))
  
  const nutritionResponseList = await Promise.all(recipeNutritionPromises)
  return nutritionResponseList
}

module.exports = {
  getRecipeWithNutrition
}