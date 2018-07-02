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
          url: `${selectedEnvironment.host}/api/v1/namespaces/${namespace}/pods`,
          method: 'GET',
          qs,
        });
      });

      return Promise.all(promises).then(pods => pods.reduce((previous, current) => {
        return {
          kind: previous.kind || current.kind,
          apiVersion: previous.apiVersion || current.apiVersion,
          items: [...previous.items, ...current.items],
        };
      }, { kind: '', apiVersion: '', items: [] })).catch(handleError);
    }

    throw new ValidationError('Invalid environment');
  };

  service.getLog = async (name, environment, namespace) => {
    const selectedEnvironment = environments.find(env => env.key === environment);

    if (selectedEnvironment) {
      return k8sClient({
        url: `${selectedEnvironment.host}/api/v1/namespaces/${namespace}/pods/${name}/log`,
        method: 'GET',
        json: false,
      }).catch(handleError);
    }

    throw new ValidationError('Invalid environment');
  };

  return service;
};
