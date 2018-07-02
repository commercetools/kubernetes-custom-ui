import path from 'path';
import { createContainer, asFunction, asValue, Lifetime } from 'awilix';
import Config from '../config';
import Logger from '../logger';
import AuthController from '../api/auth/auth.controller';
import AuthLocalMiddleware from '../authentication/middlewares/local.middleware';
import CommerceTools from '../commercetools';
import AuthJwtMiddleware from '../authentication/middlewares/jwt.middleware';
import GoogleCloudService from '../k8s/auth-services/google.cloud.service';
import constants from '../constants';
import K8sClient from '../k8s/client';

// Dependency Injection Container
export default function () {
  const container = createContainer();

  const getSingleton = (instance, injectParamsFunction) => {
    return injectParamsFunction
      ? asFunction(instance)
        .inject(injectParamsFunction)
        .singleton()
      : asFunction(instance).singleton();
  };

  const getLoggerParams = _container => {
    const config = _container.resolve('config');

    return {
      level: config.get('LOGGER:LEVEL'),
      isDisabled: Boolean(config.get('LOGGER:IS_DISABLED')),
    };
  };

  const getAuthControllerParams = _container => {
    const config = _container.resolve('config');

    return {
      passphrase: config.get('TOKEN:SECRET'),
      expiresIn: config.get('TOKEN:MAX_AGE_SECONDS')
        ? parseInt(config.get('TOKEN:MAX_AGE_SECONDS'), 10)
        : constants.DEFAULT_TOKEN_MAX_AGE_SECONDS,
      authService: _container.resolve('authService'),
    };
  };

  const getCommerceToolsParams = _container => {
    const config = _container.resolve('config');

    return {
      clientId: config.get('COMMERCE_TOOLS:CLIENT_ID'),
      clientSecret: config.get('COMMERCE_TOOLS:CLIENT_SECRET'),
      projectKey: config.get('COMMERCE_TOOLS:PROJECT_KEY'),
      host: config.get('COMMERCE_TOOLS:API_HOST'),
      oauthHost: config.get('COMMERCE_TOOLS:OAUTH_URL'),
      concurrency: config.get('COMMERCE_TOOLS:CONCURRENCY'),
    };
  };

  const getJwtMiddlewareParams = _container => {
    const config = _container.resolve('config');

    return {
      passphrase: config.get('TOKEN:SECRET'),
    };
  };

  const getK8sClientParams = _container => {
    const config = _container.resolve('config');
    const provider = config.get('KUBERNETES:PROVIDER');
    let authService;

    if (provider) {
      // Only support for Google Cloud Platform for now
      if (provider === 'GOOGLE_CLOUD') {
        authService = GoogleCloudService({
          clientEmail: config.get('KUBERNETES:PROVIDERS:GOOGLE_CLOUD:CLIENT_EMAIL'),
          privateKey: config.get('KUBERNETES:PROVIDERS:GOOGLE_CLOUD:PRIVATE_KEY'),
        });
      }
    }

    return {
      authService,
    };
  };

  const getEnvironments = _container => {
    const config = _container.resolve('config');
    const environments = config.get('KUBERNETES:ENVIRONMENTS');

    const envs = Object.entries(environments).map(([key, value]) => {
      return {
        key: key.toLowerCase(),
        name: value.LABEL,
        host: value.HOST,
        namespaces: Object.values(value.NAMESPACES),
      };
    });

    return envs;
  };

  // Registering and auto resolving the dependencies between controllers and services
  container.loadModules(
    [
      path.resolve(__dirname, '../api/**/*.controller.js'),
      path.resolve(__dirname, '../api/**/*.service.js'),
    ],
    {
      formatName: 'camelCase',
      registrationOptions: {
        lifetime: Lifetime.SINGLETON,
      },
    },
  );

  // Manual registration for those modules not auto registered
  container.register({
    config: getSingleton(Config),
    logger: getSingleton(Logger, getLoggerParams),
    commercetools: getSingleton(CommerceTools, getCommerceToolsParams),
    authController: getSingleton(AuthController, getAuthControllerParams),
    authLocalMiddleware: getSingleton(AuthLocalMiddleware),
    authJwtMiddleware: getSingleton(AuthJwtMiddleware, getJwtMiddlewareParams),
    k8sClient: getSingleton(K8sClient, getK8sClientParams),
  });

  container.register('environments', asValue(getEnvironments(container)));

  return container;
}
