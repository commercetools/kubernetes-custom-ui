import CronjobsController from '../cronjobs.controller';
import CronjobsService from '../cronjobs.service';
import JobsService from '../../jobs/jobs.service';
import PodsService from '../../pods/pods.service';
import { ValidationError } from '../../../errors';

describe('Cronjobs controller', () => {
  let cronjobsService;
  let jobsService;
  let podsService;
  let cronjobsController;
  let k8sClient;
  let environments;
  let req;
  let res;
  let next;

  beforeEach(() => {
    k8sClient = {};
    environments = [
      {
        key: 'test',
        name: 'test environment',
        host: 'http://test.com',
        namespaces: ['default', 'test'],
      },
    ];
    cronjobsService = CronjobsService({ k8sClient, environments });
    jobsService = JobsService({ k8sClient, environments });
    podsService = PodsService({ k8sClient, environments });
    cronjobsController = CronjobsController({ cronjobsService, jobsService, podsService });
    req = {
      query: {},
    };
    res = {
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe('when finding', () => {
    let cronjobList;
    let jobList;
    let podList;

    describe('when success', () => {
      beforeEach(async () => {
        cronjobList = {
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
        };

        jobList = {
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
            {
              metadata: {
                name: 'dummy-job-2',
                ownerReferences: [
                  {
                    name: 'dummy-cronjob-1',
                  },
                ],
              },
              status: {
                startTime: '2018-06-05T20:30:00Z',
                completionTime: '2018-06-05T20:30:30Z',
              },
            },
            {
              metadata: {
                name: 'dummy-job-3',
                ownerReferences: [
                  {
                    name: 'dummy-cronjob-2',
                  },
                ],
              },
              status: {
                startTime: '2018-06-05T20:45:00Z',
                completionTime: '2018-06-05T20:45:30Z',
              },
            },
          ],
        };

        podList = {
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
            {
              metadata: {
                name: 'dummy-pod-2',
                ownerReferences: [
                  {
                    name: 'dummy-job-2',
                  },
                ],
              },
              status: {
                phase: 'Succeeded',
              },
            },
            {
              metadata: {
                name: 'dummy-pod-3',
                ownerReferences: [
                  {
                    name: 'dummy-job-3',
                  },
                ],
              },
              status: {
                phase: 'Failed',
              },
            },
          ],
        };

        req = {
          query: {
            environment: 'test',
          },
        };

        cronjobsService.find = jest.fn().mockResolvedValue(cronjobList);
        jobsService.find = jest.fn().mockResolvedValue(jobList);
        podsService.find = jest.fn().mockResolvedValue(podList);
        Date.now = jest.fn().mockReturnValue('1982-02-11T00:00:00.000Z');

        await cronjobsController.find(req, res, next);
      });

      it('should call the cronjobsService to get the cronjob list', () =>
        expect(cronjobsService.find).toHaveBeenCalled());

      it('should call the jobsService to get the job list', () =>
        expect(jobsService.find).toHaveBeenCalled());

      it('should call the podsService to get the pod list', () =>
        expect(podsService.find).toHaveBeenCalled());

      it('should return the cronjob list', () =>
        expect(res.json).toHaveBeenCalledWith([
          {
            status: podList.items[1].status.phase,
            pod: podList.items[1].metadata.name,
            name: cronjobList.items[0].metadata.name,
            schedule: cronjobList.items[0].spec.schedule,
            latestExecution: new Date(jobList.items[1].status.startTime).toISOString(),
            completionTime: new Date(jobList.items[1].status.completionTime).toISOString(),
            executionTime: 30, // 2018-06-05T20:15:30Z - 2018-06-05T20:15:00Z
            nextExecution: '1982-02-11T00:15:00.000Z', // 15 minutes later than now
          },
          {
            status: podList.items[2].status.phase,
            pod: podList.items[2].metadata.name,
            name: cronjobList.items[1].metadata.name,
            schedule: cronjobList.items[1].spec.schedule,
            latestExecution: new Date(jobList.items[2].status.startTime).toISOString(),
            completionTime: new Date(jobList.items[2].status.completionTime).toISOString(),
            executionTime: 30, // 2018-06-05T20:30:30Z - 2018-06-05T20:30:00
            nextExecution: '1982-02-11T00:05:00.000Z', // 5 minutes later than now
          },
        ]));
    });
    describe('when errors', () => {
      describe('when the "environment" query param is not sent', () => {
        beforeEach(() => {
          cronjobsController.find(req, res, next);
        });

        it('should not return the cronjob list', () => expect(res.json).not.toHaveBeenCalled());

        it('should pass down the error', () =>
          expect(next).toHaveBeenCalledWith(new ValidationError('"environment" query param is required')));
      });
      describe('when unexpected error', () => {
        beforeEach(() => {
          req = {
            query: {
              environment: 'test',
            },
          };

          cronjobsService.find = jest
            .fn()
            .mockReturnValue(Promise.reject(new Error('Internal Server Error')));

          cronjobsController.find(req, res, next);
        });

        it('should not return the cronjob list', () => expect(res.json).not.toHaveBeenCalled());

        it('should pass down the error', () =>
          expect(next).toHaveBeenCalledWith(new Error('Internal Server Error')));
      });
    });
  });
  describe('when running manually', () => {
    beforeEach(() => {
      req = {
        body: {
          environment: 'test',
          namespace: 'test',
        },
        params: {
          name: 'dummy-cronjob-1',
        },
      };
    });

    describe('when success', () => {
      let cronjobList;

      beforeEach(async () => {
        cronjobList = {
          apiVersion: 'batch/v1beta1',
          items: [
            {
              metadata: {
                name: 'dummy-cronjob-1',
                namespace: 'default',
                labels: {
                  release: 'dummy-cronjob-1',
                },
                uid: 'dummy-uid',
              },
              spec: {
                schedule: '*/15 * * * *',
                jobTemplate: {
                  spec: {
                    containers: [{
                      image: 'dummy-image',
                    }],
                  },
                },
              },
            },
          ],
        };

        cronjobsService.find = jest.fn().mockResolvedValue(cronjobList);
        jobsService.create = jest.fn();
        Date.now = jest.fn().mockReturnValue('1000');

        await cronjobsController.run(req, res, next);
      });

      it('should call the cronjobsService to get the cronjobs list filtered by name', () =>
        expect(cronjobsService.find).toHaveBeenCalledWith({
          fieldSelector: `metadata.name=${req.params.name},metadata.namespace=${req.body.namespace}`,
          environment: req.body.environment,
        }));

      it('should create the job based on the cronjob template in the selected environment and namespace', () => {
        const expectedCronjob = cronjobList.items[0];

        expect(jobsService.create).toHaveBeenCalledWith(
          {
            metadata: {
              name: `${expectedCronjob.metadata.name}-manual-${Math.floor(Date.now() / 1000)}`,
              namespace: expectedCronjob.metadata.namespace,
              labels: expectedCronjob.metadata.labels,
              ownerReferences: [
                {
                  apiVersion: cronjobList.apiVersion,
                  kind: 'CronJob',
                  name: expectedCronjob.metadata.name,
                  uid: expectedCronjob.metadata.uid,
                },
              ],
            },
            spec: expectedCronjob.spec.jobTemplate.spec,
          },
          req.body.environment,
          req.body.namespace,
        );
      });

      it('should return "success"', () =>
        expect(res.send).toHaveBeenCalledWith('success'));
    });
    describe('when errors', () => {
      describe("when the cronjob doesn't exist", () => {
        beforeEach(async () => {
          cronjobsService.find = jest
            .fn()
            .mockResolvedValue({
              apiVersion: 'batch/v1beta1',
              items: [],
            });

          await cronjobsController.run(req, res, next);
        });

        it('should not return a successful response', () => expect(res.send).not.toHaveBeenCalledWith('success'));

        it('should pass down a ValidationError', () =>
          expect(next).toHaveBeenCalledWith(new ValidationError("the cronjob doesn't exist")));
      });
      describe('when unexpected error', () => {
        beforeEach(async () => {
          cronjobsService.find = jest
            .fn()
            .mockRejectedValue(new Error('Internal Server Error'));

          await cronjobsController.run(req, res, next);
        });

        it('should not return a successful response', () => expect(res.send).not.toHaveBeenCalledWith('success'));

        it('should pass down the error', () =>
          expect(next).toHaveBeenCalledWith(new Error('Internal Server Error')));
      });
    });
  });
});
