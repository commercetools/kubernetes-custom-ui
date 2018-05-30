import jwt from 'jsonwebtoken';
import { compose, omit } from 'lodash/fp';
import { NotAuthenticatedError } from '../../errors';

export default ({ passphrase, expiresIn, usersService }) => {
  const controller = {};

  const getTokenPayload = user => ({ id: user.id });

  const getToken = payload => jwt.sign(payload, passphrase, { expiresIn });

  controller.getSignInResponse = user => {
    const userWithoutPassword = omit('password')(user);

    return {
      user: userWithoutPassword,
      token: compose(getToken, getTokenPayload)(userWithoutPassword),
    };
  };

  controller.signIn = (req, res, next) => {
    if (req.user) {
      return res.json(controller.getSignInResponse(req.user));
    }

    return next(new NotAuthenticatedError());
  };

  controller.signUp = (req, res, next) =>
    usersService
      .create(req.body)
      .then(user => res.json(controller.getSignInResponse(user)))
      .catch(next);

  return controller;
};
