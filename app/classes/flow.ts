import { Job, UnrecoverableError, Worker } from 'bullmq';
import { ActionBase, IAction } from './action';

export type FlowOptions = {
	pattern: string;
	startDate?: Date;
	endDate?: Date;
	retries: number;
	retryDelay?: number;
	timeout: number;
};

export type IFlow = {
	id: string;
	name: string;
	options: FlowOptions;
};

export class Flow implements IFlow {
	public id!: string;
	public name!: string;
	public actions?: IAction[];
	public options!: FlowOptions;

	constructor(args: IFlow) {
		Object.assign(this, args);
	}

	Run = () => {
		let jobTimeout = new Promise((_r, rej) =>
			setTimeout(() => rej(), this.options.timeout)
		);

		new Worker<any[]>(
			'jobs',
			async (job: Job) =>
				Promise.race([
					jobTimeout,
					new Promise((res, rej) => {
						let jobData = job.data;

						(jobData.actions as ActionBase[]).reduce((prev, action) => {
							let actionTimeout = new Promise((_r, rej) =>
								setTimeout(
									() => rej(),
									action.options.timeout ?? 2 * 60 * 60 * 1000
								)
							);

							return prev.function.then((result: any) => {
								action.results.push(result);
								Promise.race([actionTimeout, action.function]);
							});
						}),
							Promise.resolve({
								options: {},
								function: () => {},
								results: <any>[],
							});
					}),
				]),
			{ connection: {}, name: this.name }
		)
			.on('progress', (job: Job, progress: number | object) => {})
			.on('failed', (job: Job | undefined, error: Error, prev: string) => {})
			.on('error', (err) => {})
			.run();
	};
}
