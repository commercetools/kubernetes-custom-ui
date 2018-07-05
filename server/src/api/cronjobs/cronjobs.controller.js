import { curry, compose, map, orderBy } from 'lodash/fp';
import cronParser from 'cron-parser';
import moment from 'moment';
import { ValidationError } from '../../errors';

export default ({ cronjobsService, jobsService, podsService }) => {
  const controller = {};

  const isChild = curry((parentName, child) => {
    if (child.metadata.ownerReferences) {
      return child.metadata.ownerReferences[0].name === parentName;
    }

    return false;
  });

  const getLatestJob = (job1, job2) => {
    if (job1) {
      if (job2) {
        return new Date(job1.status.startTime).getTime() > new Date(job2.status.startTime).getTime()
          ? job1
          : job2;
      }

      return job1;
    }

    if (job2) {
      return job2;
    }

    return null;
  };


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

  const duration = (date1, date2) => moment.duration(moment(date1).diff(moment(date2))).asSeconds();

  const getCronjobResult = curry((jobs, pods, cronjob) => {
    const latestJob = jobs.items.filter(isChild(cronjob.metadata.name)).reduce(getLatestJob, null);
    const latestJobPod = latestJob ? pods.items.filter(isChild(latestJob.metadata.name))[0] : null;
    const latestExecution = latestJob && latestJob.status.startTime ?
      new Date(latestJob.status.startTime).toISOString() : null;
    const completionTime = latestJob && latestJob.status.completionTime ?
      new Date(latestJob.status.completionTime).toISOString() : null;

    return {
      status: latestJobPod ? latestJobPod.status.phase : null,
      pod: latestJobPod ? latestJobPod.metadata.name : null,
      name: cronjob.metadata.name,
      schedule: cronjob.spec.schedule,
      latestExecution,
      completionTime,
      executionTime: completionTime ? duration(completionTime, latestExecution) : null,
      nextExecution: cronParser
        .parseExpression(cronjob.spec.schedule)
        .next()
        .toISOString(),
      namespace: cronjob.metadata.namespace,
    };
  });

  controller.find = async (req, res, next) => {
    try {
      const { environment, sortBy, sortDirection } = req.query;

      if (environment) {
        const [cronjobs, jobs, pods] = await Promise.all([
          cronjobsService.find({ environment }),
          jobsService.find({ environment }),
          podsService.find({ environment }),
        ]);

        return res.json(compose(
          orderBy(sortBy, sortDirection),
          map(getCronjobResult(jobs, pods)),
        )(cronjobs.items));
      }

      throw new ValidationError('"environment" query param is required');
    } catch (err) {
      next(err);
    }
  };

  controller.run = async (req, res, next) => {
    const { name } = req.params;
    const { environment, namespace } = req.body;

    try {
      const cronjobList = await cronjobsService.find({
        fieldSelector: `metadata.name=${name},metadata.namespace=${namespace}`,
        environment,
      });

      if (cronjobList.items.length) {
        const jobDraft = getJobDraftFromCronjob(cronjobList.items[0], cronjobList.apiVersion);
        await jobsService.create(jobDraft, environment, namespace);
        return res.send('success');
      }

      return next(new ValidationError("the cronjob doesn't exist"));
    } catch (err) {
      next(err);
    }
  };

  return controller;
};
