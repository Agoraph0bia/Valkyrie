import { Worker, Job, FlowProducer, JobNode } from 'bullmq';
import { Action } from './valkyrie';

const monitorWorker = new Worker('monitor', async (job: Job) => {});

const actionWorker = new Worker('action', async (job: Job) => {
  await waitAction();
  return;
});

const waitAction = () => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
