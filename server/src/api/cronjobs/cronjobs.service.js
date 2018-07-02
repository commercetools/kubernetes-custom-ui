import { K8sError, ValidationError } from '../../errors';

export default ({ k8sClient, environments }) => {
  const service = {};

  service.find = async (params = {}) => {
    const { environment, ...qs } = params;
    const selectedEnvironment = environments.find(env => env.key === environment);

    if (selectedEnvironment) {
      const promises = selectedEnvironment.namespaces.map(namespace => {
        return k8sClient({
          url: `${selectedEnvironment.host}/apis/batch/v1beta1/namespaces/${namespace}/cronjobs`,
          method: 'GET',
          qs,
        });
      });

      return Promise.all(promises).then(cronjobs => cronjobs.reduce((previous, current) => {
        return {
          kind: previous.kind || current.kind,
          apiVersion: previous.apiVersion || current.apiVersion,
          items: [...previous.items, ...current.items],
        };
      }, { kind: '', apiVersion: '', items: [] })).catch(err => {
        throw new K8sError(err);
      });
    }

    throw new ValidationError('Invalid environment');
  };


  return service;
};
