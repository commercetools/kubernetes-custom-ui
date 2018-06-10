import nock from 'nock';
import CronjobsService from '../cronjobs.service';
import K8sClient from '../../../k8s/client';
import { K8sError } from '../../../errors';

describe('Cronjobs service', () => {
  let cronjobsService;
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
    cronjobsService = CronjobsService({ k8sClient });
  });

  describe('when finding', () => {
    let cronjobList;

    describe('when success', () => {
      beforeEach(async () => {
        nock(k8sApiHost, {
          reqheaders: {
            authorization: 'Bearer abcdefg12345',
          },
        })
          .get('/apis/batch/v1beta1/namespaces/default/cronjobs')
          .reply(200, {
            kind: 'CronJobList',
            items: [
              {
                metadata: {
                  name: 'dummy-cronjob-1',
                },
                spec: {
                  schedule: '*/15 * * * *',
                },
              },
              {
                metadata: {
                  name: 'dummy-cronjob-2',
                },
                spec: {
                  schedule: '*/5 * * * *',
                },
              },
            ],
          });

        cronjobList = await cronjobsService.find();
      });

      it('should get the cronjob list', () =>
        expect(cronjobList).toEqual({
          kind: 'CronJobList',
          items: [
            {
              metadata: {
                name: 'dummy-cronjob-1',
              },
              spec: {
                schedule: '*/15 * * * *',
              },
            },
            {
              metadata: {
                name: 'dummy-cronjob-2',
              },
              spec: {
                schedule: '*/5 * * * *',
              },
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
          .get('/apis/batch/v1beta1/namespaces/default/cronjobs')
          .reply(500, {
            message: 'Internal Server Error',
          });
      });

      it('should throw a K8sError', async () => {
        await expect(cronjobsService.find()).rejects.toThrowError(K8sError);
      });
    });
  });
});
