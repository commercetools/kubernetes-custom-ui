import path from 'path';
import fs from 'fs';
import conf from 'nconf';

/*
  Config manager

  The config variables have a precedence according to the following hierarchy

  1. Environment variables
  2. Arguments
  3. ConfigFiles

  Within the config files, the environment config file overwrites the default config file.
  For example, any variable in "development.json" overwrites the values in "default.json"
*/
export default () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  const env = process.env.NODE_ENV;
  const rootPath = path.normalize(`${__dirname}/../..`);
  const storesFiles = [
    path.join(__dirname, 'env/default.json'),
    path.join(__dirname, `env/${env || 'development'}.json`),
  ];

  console.log(
    '%s - \u001b[32minfo\u001b[39m: [config] using [%s] configuration',
    new Date().toISOString(),
    env,
  );

  /*
    Makes any environment variable like "LOGGER__LEVEL=debug" to be equivalent
    to the following config file variable

    {
      LOGGER {
        LEVEL: debug
      }
    }

  */
  conf.env('__');

  conf.argv();

  // Merging config files providing readable output on start up
  let i = 1;
  storesFiles.forEach(configFile => {
    let file = configFile;

    if (file) {
      if (fs.existsSync(file)) {
        if (file.indexOf('/') !== 0) {
          file = `${rootPath}/env/${file}`;
        }
        file = path.normalize(file);
        console.log(
          '%s - \u001b[32minfo\u001b[39m: [config] using file [%s]',
          new Date().toISOString(),
          file,
        );
        try {
          if (!fs.existsSync(file)) {
            throw new Error("File doesn't exist");
          }
          const obj = {
            type: 'file',
            file,
          };
          conf.use(`z${(i += 1)}`, obj);
        } catch (e) {
          console.log(
            '%s - \u001b[31merror\u001b[39m: [config] file [%s] error [%s]',
            new Date().toISOString(),
            file,
            e.message,
          );
        }
      } else {
        console.log(
          '%s - \u001b[31mwarn\u001b[39m: [config] file [%s] not exists',
          new Date().toISOString(),
          file,
        );
      }
    }
  });

  conf.set('env', env);
  conf.set('rootPath', rootPath);

  return conf;
};
