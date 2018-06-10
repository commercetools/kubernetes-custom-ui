import nock from 'nock';
import PodsService from '../pods.service';
import K8sClient from '../../../k8s/client';
import { K8sError } from '../../../errors';

describe('Pods service', () => {
  let podsService;
  let k8sClient;
  let authService;
  let k8sApiHost;

  beforeEach(() => {
    authService = {
      getAccessToken: jest
        .fn()
        .mockResolvedValue({ token: 'abcdefg12345', expires: 1528654267000 }),
    };
    k8sApiHost = 'https://k8s.api';
    k8sClient = K8sClient({ authService, host: k8sApiHost });
    podsService = PodsService({ k8sClient });
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

        podList = await podsService.find();
      });

      it('should get the pods list', () =>
        expect(podList).toEqual({
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
        await expect(podsService.find()).rejects.toThrowError(K8sError);
      });
    });
  });
  describe('when getting the log', () => {
    let logData;
    let podName;

    beforeEach(() => {
      podName = 'dummy-pod-1';
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

        logData = await podsService.getLog(podName);
      });

      it('should get the log data', () => expect(logData).toBe('This is the log data'));
    });
    describe('when errors', () => {
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
        await expect(podsService.getLog(podName)).rejects.toThrowError(K8sError);
      });
    });
  });
});
