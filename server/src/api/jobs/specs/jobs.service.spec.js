import nock from 'nock';
import JobsService from '../jobs.service';
import K8sClient from '../../../k8s/client';
import { K8sError } from '../../../errors';

describe('Jobs service', () => {
  let jobsService;
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
    jobsService = JobsService({ k8sClient });
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

        jobList = await jobsService.find();
      });

      it('should get the job list', () =>
        expect(jobList).toEqual({
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
        await expect(jobsService.find()).rejects.toThrowError(K8sError);
      });
    });
  });
});
