import { ValidationError } from '../../errors';

export default ({ authService }) => {
  return (req, res, next) => {
    const { email, password } = req.body;

    if (email && password) {
      return authService
        .signIn(email, password)
        .then(user => {
          req.user = user;
          return next();
        })
        .catch(err => next(err));
    }

    return next(new ValidationError('Please provide email and password'));
  };
};
