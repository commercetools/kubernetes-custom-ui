export default ({ k8sClient }) => {
  const service = {};

  service.find = async (params = {}) =>
    k8sClient({
      url: '/api/v1/namespaces/default/pods',
      method: 'GET',
      qs: params,
    });

  service.getLog = async name =>
    k8sClient({
      url: `/api/v1/namespaces/default/pods/${name}/log`,
      method: 'GET',
      json: false,
    });

  return service;
};
