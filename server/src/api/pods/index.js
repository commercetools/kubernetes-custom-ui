import { Router } from 'express';

export default ({ podsController }) => {
  const router = new Router();

  router.get('/:name/log', podsController.getLog);

  return router;
};
