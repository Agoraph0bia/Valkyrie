import { Worker, Job, FlowProducer, JobNode } from 'bullmq';
import { Valkyrie } from './valkyrie';
import { ActionBase } from './action';

export type Result = {};

const actionWorker = new Worker('action', async (job: Job) => {
	const valkyrie = new Valkyrie('action');

	(job.data.actions as ActionBase[])
		.map((a) => a.function as any)
		.reduce((resultPromise, fn) => {
			try {
				return resultPromise?.then(fn);
			} catch (e) {
				return e;
			}
		}, Promise.resolve([]));
	return;
});

const waitAction = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
