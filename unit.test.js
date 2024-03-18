const request = require('supertest');
const app = require('./app');
const faker = require('faker');

describe('Pruebas unitarias', () => {
  it('POST /users debería crear un usuario y devolver el usuario creado', async () => {
    const newUser = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
    };
    const response = await request(app)
      .post('/users')
      .send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
  });

  it('GET /users/:id debería devolver un usuario específico si existe', async () => {
    const newUser = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
    };
    const createUserResponse = await request(app)
      .post('/users')
      .send(newUser);
    expect(createUserResponse.status).toBe(201);
    const userId = createUserResponse.body.id;
    const getUserResponse = await request(app).get(`/users/${userId}`);
    expect(getUserResponse.status).toBe(200);
    expect(getUserResponse.body).toEqual(expect.objectContaining(newUser));
  });

  it('GET /users/:id debería devolver un error 404 si el usuario no existe', async () => {
    const nonExistentUserId = faker.datatype.uuid();
    const response = await request(app).get(`/users/${nonExistentUserId}`);
    expect(response.status).toBe(404);
  });
});
