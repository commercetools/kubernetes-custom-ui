import jwt from 'jsonwebtoken';
import { compose, omit } from 'lodash/fp';
import { NotAuthenticatedError } from '../../errors';

export default ({ passphrase, expiresIn }) => {
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

  return controller;
};
