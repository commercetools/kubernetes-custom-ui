import { K8sError } from '../../errors';

export default ({ k8sClient }) => {
  const service = {};

  service.find = async (params = {}) =>
    k8sClient({
      url: '/apis/batch/v1/namespaces/default/jobs',
      method: 'GET',
      qs: params,
    }).catch(err => {
      throw new K8sError(err);
    });

  return service;
};
