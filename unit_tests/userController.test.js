const UserController = require('../controllers/userController');

describe('UserController', () => {
  let userController;
  let mockUserModel;

  beforeEach(() => {
    // Crear un mock para el modelo de usuario
    mockUserModel = {
      getUsers: jest.fn(),
      getUserById: jest.fn(),
    };

    userController = new UserController(mockUserModel);
  });

  test('getUsers should return users', async () => {
    // Simular respuesta del modelo de usuario
    mockUserModel.getUsers.mockResolvedValue([{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }]);

    const users = await userController.getUsers();
    expect(users).toEqual(expect.arrayContaining([expect.objectContaining({ id: expect.any(Number), name: expect.any(String) })]));
  });

  test('getUserById should return user with specified ID', async () => {
    // Simular respuesta del modelo de usuario
    const mockUser = { id: 1, name: 'User 1' };
    mockUserModel.getUserById.mockResolvedValue(mockUser);

    const user = await userController.getUserById(1);
    expect(user).toEqual(expect.objectContaining({ id: expect.any(Number), name: expect.any(String) }));
  });

  afterEach(() => {
    // Limpiar mocks después de cada prueba
    jest.clearAllMocks();
  });
});
