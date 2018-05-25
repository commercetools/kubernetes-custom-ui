export default ({ cronjobsService }) => {
  const controller = {};

  // Currently pretty simple.
  // In the following iterations, I will add input params validation and better error handling
  controller.listCronJobs = (req, res, next) =>
    cronjobsService
      .listCronJobs()
      .then(result => res.json(result))
      .catch(next);

  return controller;
};
