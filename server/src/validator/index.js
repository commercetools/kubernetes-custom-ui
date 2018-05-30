import Validator from 'fastest-validator';
import { ValidationError } from '../errors';

// The error format will be like
//
// {
//   "message": "The 'email' field is required!, The 'password' field is required!",
//   "errors": [
//       {
//           "type": "required",
//           "field": "email",
//           "message": "The 'email' field is required!"
//       },
//       {
//           "type": "required",
//           "field": "password",
//           "message": "The 'password' field is required!"
//       }
//   ]
// }
export const generateValidationError = validationResult =>
  validationResult.reduce(
    (previous, vr) => {
      const { type, field, message } = vr;
      return {
        message: `${previous.message}${previous.message ? ', ' : ''}${vr.message}`,
        errors: [...previous.errors, { type, field, message }],
      };
    },
    { message: '', errors: [] },
  );

export default schema => (req, res, next) => {
  const validator = new Validator();
  const check = validator.compile(schema);
  const validationResult = check(req.body);

  if (validationResult === true) {
    return next();
  }

  const validationError = generateValidationError(validationResult);

  return next(new ValidationError(validationError.message, null, validationError.errors));
};
