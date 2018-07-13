import jwt from 'express-jwt';
import { NotAuthenticatedError } from '../../errors';

export default ({ passphrase }) => {
  return [
    jwt({ secret: passphrase, credentialsRequired: true }),
    (err, req, res, next) => {
      // If error, we throw our NotAuthenticatedError
      if (err) {
        return next(new NotAuthenticatedError());
      }

      return next();
    },
  ];
};
