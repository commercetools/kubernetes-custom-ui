export default () => {
  const service = {};

  // Mocking now. it will be a call to the Kubernetes API to retrieve the cronjobs
  service.listCronJobs = () =>
    Promise.resolve([
      {
        id: 'id1',
        status: 'success',
      },
      {
        id: 'id2',
        status: 'failed',
      },
    ]);

  return service;
};
