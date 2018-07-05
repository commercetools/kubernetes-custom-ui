import jwt from 'jsonwebtoken';
import AuthController from '../auth.controller';
import { NotAuthenticatedError } from '../../../errors';

describe('Auth controller', () => {
  let authController;
  let usersService;
  let passphrase;
  let expiresIn;
  let req;
  let res;
  let next;

  beforeEach(() => {
    passphrase = 'test';
    expiresIn = 86400; // one day in seconds
    usersService = {
      create: () => {},
    };
    authController = AuthController({ passphrase, expiresIn, usersService });
    req = {};
    res = {
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('when signing in', () => {
    describe('when getting the "sign in" response', () => {
      let user;
      let response;

      beforeEach(() => {
        user = {
          id: 'id1',
          firstName: 'javier',
          lastName: 'ortiz saorin',
          email: 'javier.ortizsaorin@commercetools.de',
          password: 'test',
        };

        response = authController.getSignInResponse(user);
      });

      it('should return the user with the password removed', () =>
        expect(response.user).toEqual({
          id: 'id1',
          firstName: 'javier',
          lastName: 'ortiz saorin',
          email: 'javier.ortizsaorin@commercetools.de',
        }));

      it('should return the JWT token with the user "id" as a token payload', () =>
        expect(response.token).toEqual(jwt.sign({ id: 'id1' }, passphrase, { expiresIn })));
    });
    describe('when success', () => {
      describe('when the user is signed in', () => {
        beforeEach(() => {
          req.user = {
            id: 'id1',
            firstName: 'javier',
            lastName: 'ortiz saorin',
            email: 'javier.ortizsaorin@commercetools.de',
            password: 'test',
          };

          authController.signIn(req, res);
        });

        it('should return the user "signed in" response', () =>
          expect(res.json).toHaveBeenCalledWith(authController.getSignInResponse(req.user)));
      });
    });
    describe('when errors', () => {
      describe('when the user is not signed in', () => {
        beforeEach(() => {
          req.user = null;

          authController.signIn(req, res, next);
        });

        it('should pass down a "NotAuthenticatedError"', () =>
          expect(next).toHaveBeenCalledWith(new NotAuthenticatedError()));
      });
    });
  });
  describe('when signing up', () => {
    describe('when success', () => {
      let newUser;

      beforeEach(async () => {
        newUser = {
          id: 'id1',
          firstName: 'dummy-name',
          lastName: 'dummy-last-name',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        };

        req.body = {
          firstName: 'dummy-name',
          lastName: 'dummy-last-name',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        };

        usersService.create = jest.fn().mockReturnValue(Promise.resolve(newUser));

        await authController.signUp(req, res);
      });

      it('should create the user', () =>
        expect(usersService.create).toHaveBeenCalledWith({
          firstName: 'dummy-name',
          lastName: 'dummy-last-name',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        }));

      it('should sign in the new user', () =>
        expect(res.json).toHaveBeenCalledWith(authController.getSignInResponse(newUser)));
    });
    describe('when errors', () => {
      describe('when the user is not signed up', () => {
        beforeEach(async () => {
          req.user = null;

          usersService.create = jest.fn().mockReturnValue(Promise.reject(new Error('error')));

          authController.signUp(req, res, next);
        });

        it('should pass down the error', () =>
          expect(next).toHaveBeenCalledWith(new Error('error')));
      });
    });
  });
});
