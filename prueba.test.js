const request = require('supertest');
const app = require('./server');

describe('Pruebas del servidor Express', () => {
  test('El servidor debe responder en el puerto 3000', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  test('El servidor debe responder con un mensaje de éxito', async () => {
    const response = await request(app).get('/');
    expect(response.text).toEqual('Servidor corriendo en el puerto 3000');
  });
});
