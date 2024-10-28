import { Worker, Job, FlowProducer, JobNode } from 'bullmq';
import { Action } from './valkyrie';

const monitorWorker = new Worker('monitor', async (job: Job) => {
	const flow = new FlowProducer();

	flow
		.addBulk(
			job.data.actions.map((a: Action) => {
				return {
					name: a.name,
					queueName: 'actions',
					opts: {
						parent: { id: job.id as string, queue: 'monitors' },
					},
				};
			})
		)
		.then(() => {});
});

const actionWorker = new Worker('action', async (job: Job) => {
	// Optionally report some progress
	await job.updateProgress(42);

	// Optionally sending an object as progress
	await job.updateProgress({ foo: 'bar' });

	// Do something with job
	return 'some value';
});
