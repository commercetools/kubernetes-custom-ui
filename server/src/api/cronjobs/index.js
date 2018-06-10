export default ({ router, cronjobsController }) => {
  router.get('/', cronjobsController.find);
  router.post('/:name/run', cronjobsController.run);

  return router;
};
