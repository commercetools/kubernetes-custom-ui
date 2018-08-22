# Kubernetes Custom UI (server)
[![Build Status](https://travis-ci.org/commercetools/kubernetes-custom-ui.svg?branch=master)](https://travis-ci.org/commercetools/kubernetes-custom-ui)

The Kuberntes Custom UI is a client-server application that provides a dashboard focused on non "techies" individuals, that allows to manage different entities and services of a Kubernetes cluster.

This documentation refers to the server part of the application which is responsible for retrieving the necessary information from the Kubernetes cluster via the [Kubernetes API](https://kubernetes.io/docs/concepts/overview/kubernetes-api) and exposing a custom REST API to provide this data.

It also creates new users and authenticates existing ones against a [commercetools](https://commercetools.com) project by using its [customers](https://docs.commercetools.com/http-api-projects-customers.html) endpoint.

### Requirements

 - [Node.js](https://nodejs.org) >= 8.x.x

### Includes

-   **[Express](http://expressjs.com)**: Web framework for Node.js
-   **commercetools**  client: Just set the credentials up in the config (explained in the config section) and run your queries using the official  [node.js sdk](https://commercetools.github.io/nodejs)
-   **Unit tests**:  [Jest](https://facebook.github.io/jest)  is already configured to run your tests and generate the coverage report
-   **Logger**: A  [Winston](https://github.com/winstonjs/winston)  logger is included and configured.
-   **Config**: The configuration is managed via  [nconf](https://github.com/indexzero/nconf)
-   **Transpiler**:  [Babel](https://babeljs.io/)  is configured with target  **node.js >= 8.x.x**  and  [stage 3 preset](https://babeljs.io/docs/plugins/preset-stage-3/)
-   **Linter**:  [ESLint](https://eslint.org/) 
-   **Formatter**:  [Prettier](https://github.com/prettier/prettier)  has been added to format the code following the ESLint rules before any commit.
-   **Validation**:  [Fastest-validator](https://github.com/icebob/fastest-validator)  library to validate the request input params

### Configuration

The configuration follows a hierarchy structure where some config mechanisms have precedence over the others.

The hierarchy is as follows:

1.  Environment variables
2.  Arguments passed to the node.js process
3.  Config files

So based on the previous hierarchy, the environment variables has precedence over the variables set in the config files 

**NOTE**: you shouldn't set any sensitive information in the config files unless you encrypt them

This template also includes config files according to the NODE_ENV value that is set when the application is running. You will find them in the `src/config` folder

-   **development.json**: Config file that is used when NODE_ENV=development. This is the default mode if NODE_ENV is not set
-   **production.json**: Config file that is used when NODE_ENV=production
-   **default.json**: Config file that is used no matter the NODE_ENV value
-  **example.json**: Template that includes all the variables than can be set


These are the environment variables to configure the server:
  

| Variable | Description | Default |
| --- | ---| ---|
| `PORT` | HTTP Port where the server is listing  | `3000` |
| `LOGGER__LEVEL` | Logging level. Possible values are the same as Winston [logging levels](https://github.com/winstonjs/winston#using-logging-levels),   | `info` |
| `TOKEN__SECRET` | Secret key to sign the JWT token for authenticating the requests. Recommended to be minimum a 256-bit key|  (Required)|
| `TOKEN__MAX_AGE_SECONDS` | Time to live of the JWT token  | `86400` (one day) |
| `COMMERCE_TOOLS__API_HOST` | commercetools API host according to [API hosts](https://docs.commercetools.com/http-api.html#hosts)   | (Required) |
| `COMMERCE_TOOLS__OAUTH_URL` |commercetools OAuth host according to [OAuth hosts](https://docs.commercetools.com/http-api-authorization.html#hosts) | (Required) |
| `COMMERCE_TOOLS__PROJECT_KEY` |commercetools project key where the users will be created and authenticated. You can create an account [here](https://admin.commercetools.com/signup) and within your account you will be able to create a new project. With the project already created, you will have access to the project credentials | (Required) |
| `COMMERCE_TOOLS__CLIENT_ID` | commercetools project client id | (Required) |
| `COMMERCE_TOOLS__CLIENT_SECRET` | commercetools project client secret | (Required) |
| `COMMERCE_TOOLS__CONCURRENCY` | the max number of concurrent requests | `10` |
| `KUBERNETES__PROVIDER` | The provider where your K8s cluster is running. Possible values are `GOOGLE_CLOUD` and `''` (localhost) | `''` (localhost) |
| `KUBERNETES__PROVIDERS__GOOGLE_CLOUD__CLIENT_EMAIL` | if your `KUBERNETES__PROVIDER` is `GOOGLE_CLOUD`, the authentication with the K8s cluster is using [service accounts](https://cloud.google.com/compute/docs/access/service-accounts). The service account includes among other credentials a `client_email`, this is the value you have to set in this config variable  | (Required if the `KUBERNETES__PROVIDER` is `GOOGLE_CLOUD`)  |
| `KUBERNETES__PROVIDERS__GOOGLE_CLOUD__PRIVATE_KEY` | if your `KUBERNETES__PROVIDER` is `GOOGLE_CLOUD`, this is the `private_key` of your service account| (Required if the `KUBERNETES__PROVIDER` is `GOOGLE_CLOUD`)  |
| `KUBERNETES__ENVIRONMENTS__<ENVIRONMENT_NAME>__LABEL` | Kubernetes Custom UI can manage several K8s clusters/environments, so in order to define the variables of each cluster/environment, just set the `<ENVIRONMENT_NAME>` (you can choose the one you prefer) and settle the necessary variables for each environment. `KUBERNETES__ENVIRONMENTS__<ENVIRONMENT_NAME>__LABEL` is the label of the cluster/environment. i.e `KUBERNETES__ENVIRONMENTS__MY_CLUSTER_STAGING__LABEL=My cluster staging` and for other cluster/environment `KUBERNETES__ENVIRONMENTS__MY_CLUSTER_PRODUCTION__LABEL=My cluster production` | `''` |
| `KUBERNETES__ENVIRONMENTS__<ENVIRONMENT_NAME>__HOST` | The IP address or host of the Kubernetes cluster. i.e `KUBERNETES__ENVIRONMENTS__MY_CLUSTER__HOST=https://192.168.1.2`  | (Required) |
| `KUBERNETES__ENVIRONMENTS__<ENVIRONMENT_NAME>__NAMESPACES__<NAMESPACE>` | Within each K8s cluster, you can manage several [namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/). Here you will define the namespaces (you can define as many as you want) that Kubernetes Custom UI will manage. i.e `KUBERNETES__ENVIRONMENTS__MY_CLUSTER__NAMESPACES__DEFAULT=default` `KUBERNETES__ENVIRONMENTS__MY_CLUSTER__NAMESPACES__OTHER_NAMESPACE=other-namespace`  | (Required) |

### Lint
The project includes  [ESLint](https://eslint.org/) to lint the code. The following command will check the if the code comply with the defined ESLint rules

```bash
$ npm run lint
``` 

### Build
The server has dependencies that needs to be installed before building and running it.

#### Install the dependencies

 - Development

```bash
$ npm install
``` 
 - Production

```bash
$ NODE_ENV=production npm install
``` 

#### Transpile
The code is written in ES6/ES7. Depending on the Node.js version you have installed, you maybe need to transpile the code to a Javascript code that can run in your environment.

```bash
$ npm run build
``` 

### Run
After [configuring](#configuration) and installing the [dependencies](#install-the-dependencies) , the server is started in:

 - **Development mode**: In this mode, you don't need to  [transpile](#transpile) the code since is done automatically. You will also benefit of hot reloading after saving any file.

```bash
$ npm start
```
 - **Production mode**:  In this mode, you will need to  [transpile](#transpile) the code before starting the server

```bash
$ npm run prod
```

#### Full example
```bash
$ npm install

$ export PORT=3000
$ export LOGGER__LEVEL=info
$ export TOKEN__SECRET=123456789abcd
$ export TOKEN__MAX_AGE_SECONDS=86400
$ export COMMERCE_TOOLS__API_HOST=https://api.sphere.io/
$ export COMMERCE_TOOLS__OAUTH_URL=https://auth.sphere.io
$ export COMMERCE_TOOLS__PROJECT_KEY=my-dummy-project
$ export COMMERCE_TOOLS__CLIENT_ID=my-dummy-client-id
$ export COMMERCE_TOOLS__CLIENT_SECRET=my-dummy-client-secret
$ export COMMERCE_TOOLS__CONCURRENCY=10
$ export KUBERNETES__PROVIDER=GOOGLE_CLOUD
$ export KUBERNETES__PROVIDERS__GOOGLE_CLOUD__CLIENT_EMAIL=my-email@account.iam.gserviceaccount.com
$ export KUBERNETES__PROVIDERS__GOOGLE_CLOUD__PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvA...... \n-----END PRIVATE KEY-----\n
$ export KUBERNETES__ENVIRONMENTS__MY_CLUSTER1__LABEL=My cluster 1
$ export KUBERNETES__ENVIRONMENTS__MY_CLUSTER1__HOST=https://192.168.1.2
$ export KUBERNETES__ENVIRONMENTS__MY_CLUSTER1__NAMESPACES__DEFAULT=default
$ export KUBERNETES__ENVIRONMENTS__MY_CLUSTER1__NAMESPACES__OTHER_NAMESPACE=other-namespace

# Other clusters/environments can be set too

# $ export KUBERNETES__ENVIRONMENTS__MY_CLUSTER2__LABEL=My cluster 2
# $ export KUBERNETES__ENVIRONMENTS__MY_CLUSTER2__HOST=https://192.168.1.3
# $ export KUBERNETES__ENVIRONMENTS__MY_CLUSTER2__NAMESPACES__DEFAULT=default
# $ ...

$ npm start
```

### Tests

To run the tests

```bash
$ npm test
```