import { Worker, Job, FlowProducer, JobNode } from 'bullmq';
import { Action } from './valkyrie';

const monitorWorker = new Worker('monitor', async (job: Job) => {
  const flow = new FlowProducer();

  flow
    .addBulk(
      job.data.actions.reduce((previousAction: Action, a: Action) => {
        return {
          name: a.name,
          queueName: 'action',
          opts: {
            parent: { id: a.parentid as string, queue: 'monitor' },
          },
        };
      })
    )
    .then(() => {});
});

const actionWorker = new Worker('action', async (job: Job) => {});
