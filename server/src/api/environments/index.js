import { Router } from 'express';

export default ({ environmentsController }) => {
  const router = new Router();

  router.get('/', environmentsController.find);

  return router;
};
