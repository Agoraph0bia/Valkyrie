import { Worker, Job, FlowProducer, JobNode } from 'bullmq';
import { Valkyrie } from './valkyrie';
import { ActionBase } from './action';

export type Result = {};

export const actionWorker = new Worker('action', async (job: Job) => {
	let jobData = job.data;

	setTimeout(() => {
		(jobData.actions as ActionBase[])
			.map((action: ActionBase) => action.function)
			.reduce((prev, func) => prev.then((result: []) => func)),
			Promise.resolve([]);
	}, jobData.timeout ?? 2 * 60 * 60 * 1000);
});
