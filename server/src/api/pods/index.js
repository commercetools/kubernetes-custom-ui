export default ({ router, podsController }) => {
  router.get('/:name/log', podsController.getLog);

  return router;
};
