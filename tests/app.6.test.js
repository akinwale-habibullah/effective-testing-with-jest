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
      .reply( 200, nutritionList[index] );
  }
}

const mergeLists = () => {
  return pastaRecipeList.map((recipe, index) => {
    recipe.nutrition = nutritionList[index]
    return recipe
  })
}

describe.skip('app routes', () => {
  let container
  let server
  let connection

  beforeAll(async () => {
    container = await new GenericContainer('mongo')
      .withExposedPorts(27017)
      .start()
    
    const connectionString = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}/myrecipetest`
    process.env.MONGODB_URI = connectionString
    server = require('../src/app.4').server
    connection = require('../src/app.4').connection
  })
  
  beforeEach(async () => {
    await User.deleteMany({})

    nock( 'https://recipe-by-api-ninjas.p.rapidapi.com/v1' )
      .get(/recipe.*/)
      .query(true)
      .reply( 200, pastaRecipeList );
  })
  
  afterEach(() => {
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
  });

  test('recipe route, given ingredient, returns 200', async () => {
    // Arrange
    createRequestInterceptors(nock, pastaRecipeList, nutritionList)
    const searchQuery = 'pasta'

    // Act and Assert
    await request(server)
      .get(`/api/v1/recipes/${searchQuery}`)
      .set('Accept', 'application/json')
      .expect(200)
  })

  test('recipe route, given ingredient, returns list of recipes that contain nutrition data', async () => {
    // Arrange
    createRequestInterceptors(nock, pastaRecipeList, nutritionList)
    const searchQuery = 'pasta'

    // Act and Assert
    const responseData = await request(server)
      .get(`/api/v1/recipes/${searchQuery}`)
      .set('Accept', 'application/json')
      .expect(200)

    const randomIndex = Math.floor(Math.random() * responseData.body.length);
    const randomItem = responseData.body[randomIndex];
    expect(randomItem.nutrition).toBeDefined()
  })

  test('recipe route, given ingredient, returns merged list of recipe and nutrition objects', async () => {
    // Arrange
    createRequestInterceptors(nock, pastaRecipeList, nutritionList)
    const mergedLists = mergeLists();
    const searchQuery = 'pasta'

    // Act and Assert
    const responseData = await request(server)
      .get(`/api/v1/recipes/${searchQuery}`)
      .set('Accept', 'application/json')
      .expect(200)

    expect(responseData.body).toEqual(mergedLists)
  })
})
