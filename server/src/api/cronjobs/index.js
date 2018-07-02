import { Router } from 'express';

export default ({ cronjobsController }) => {
  const router = new Router();

  router.get('/', cronjobsController.find);
  router.post('/:name/run', cronjobsController.run);

  return router;
};
