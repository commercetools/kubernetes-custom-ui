import jwt from 'jsonwebtoken';
import AuthController from '../auth.controller';
import { NotAuthenticatedError } from '../../../errors';

describe('Auth controller', () => {
  let authController;
  let passphrase;
  let expiresIn;
  let req;
  let res;
  let next;

  beforeEach(() => {
    passphrase = 'test';
    expiresIn = 86400; // one day in seconds
    authController = AuthController({ passphrase, expiresIn });
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
});
