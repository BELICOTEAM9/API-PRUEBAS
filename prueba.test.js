const request = require('supertest');
const app = require('./app');

describe('Pruebas de integración del servidor Express', () => {
  // Prueba para obtener todos los usuarios
  test('Obtener todos los usuarios', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy(); // Verifica que haya algún contenido en la respuesta
  });

  // Prueba para obtener el detalle de un usuario por ID
  test('Obtener detalle de un usuario por ID', async () => {
    // Supongamos que el usuario con ID 2 existe en la base de datos
    const userId = 2;
    const response = await request(app).get(`/users/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy(); // Verifica que haya algún contenido en la respuesta
  });

  // Prueba para crear un nuevo usuario
  test('Crear un nuevo usuario', async () => {
    const newUser = { name: 'Luis', email: 'Luis@example.com' };
    const response = await request(app).post('/users').send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
  });

  // Prueba para actualizar un usuario existente
  test('Actualizar un usuario existente', async () => {
    // Supongamos que el usuario con ID 1 existe en la base de datos
    const userId = 2;
    const updatedUser = { name: 'Pedro', email: 'pedro@example.com' };
    const response = await request(app).put(`/users/${userId}`).send(updatedUser);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Usuario actualizado exitosamente');
  });

  // Prueba para eliminar un usuario existente
  test('Eliminar un usuario existente', async () => {
    // Supongamos que el usuario con ID 1 existe en la base de datos
    const userId = 7;
    const response = await request(app).delete(`/users/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Usuario eliminado exitosamente');
  });
});
