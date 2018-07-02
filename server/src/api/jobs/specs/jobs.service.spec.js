import nock from 'nock';
import JobsService from '../jobs.service';
import K8sClient from '../../../k8s/client';
import { K8sError, ValidationError } from '../../../errors';

describe('Jobs service', () => {
  let jobsService;
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
    jobsService = JobsService({ k8sClient, environments });
  });

  describe('when finding', () => {
    let jobList;

    describe('when success', () => {
      beforeEach(async () => {
        nock(k8sApiHost, {
          reqheaders: {
            authorization: 'Bearer abcdefg12345',
          },
        })
          .get('/apis/batch/v1/namespaces/default/jobs')
          .reply(200, {
            apiVersion: 'batch/v1beta1',
            kind: 'JobList',
            items: [
              {
                metadata: {
                  name: 'dummy-job-1',
                  ownerReferences: [
                    {
                      name: 'dummy-cronjob-1',
                    },
                  ],
                },
                status: {
                  startTime: '2018-06-05T20:15:00Z',
                  completionTime: '2018-06-05T20:15:30Z',
                },
              },
            ],
          });

        jobList = await jobsService.find({ environment: 'test' });
      });

      it('should get the job list', () =>
        expect(jobList).toEqual({
          apiVersion: 'batch/v1beta1',
          kind: 'JobList',
          items: [
            {
              metadata: {
                name: 'dummy-job-1',
                ownerReferences: [
                  {
                    name: 'dummy-cronjob-1',
                  },
                ],
              },
              status: {
                startTime: '2018-06-05T20:15:00Z',
                completionTime: '2018-06-05T20:15:30Z',
              },
            },
          ],
        }));
    });
    describe('when errors', () => {
      describe('when the "environment" is not sent', () => {
        it('should throw a Validation error', async () => {
          await expect(jobsService.find()).rejects.toThrowError(ValidationError);
        });
      });
      describe('when unexpected error', () => {
        beforeEach(() => {
          nock(k8sApiHost, {
            reqheaders: {
              authorization: 'Bearer abcdefg12345',
            },
          })
            .get('/apis/batch/v1/namespaces/default/jobs')
            .reply(500, {
              message: 'Internal Server Error',
            });
        });

        it('should throw a K8sError', async () => {
          await expect(jobsService.find({ environment: 'test' })).rejects.toThrowError(K8sError);
        });
      });
    });
  });
});
