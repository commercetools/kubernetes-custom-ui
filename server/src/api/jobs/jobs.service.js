import { K8sError, ValidationError } from '../../errors';

export default ({ k8sClient, environments }) => {
  const service = {};

  const handleError = err => {
    throw new K8sError(err);
  };

  service.find = async (params = {}) => {
    const { environment, ...qs } = params;
    const selectedEnvironment = environments.find(env => env.key === environment);

    if (selectedEnvironment) {
      const promises = selectedEnvironment.namespaces.map(namespace => {
        return k8sClient({
          url: `${selectedEnvironment.host}/apis/batch/v1/namespaces/${namespace}/jobs`,
          method: 'GET',
          qs,
        });
      });

      return Promise.all(promises).then(jobs => jobs.reduce((previous, current) => {
        return {
          kind: previous.kind || current.kind,
          apiVersion: previous.apiVersion || current.apiVersion,
          items: [...previous.items, ...current.items],
        };
      }, { kind: '', apiVersion: '', items: [] })).catch(handleError);
    }

    throw new ValidationError('Invalid environment');
  };


  service.create = async (jobDraft, environment, namespace) => {
    const selectedEnvironment = environments.find(env => env.key === environment);

    if (selectedEnvironment) {
      return k8sClient({
        url: `${selectedEnvironment.host}/apis/batch/v1/namespaces/${namespace}/jobs`,
        method: 'POST',
        body: jobDraft,
      }).catch(handleError);
    }

    throw new ValidationError('Invalid environment');
  };


  return service;
};
