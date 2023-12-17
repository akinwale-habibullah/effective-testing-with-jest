const User = require('../../src/models/user')
const request = require('supertest')
const bcrypt = require('bcrypt')
const { GenericContainer } = require('testcontainers')

describe.skip('login route - 5', () => {
  let container
  let server
  let connection

  beforeAll(async () => {
    container = await new GenericContainer('mongo')
      .withExposedPorts(27017)
      .start()

    const connectionString = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}/myrecipetest`
    process.env.MONGODB_URI = connectionString
    server = require('../../src/app.5').server
    connection = require('../../src/app.5').connection
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  afterAll(async () => {
    await server.close()
    await connection.close()
    await container.stop()
  })

  test('given valid login credentials json, returns 200', async () => {
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

  test('given incorrect login credentials json, returns 400', async () => {
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
})
