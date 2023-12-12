require('dotenv').config()
const axios = require('axios')

const getRecipesByIngredient = async (ingredient) => {
  const RapidAPIKey = process.env.Rapid_API_Key
  const options = {
    method: 'GET',
    url: 'https://recipe-by-api-ninjas.p.rapidapi.com/v1/recipe',
    params: {
      query: ingredient
    },
    headers: {
      'X-RapidAPI-Key': RapidAPIKey,
      'X-RapidAPI-Host': 'recipe-by-api-ninjas.p.rapidapi.com'
    }
  }

  let response;
  try {
    response = await axios.request(options);
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  return response.data;
}

const getRecipeNutrition  = async (recipe) => {
  const RapidAPIKey = process.env.Rapid_API_Key
  const options = {
    method: 'GET',
    url: 'https://recipe-by-api-ninjas.p.rapidapi.com/v1/nutrition',
    params: {
      query: recipe
    },
    headers: {
      'X-RapidAPI-Key': RapidAPIKey,
      'X-RapidAPI-Host': 'recipe-by-api-ninjas.p.rapidapi.com'
    }
  };

  let response;
  try {
    response = await axios.request(options);
  } catch (error) {
    console.error(error.message);
    return [];
  }

  return response.data;
}

module.exports = {
  getRecipesByIngredient,
  getRecipeNutrition
}