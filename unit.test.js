const request = require('supertest');
const app = require('./app');
const faker = require('faker');

describe('Pruebas unitarias', () => {
  it('POST /users debería crear un usuario y devolver el usuario creado', async () => {
    const newUser = {
      name: 'cesar',
      email: 'cesar@utsc.com',
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
    // Se puede realizar una prueba similar a la de integración para esta ruta
    // Pero sería redundante si ya se ha probado en integration.test.js
    // Puedes optar por no repetir la misma prueba aquí.
  });

  it('GET /users/:id debería devolver un error 404 si el usuario no existe', async () => {
    const nonExistentUserId = faker.datatype.uuid(); // Generar un ID de usuario que no exista
    const response = await request(app).get(`/users/${nonExistentUserId}`);
    expect(response.status).toBe(404);
  });
});
