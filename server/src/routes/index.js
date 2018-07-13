import { Router } from 'express';
import Cronjobs from '../api/cronjobs';
import Auth from '../api/auth';

export default ({ app, container }) => {
  const router = new Router();

  const cronjobsController = container.resolve('cronjobsController');
  const authController = container.resolve('authController');
  const authLocalMiddleware = container.resolve('authLocalMiddleware');
  const authJwtMiddleware = container.resolve('authJwtMiddleware');

  // API
  app.use('/api/cronjobs', authJwtMiddleware, Cronjobs({ router, cronjobsController }));
  app.use('/api/auth', Auth({ router, authLocalMiddleware, authController }));

  // Probes
  app.use('/health', (req, res) => res.send('OK'));
  app.use('/isready', (req, res) => res.send('OK')); // Provisional until we define when to consider the server is ready

  // Here I will add the routes for serving the client static files (assets)
  // and the error routes (404) for api/assets urls
};
