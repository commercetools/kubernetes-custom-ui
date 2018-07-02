import path from 'path';
import Cronjobs from '../api/cronjobs';
import Pods from '../api/pods';
import Auth from '../api/auth';
import Environments from '../api/environments';

export default ({ app, container }) => {
  const cronjobsController = container.resolve('cronjobsController');
  const podsController = container.resolve('podsController');
  const authController = container.resolve('authController');
  const authLocalMiddleware = container.resolve('authLocalMiddleware');
  const authJwtMiddleware = container.resolve('authJwtMiddleware');
  const environmentsController = container.resolve('environmentsController');

  // API
  app.use('/api/environments', authJwtMiddleware, Environments({ environmentsController }));
  app.use('/api/cronjobs', authJwtMiddleware, Cronjobs({ cronjobsController }));
  app.use('/api/pods', authJwtMiddleware, Pods({ podsController }));
  app.use('/api/auth', Auth({ authLocalMiddleware, authController }));

  // Probes
  app.use('/health', (req, res) => res.send('OK'));
  app.use('/ready', (req, res) => res.send('OK'));

  // API calls to not defined routes will return 404 error
  app.route('/api/*').get((req, res) => res.sendStatus(404));

  // All other routes should redirect to the index.html
  app.route('/*').get((req, res) => {
    res.sendFile(path.resolve(__dirname, '../../../client/dist/index.html'));
  });
};
