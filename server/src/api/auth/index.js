import Validator from '../../validator';
import userCreateSchema from '../users/validator-schemas/user.create.schema';

export default ({ router, authLocalMiddleware, authController }) => {
  router.post('/signin', authLocalMiddleware, authController.signIn);
  router.post('/signup', Validator(userCreateSchema), authController.signUp);

  return router;
};
