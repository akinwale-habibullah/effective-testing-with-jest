const nock = require('nock')
const User = require('../src/models/user')
const request = require('supertest')
const bcrypt = require('bcrypt')
const { GenericContainer } = require('testcontainers')
const pastaRecipeList = require('./fixtures/pastaRecipeList')
const nutritionList = require('./fixtures/nutritionList')

const createRequestInterceptors = (nock, recipeList, nutritionList) => {
  for (let index = 0; index < recipeList.length; index++) {
    nock( 'https://recipe-by-api-ninjas.p.rapidapi.com/v1' )
      .get(/nutrition.*/)
      .query(true)
      .reply( 200, nutritionList[index])
  }
}

const createRequestInterceptorsWithSlowNetwork = (nock, recipeList, nutritionList) => {
  const random = Math.random() >= 0.5;

  for (let index = 0; index < recipeList.length; index++) {
    nock( 'https://recipe-by-api-ninjas.p.rapidapi.com/v1' )
      .get(/nutrition.*/)
      .query(true)
      .delayConnection(random ? 6000 : 0)   // you need to set test Timeout considering Jest tests have timeout of 5000 ms
      .reply( 200, nutritionList[index] );
  }
}

const createRequestInterceptorsWithSomeFailedRequest = (nock, recipeList, nutritionList) => {
  for (let index = 0; index < recipeList.length; index++) {
    if (index <= recipeList.length / 2) {
      nock( 'https://recipe-by-api-ninjas.p.rapidapi.com/v1' )
        .get(/nutrition.*/)
        .query(true)
        .reply( 200, nutritionList[index])
    } else {
      nock( 'https://recipe-by-api-ninjas.p.rapidapi.com/v1' )
        .get(/nutrition.*/)
        .query(true)
        .replyWithError('something awful happened')
    }
  }
}

const verifyNutritionKeyExists = (recipeList) => {
  recipeList.forEach(recipe => {
    expect(recipe.nutrition).toBeDefined()
  })
}

const mergeLists = () => {
  return pastaRecipeList.map((recipe, index) => {
    recipe.nutrition = nutritionList[index]
    return recipe
  })
}

describe('app routes - 9', () => {
  let container
  let server
  let connection

  beforeAll(async () => {
    container = await new GenericContainer('mongo')
      .withExposedPorts(27017)
      .start()
    
    const connectionString = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}/myrecipetest`
    process.env.MONGODB_URI = connectionString
    server = require('../src/app.9').server
    connection = require('../src/app.9').connection
  })
  
  beforeEach(async () => {
    await User.deleteMany({})
  })

  afterEach(async () => {
    nock.cleanAll()
  })

  afterAll(async () => {
    nock.cleanAll()
    nock.restore()

    await server.close()
    await connection.close()
    await container.stop()
  })

  test('login route, given valid login credentials json, returns 200', async () => {
    // Arrange
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('password', salt)
    const user = {
      firstName: 'First',
      middleName: 'Middle',
      lastName: 'Last',
      email: 'testuser@demo.org',
      password: hashedPassword
    }
    await new User(user).save()

    // Act and Assert
    await request(server)
      .post('/api/v1/auth/login')
      .send({
        email: 'testuser@demo.org',
        password: 'password'
      })
      .set('Accept', 'application/json')
      .expect(200)
  })

  test('login route, given incorrect login credentials json, returns 400', async () => {
    // Arrange
    const email = 'user@test.org'
    const password = 'password'
    const user = { email, password }

    // Act and Assert
    await request(server)
      .post('/api/v1/auth/login')
      .send(user)
      .set('Accept', 'application/json')
      .expect(400, {
        status: 'fail',
        message: 'Incorrect login credentials'
      })
  })

  test('signup route, given user in request body, return status 201', async () => {
    // Arrange
    const user = {
      firstName: 'First',
      middleName: 'Middle',
      lastName: 'Last',
      email: 'user@test.org',
      password: 'password'
    }

    // Act and Assert
    await request(server)
      .post('/api/v1/auth')
      .send(user)
      .set('Accept', 'application/json')
      .expect(201)
  })

  test('signup route, given user in request body, creates user in database', async () => {
    // Arrange
    const user = {
      firstName: 'First',
      middleName: 'Middle',
      lastName: 'Last',
      email: 'user@test.org',
      password: 'password'
    }

    // Act and Assert
    await request(server)
      .post('/api/v1/auth')
      .send(user)
      .set('Accept', 'application/json')

    usersInDB = await User.find({}).lean()
    expect(usersInDB.length).toEqual(1)
    expect(usersInDB[0].email).toEqual('user@test.org')
  })

  test('signup route, given an existing user with the same email, returns 400', async () => {
    // Arrange
    const user = {
      firstName: 'First',
      middleName: 'Middle',
      lastName: 'Last',
      email: 'testuser@demo.org',
      password: 'password'
    }
    await new User(user).save()

    // Act and Assert
    await request(server)
      .post('/api/v1/auth')
      .send(user)
      .set('Accept', 'application/json')
      .expect(400, {
        status: 'fail',
        message: 'Email taken.'
      })
  })

  test('recipe route, given ingredient, returns 200', async () => {
    // Arrange
    const searchQuery = 'pasta'
    nock('https://recipe-by-api-ninjas.p.rapidapi.com/v1')
      .get(/recipe.*/)
      .query(true)
      .reply( 200, pastaRecipeList );
    createRequestInterceptors(nock, pastaRecipeList, nutritionList)

    // Act and Assert
    await request(server)
      .get(`/api/v1/recipes/${searchQuery}`)
      .set('Accept', 'application/json')
      .expect(200)
  })

  test('recipe route, given ingredient, returns list of recipes that contain object with nested nutrition data', async () => {
    // Arrange
    const searchQuery = 'pasta'
    nock('https://recipe-by-api-ninjas.p.rapidapi.com/v1')
      .get(/recipe.*/)
      .query(true)
      .reply( 200, pastaRecipeList )
    createRequestInterceptors(nock, pastaRecipeList, nutritionList)

    // Act and Assert
    const response = await request(server)
      .get(`/api/v1/recipes/${searchQuery}`)
      .set('Accept', 'application/json')
      .expect(200)

    const randomIndex = Math.floor(Math.random() * response.body.length);
    const randomItem = response.body[randomIndex];
    expect(randomItem.nutrition).toBeDefined()
  })

  test('recipe route, given ingredient, returns merged list of recipe and nutrition objects', async () => {
    // Arrange
    const searchQuery = 'pasta'
    const mergedList = mergeLists()
    nock('https://recipe-by-api-ninjas.p.rapidapi.com/v1')
      .get(/recipe.*/)
      .query(true)
      .reply( 200, pastaRecipeList )
    createRequestInterceptors(nock, pastaRecipeList, nutritionList)

    // Act and Assert
    const response = await request(server)
      .get(`/api/v1/recipes/${searchQuery}`)
      .set('Accept', 'application/json')
      .expect(200)

    expect(response.body).toEqual(mergedList)
  })

  test('recipe route, given ingredient, returns merged list of recipe and nutrition objects', async () => {
    // Arrange
    const searchQuery = 'pasta'
    const mergedList = mergeLists()
    nock('https://recipe-by-api-ninjas.p.rapidapi.com/v1')
      .get(/recipe.*/)
      .query(true)
      .reply( 200, pastaRecipeList )
    createRequestInterceptors(nock, pastaRecipeList, nutritionList)

    // Act and Assert
    const response = await request(server)
      .get(`/api/v1/recipes/${searchQuery}`)
      .set('Accept', 'application/json')
      .expect(200)

    expect(response.body).toEqual(mergedList)
  })

  test('recipe route, given ingredient and a slow network, returns response containing recipes and nutrition', async () => {
    // Arrange
    const searchQuery = 'pasta'
    const mergedList = mergeLists();
    nock('https://recipe-by-api-ninjas.p.rapidapi.com/v1')
      .get(/recipe.*/)
      .query(true)
      .reply( 200, pastaRecipeList )
    createRequestInterceptorsWithSlowNetwork(nock, pastaRecipeList, nutritionList)

    // Act and Assert
    const response = await request(server)
      .get(`/api/v1/recipes/${searchQuery}`)
      .set('Accept', 'application/json')
      .expect(200)

    expect(response.body).toEqual(mergedList)
  }, 10000)

  test('recipe route, given ingredient and some failed HTTP enrichment requests, returns response containing recipes and empty nutrition array for failed requests', async () => {
    // Arrange
    const searchQuery = 'pasta'
    nock('https://recipe-by-api-ninjas.p.rapidapi.com/v1')
      .get(/recipe.*/)
      .query(true)
      .reply( 200, pastaRecipeList )
    createRequestInterceptorsWithSomeFailedRequest(nock, pastaRecipeList, nutritionList)

    // Act and Assert
    const response = await request(server)
      .get(`/api/v1/recipes/${searchQuery}`)
      .set('Accept', 'application/json')
      .expect(200)

    verifyNutritionKeyExists(response.body)
  }, 10000)
})
