# Kubernetes Custom UI

[![Build Status](https://travis-ci.org/commercetools/kubernetes-custom-ui.svg?branch=master)](https://travis-ci.org/commercetools/kubernetes-custom-ui)

  

The Kuberntes Custom UI is a client-server application that provides a dashboard focused on non "techies" individuals, that allows to manage different entities and services of a Kubernetes cluster.

  

It includes a frontend layer developed in Vue.js and a backend layer developed in Node.js that works as an API to provide the proper data to the frontend.

  

The backend server retrieves the information from the Kubernetes cluster via the [Kubernetes API](https://kubernetes.io/docs/concepts/overview/kubernetes-api)

 You can find more detailed information of each part in the following links:

  - [Kubernetes UI Server](/server/README.md)
  - [Kubernetes UI Client](/client/README.md) 

### Architecture

![Alt text](/docs/K8s-custom-ui-architecture.png?raw=true  "Architecture")

  

The client and server are completely decoupled, thus, you can deploy only the server and use it as an API and develop your own client or frontend.

  

Or you can use the frontend side and use your own API.

  

### Build

As previously mentioned, you can build and run each part (client and server) separately.

  

For building the server side, please refer to the build section of the server documentation

  

For building the client side, please refer to the build section of the client documentation

  

### Configuration

Server and client parts can be configured separately. For more detailed documentation of how to configure each part, please check the following links:

 - [Config Kubernetes UI Server](/server/README.md#configuration)
 - [Config Kubernetes UI Client ](/client/README.md#configuration) 

### Run

  

#### Monolithic

If your goal is to run the application all together (client/server), just build the server and the client following the documentation of the [Build](#build) section.

  

Once the server and client have been built, the application has to be configured following the [Configuration](#configuration) section.

  

Finally from the root path go to the server

```bash

$ cd server

```

and run it:

  

- Development mode

  

```bash

$ npm start

```

- Production mode

  

```bash

$ npm run prod

```

#### Client and Server separately

For development is recommended to run both client and server separately in different terminals and run both in development mode. Thus, your will take advantage of hot reloading when saving your files.

  

After [building](#build) and [configuring](#configuration) both parts, run each part in a separate terminal

  

From the root path

  

- Server

```bash

$ cd server

$ npm start # starts in development mode

```

  

- Client

```bash

$ cd client

$ npm start # starts in development mode

```

  

### Docker

The project already includes a Dockerfile for building the Docker image. You will need to have Docker installed in your machine before building.

  

In order to build the image, run the following command from the root path:

```bash

$ docker build -t commercetools/kubernetes-custom-ui:latest .

```