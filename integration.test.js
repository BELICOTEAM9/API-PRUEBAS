const request = require('supertest');
const app = require('./app');

describe('Pruebas de integración', () => {
  // Prueba para GET /users/:id cuando el usuario existe
  it('GET /users/:id debería devolver un usuario específico si existe', async () => {
    // Obtener un usuario existente de la base de datos o generar uno nuevo según sea necesario
    const response = await request(app).get('/users');
    const userId = response.body[0].id; // Se asume que hay al menos un usuario en la base de datos
    const getUserResponse = await request(app).get(`/users/${userId}`);
    
    // Verificar que la respuesta sea exitosa y contenga al usuario solicitado
    expect(getUserResponse.status).toBe(200);
    expect(getUserResponse.body).toEqual(expect.objectContaining({ id: userId }));
  });

  // Prueba para GET /users/:id cuando el usuario no existe
  it('GET /users/:id debería devolver un error 404 si el usuario no existe', async () => {
    // Generar un ID de usuario que no exista
    const nonExistentUserId = faker.datatype.uuid();
    const response = await request(app).get(`/users/${nonExistentUserId}`);
    
    // Verificar que la respuesta sea un error 404
    expect(response.status).toBe(404);
  });
});

