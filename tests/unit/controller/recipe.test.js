const nock = require('nock')
const { getRecipe } = require('../../../src/controllers/recipe')
const pastaRecipeList = require('../../fixtures/pastaRecipeList')

describe('getRecipesByIngredient', () => {

  beforeEach(() => {
    nock( 'https://recipe-by-api-ninjas.p.rapidapi.com/v1' )
      .get(/recipe.*/)
      .query(true)
      .reply( 200, pastaRecipeList );
  })

  afterEach(() => {
    nock.cleanAll()
  })

  afterAll(() => {
    nock.cleanAll()
    nock.restore()
  })

  test('given an ingredient, returns response', async () => {

    const mockRequest = {
      params: {
        ingredient: 'pasta'
      },
      json: jest.fn()
    }
    const mockResponse = {
      status: jest.fn().mockReturnValue({
        json: jest.fn()
      }),
      json: jest.fn()
    }

    await getRecipe(mockRequest, mockResponse)

    expect(mockResponse.json).toHaveBeenCalled()
    expect(mockResponse.json).toHaveBeenCalledWith(pastaRecipeList)
  })
})