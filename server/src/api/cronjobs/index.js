export default ({ router, cronjobsController }) => {
  router.get('/', cronjobsController.listCronJobs);

  return router;
};
