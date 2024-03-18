const request = require('supertest');
const app = require('./app');

describe('Pruebas de integración', () => {
  // Prueba para GET /users/:id cuando el usuario existe
  it('GET /users/:id debería devolver un usuario específico si existe', async () => {
    // Realizar una solicitud GET a la ruta /users para obtener un usuario existente
    const responseAllUsers = await request(app).get('/users');
    const userId = responseAllUsers.body[0].id; // Se asume que hay al menos un usuario en la base de datos
    const getUserResponse = await request(app).get(`/users/${userId}`);
    
    // Verificar que la respuesta sea exitosa y contenga al usuario solicitado
    expect(getUserResponse.status).toBe(200);
    expect(getUserResponse.body).toEqual(expect.objectContaining({ id: userId }));
  });

  // Prueba para GET /users/:id cuando el usuario no existe
  it('GET /users/:id debería devolver un error 404 si el usuario no existe', async () => {
    // Generar un ID de usuario que no exista
    const nonExistentUserId = '00000000-0000-0000-0000-000000000000';
    const response = await request(app).get(`/users/${nonExistentUserId}`);
    
    // Verificar que la respuesta sea un error 404
    expect(response.status).toBe(404);
  });
});
