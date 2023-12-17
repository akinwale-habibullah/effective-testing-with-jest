const getRecipe = require('../../src/app')

test('getRecipe returns a value', () => {
  const recipes = getRecipe('pasta')

  expect(recipes.length).toBeGreaterThan(0)
})
