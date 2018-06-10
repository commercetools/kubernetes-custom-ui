import CronjobsController from '../cronjobs.controller';
import CronjobsService from '../cronjobs.service';
import JobsService from '../../jobs/jobs.service';
import PodsService from '../../pods/pods.service';

describe('Cronjobs controller', () => {
  let cronjobsService;
  let jobsService;
  let podsService;
  let cronjobsController;
  let k8sClient;
  let req;
  let res;
  let next;

  beforeEach(() => {
    k8sClient = {};
    cronjobsService = CronjobsService({ k8sClient });
    jobsService = JobsService({ k8sClient });
    podsService = PodsService({ k8sClient });
    cronjobsController = CronjobsController({ cronjobsService, jobsService, podsService });
    req = {};
    res = {
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('when finding', () => {
    let cronjobList;
    let jobList;
    let podList;

    describe('when success', () => {
      beforeEach(() => {
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

        cronjobsService.find = jest.fn().mockResolvedValue(cronjobList);
        jobsService.find = jest.fn().mockResolvedValue(jobList);
        podsService.find = jest.fn().mockResolvedValue(podList);

        cronjobsController.find(req, res, next);
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
            latestExecution: jobList.items[1].status.startTime,
            completionTime: jobList.items[1].status.completionTime,
          },
          {
            status: podList.items[2].status.phase,
            pod: podList.items[2].metadata.name,
            name: cronjobList.items[1].metadata.name,
            schedule: cronjobList.items[1].spec.schedule,
            latestExecution: jobList.items[2].status.startTime,
            completionTime: jobList.items[2].status.completionTime,
          },
        ]));
    });
    describe('when errors', () => {
      beforeEach(() => {
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
