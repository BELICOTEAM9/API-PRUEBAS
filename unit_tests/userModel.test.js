const UserModel = require('../models/userModel');

describe('UserModel', () => {
  let userModel;
  let mockDataAccessLayer;

  beforeEach(() => {
    // Crear un mock para la capa de acceso a datos
    mockDataAccessLayer = {
      getUsers: jest.fn(),
      getUserById: jest.fn(),
    };

    userModel = new UserModel(mockDataAccessLayer);
  });

  test('getUsers should return users', async () => {
    // Simular respuesta de la capa de acceso a datos
    mockDataAccessLayer.getUsers.mockResolvedValue([{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }]);

    const users = await userModel.getUsers();
    expect(users).toEqual(expect.arrayContaining([expect.objectContaining({ id: expect.any(Number), name: expect.any(String) })]));
  });

  test('getUserById should return user with specified ID', async () => {
    // Simular respuesta de la capa de acceso a datos
    const mockUser = { id: 1, name: 'User 1' };
    mockDataAccessLayer.getUserById.mockResolvedValue(mockUser);

    const user = await userModel.getUserById(1);
    expect(user).toEqual(expect.objectContaining({ id: expect.any(Number), name: expect.any(String) }));
  });

  afterEach(() => {
    // Limpiar mocks después de cada prueba
    jest.clearAllMocks();
  });
});
