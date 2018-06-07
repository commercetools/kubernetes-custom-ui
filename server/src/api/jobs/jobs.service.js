export default ({ k8sClient }) => {
  const service = {};

  service.find = async (params = {}) =>
    k8sClient({
      url: '/apis/batch/v1/namespaces/default/jobs',
      method: 'GET',
      qs: params,
    });

  return service;
};
