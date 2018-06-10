import { K8sError } from '../../errors';

export default ({ k8sClient }) => {
  const service = {};

  const handleError = err => {
    throw new K8sError(err);
  };

  service.find = async (params = {}) =>
    k8sClient({
      url: '/api/v1/namespaces/default/pods',
      method: 'GET',
      qs: params,
    }).catch(handleError);

  service.getLog = async name =>
    k8sClient({
      url: `/api/v1/namespaces/default/pods/${name}/log`,
      method: 'GET',
      json: false,
    }).catch(handleError);

  return service;
};
