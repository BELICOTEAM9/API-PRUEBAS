const request = require('supertest');
const app = require('./app');

describe('Pruebas de integración', () => {
  it('GET /users debería devolver un array de usuarios', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET /users/:id debería devolver un usuario específico si existe', async () => {
 
  });

  it('GET /users/:id debería devolver un error 404 si el usuario no existe', async () => {
  
  });

});
