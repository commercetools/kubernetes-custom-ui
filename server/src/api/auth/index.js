import { Router } from 'express';
import Validator from '../../validator';
import userCreateSchema from '../users/validator-schemas/user.create.schema';

export default ({ authLocalMiddleware, authController }) => {
  const router = new Router();

  router.post('/signin', authLocalMiddleware, authController.signIn);
  router.post('/signup', Validator(userCreateSchema), authController.signUp);

  return router;
};
