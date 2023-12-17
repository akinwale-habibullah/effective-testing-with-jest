const axios = require('axios')
const { getRecipesByIngredient } = require('../../../src/services/recipe')
const pastaRecipeList = require('../../fixtures/pastaRecipeList')

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
    // same as
    expect(axios.request).toHaveBeenCalledTimes(1)
    expect(recipes).toEqual(pastaRecipeList)
  })

})