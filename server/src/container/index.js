import path from 'path';
import { createContainer, asFunction, Lifetime } from 'awilix';
import Config from '../config';
import Logger from '../logger';

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
  });

  return container;
}
