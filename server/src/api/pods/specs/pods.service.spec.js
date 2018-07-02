import nock from 'nock';
import PodsService from '../pods.service';
import K8sClient from '../../../k8s/client';
import { K8sError, ValidationError } from '../../../errors';

describe('Pods service', () => {
  let podsService;
  let k8sClient;
  let authService;
  let k8sApiHost;
  let environments;

  beforeEach(() => {
    k8sApiHost = 'https://k8s.api';
    environments = [
      {
        key: 'test',
        name: 'test environment',
        host: k8sApiHost,
        namespaces: ['default'],
      },
    ];
    authService = {
      getAccessToken: jest
        .fn()
        .mockResolvedValue({ token: 'abcdefg12345', expires: 1528654267000 }),
    };
    k8sClient = K8sClient({ authService, host: k8sApiHost });
    podsService = PodsService({ k8sClient, environments });
  });

  describe('when finding', () => {
    let podList;

    describe('when success', () => {
      beforeEach(async () => {
        nock(k8sApiHost, {
          reqheaders: {
            authorization: 'Bearer abcdefg12345',
          },
        })
          .get('/api/v1/namespaces/default/pods')
          .reply(200, {
            apiVersion: 'batch/v1beta1',
            kind: 'PodList',
            items: [
              {
                metadata: {
                  name: 'dummy-pod-1',
                  ownerReferences: [
                    {
                      name: 'dummy-job-1',
                    },
                  ],
                },
                phase: 'Succeeded',
              },
            ],
          });

        podList = await podsService.find({ environment: 'test' });
      });

      it('should get the pods list', () =>
        expect(podList).toEqual({
          apiVersion: 'batch/v1beta1',
          kind: 'PodList',
          items: [
            {
              metadata: {
                name: 'dummy-pod-1',
                ownerReferences: [
                  {
                    name: 'dummy-job-1',
                  },
                ],
              },
              phase: 'Succeeded',
            },
          ],
        }));
    });
    describe('when errors', () => {
      describe('when the "environment" is not sent', () => {
        it('should throw a Validation error', async () => {
          await expect(podsService.find()).rejects.toThrowError(ValidationError);
        });
      });
      describe('when unexpected error', () => {
        beforeEach(() => {
          nock(k8sApiHost, {
            reqheaders: {
              authorization: 'Bearer abcdefg12345',
            },
          })
            .get('/api/v1/namespaces/default/pods')
            .reply(500, {
              message: 'Internal Server Error',
            });
        });

        it('should throw a K8sError', async () => {
          await expect(podsService.find({ environment: 'test' })).rejects.toThrowError(K8sError);
        });
      });
    });
  });
  describe('when getting the log', () => {
    let logData;
    let podName;
    let environment;
    let namespace;

    beforeEach(() => {
      podName = 'dummy-pod-1';
      environment = 'test';
      namespace = 'default';
    });

    describe('when success', () => {
      beforeEach(async () => {
        nock(k8sApiHost, {
          reqheaders: {
            authorization: 'Bearer abcdefg12345',
          },
        })
          .get(`/api/v1/namespaces/default/pods/${podName}/log`)
          .reply(200, 'This is the log data');

        logData = await podsService.getLog(podName, environment, namespace);
      });

      it('should get the log data', () => expect(logData).toBe('This is the log data'));
    });
    describe('when errors', () => {
      describe('when the "environment" is not sent', () => {
        it('should throw a Validation error', async () => {
          await expect(podsService.find()).rejects.toThrowError(ValidationError);
        });
      });
      describe('when unexpected error', () => {
        beforeEach(() => {
          nock(k8sApiHost, {
            reqheaders: {
              authorization: 'Bearer abcdefg12345',
            },
          })
            .get(`/api/v1/namespaces/default/pods/${podName}/log`)
            .reply(500, {
              message: 'Internal Server Error',
            });
        });

        it('should throw a K8sError', async () => {
          await expect(podsService.getLog(podName, environment, namespace))
            .rejects
            .toThrowError(K8sError);
        });
      });
    });
  });
});
