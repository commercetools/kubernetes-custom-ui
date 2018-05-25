import { Router } from 'express';
import Cronjobs from '../api/cronjobs';

export default ({ app, container }) => {
  const router = new Router();

  const cronjobsController = container.resolve('cronjobsController');

  // API
  app.use('/api/cronjobs', Cronjobs({ router, cronjobsController }));

  // Probes
  app.use('/ishealthy', (req, res) => res.send('OK'));
  app.use('/isready', (req, res) => res.send('OK')); // Provisional until we define when to consider the server is ready

  // Here I will add the routes for serving the client static files (assets)
  // and the error routes (404) for api/assets urls
};
