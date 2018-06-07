import { curry } from 'lodash/fp';

export default ({ cronjobsService, jobsService, podsService }) => {
  const controller = {};

  const isChild = curry((parentName, child) => {
    if (child.metadata.ownerReferences) {
      return child.metadata.ownerReferences[0].name === parentName;
    }

    return false;
  });

  const getLatestJob = (job1, job2) =>
    (new Date(job1.status.startTime).getTime() > new Date(job2.status.startTime).getTime()
      ? job1
      : job2);

  controller.find = async (req, res, next) => {
    try {
      const [cronjobs, jobs, pods] = await Promise.all([
        cronjobsService.find(),
        jobsService.find(),
        podsService.find(),
      ]);

      return res.json(cronjobs.items.map(cronjob => {
        const latestJob = jobs.items.filter(isChild(cronjob.metadata.name)).reduce(getLatestJob);
        const latestJobPod = pods.items.filter(isChild(latestJob.metadata.name))[0];

        return {
          status: latestJobPod.status.phase,
          pod: latestJobPod.metadata.name,
          name: cronjob.metadata.name,
          schedule: cronjob.spec.schedule,
          latestExecution: latestJob.status.startTime,
          completionTime: latestJob.status.completionTime,
        };
      }));
    } catch (err) {
      next(err);
    }
  };

  return controller;
};
