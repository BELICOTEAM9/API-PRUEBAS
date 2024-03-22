const request = require('supertest');
const app = require('./app');

describe('Pruebas de integración del servidor Express', () => {
  // Prueba para obtener todos los usuarios
  test('Obtener todos los usuarios', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    console.log('GET /users - Estado:', response.statusCode);
  });

  // Prueba para obtener el detalle de un usuario por ID
  test('Obtener detalle de un usuario por ID', async () => {
    const userId = 2;
    const response = await request(app).get(`/users/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
    console.log(`GET /users/${userId} - Estado:`, response.statusCode);
  });

  // Prueba para crear un nuevo usuario
  test('Crear un nuevo usuario', async () => {
    const newUser = { name: 'Alberto', email: 'alberto@example.com' };
    const response = await request(app).post('/users').send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
    console.log('POST /users - Estado:', response.statusCode);
  });

  // Prueba para actualizar un usuario existente
  test('Actualizar un usuario existente', async () => {
    const userId = 3;
    const updatedUser = { name: 'Pedro', email: 'pedro@example.com' };
    const response = await request(app).put(`/users/${userId}`).send(updatedUser);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Usuario actualizado exitosamente');
    console.log(`PUT /users/${userId} - Estado:`, response.statusCode);
  });

  // Prueba para eliminar un usuario existente
  test('Eliminar un usuario existente', async () => {
    const userId = 6;
    const response = await request(app).delete(`/users/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Usuario eliminado exitosamente');
    console.log(`DELETE /users/${userId} - Estado:`, response.statusCode);
  });
});
