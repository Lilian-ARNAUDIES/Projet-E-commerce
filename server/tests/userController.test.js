const { getUserById } = require('../controllers/userController');
const db = require('../config/db');

// Mock de la base de données
jest.mock('../config/db');

describe('getUserById', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: { id: '1' } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  it('devrait retourner un utilisateur si trouvé', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    db.query.mockResolvedValueOnce({ rows: [mockUser] });

    await getUserById(req, res, next);

    expect(res.json).toHaveBeenCalledWith(mockUser);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('devrait retourner 404 si l\'utilisateur n\'existe pas', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    await getUserById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('devrait appeler next avec une erreur en cas d\'échec SQL', async () => {
    const error = new Error('Erreur BDD');
    db.query.mockRejectedValueOnce(error);

    await getUserById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('deleteUser', () => {
    it('devrait supprimer un utilisateur et retourner un message de succès', async () => {
      const { deleteUser } = require('../controllers/userController');
      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn()
      };
      const next = jest.fn();
  
      db.query.mockResolvedValueOnce();
  
      await deleteUser(req, res, next);
  
      expect(db.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1', ['1']);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });
});

describe('createUser', () => {
    it('devrait créer un utilisateur et retourner un token', async () => {
      const { createUser } = require('../controllers/userController');
      const req = {
        body: {
          lastname: 'Doe',
          firstname: 'John',
          email: 'john@example.com',
          password: 'securepass',
          role: 'client'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();
  
      const fakeUser = {
        id: 1,
        email: 'john@example.com',
        role: 'client'
      };
  
      db.query.mockResolvedValueOnce({ rows: [fakeUser] });
  
      await createUser(req, res, next);
  
      expect(db.query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          user: fakeUser,
          token: expect.any(String)
        })
      );
    });
});