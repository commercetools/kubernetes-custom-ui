import { curry, compose, map, orderBy } from 'lodash/fp';
import cronParser from 'cron-parser';
import { ValidationError } from '../../errors';

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

  const getJobDraftFromCronjob = (cronjob, apiVersion) => {
    return {
      metadata: {
        name: `${cronjob.metadata.name}-manual-${Math.floor(Date.now() / 1000)}`,
        namespace: cronjob.metadata.namespace,
        labels: cronjob.metadata.labels,
        ownerReferences: [
          {
            apiVersion,
            kind: 'CronJob',
            name: cronjob.metadata.name,
            uid: cronjob.metadata.uid,
          },
        ],
      },
      spec: cronjob.spec.jobTemplate.spec,
    };
  };

  const getCronjobResult = curry((jobs, pods, cronjob) => {
    const latestJob = jobs.items.filter(isChild(cronjob.metadata.name)).reduce(getLatestJob);
    const latestJobPod = pods.items.filter(isChild(latestJob.metadata.name))[0];

    return {
      status: latestJobPod.status.phase,
      pod: latestJobPod.metadata.name,
      name: cronjob.metadata.name,
      schedule: cronjob.spec.schedule,
      latestExecution: latestJob.status.startTime,
      completionTime: latestJob.status.completionTime,
      nextExecution: cronParser
        .parseExpression(cronjob.spec.schedule)
        .next()
        .toString(),
    };
  });

  controller.find = async (req, res, next) => {
    try {
      const { sortBy, sortDirection } = req.query;

      const [cronjobs, jobs, pods] = await Promise.all([
        cronjobsService.find(),
        jobsService.find(),
        podsService.find(),
      ]);

      return res.json(compose(
        orderBy(sortBy, sortDirection),
        map(getCronjobResult(jobs, pods)),
      )(cronjobs.items));
    } catch (err) {
      next(err);
    }
  };

  controller.run = async (req, res, next) => {
    const { name } = req.params;

    try {
      const cronjobList = await cronjobsService.find({
        fieldSelector: `metadata.name=${name}`,
      });

      if (cronjobList.items.length) {
        const jobDraft = getJobDraftFromCronjob(cronjobList.items[0], cronjobList.apiVersion);
        await jobsService.create(jobDraft);
        return res.send('success');
      }

      return next(new ValidationError("the cronjob doesn't exist"));
    } catch (err) {
      next(err);
    }
  };

  return controller;
};
