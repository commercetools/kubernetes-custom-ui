export default ({ router, cronjobsController }) => {
  router.get('/', cronjobsController.find);

  return router;
};
