const axios = require('axios')
const { getRecipesByIngredient, getRecipeNutrition } = require('../../src/services/recipe.1')
const pastaRecipeList = require('../fixtures/pastaRecipeList')
const recipeNutritionList = require('../fixtures/nutritionList')

jest.mock('axios')

describe('getRecipesByIngredient', () => {

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('given an ingredient, returns a list of recipes', async () => {
    const ingredient = 'pasta'
    axios.request.mockResolvedValue({
      data: pastaRecipeList
    })

    const recipes = await getRecipesByIngredient(ingredient)

    expect(axios.request).toHaveBeenCalled()
    expect(axios.request).toHaveBeenCalledTimes(1)
    expect(recipes).toEqual(pastaRecipeList)
  })

  test('getRecipeNutrition, given a recipe name, returns a list of nutrition data', async () => {
    const recipe = 'Emerald Pea Pasta'
    const recipeNutrition = recipeNutritionList[0]
    axios.request.mockResolvedValue({
      data: recipeNutrition
    })

    const recipes = await getRecipeNutrition(recipe)

    expect(axios.request).toHaveBeenCalledTimes(1)
    expect(recipes).toEqual(recipeNutrition)
  })
})
