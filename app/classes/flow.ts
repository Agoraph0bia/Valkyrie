import {
	Job,
	MetricsTime,
	UnrecoverableError,
	Worker,
	SandboxedJob,
} from 'bullmq';
import { ActionBase, ActionResult } from './action';

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
	actions: ActionBase[];
};

export class Flow implements IFlow {
	public id!: string;
	public name!: string;
	public actions: ActionBase[] = [];
	public options!: FlowOptions;
	public status: string = 'New';

	constructor(args: IFlow) {
		Object.assign(this, args);
	}

	Run = () => {
		let results = new Worker<ActionResult[]>(
			'FlowQueue',
			`${__dirname}/workers/flowworker.js`,
			{
				//Passing separate file path here
				connection: {},
				metrics: {
					maxDataPoints: MetricsTime.ONE_WEEK * 2,
				},
				name: this.name,
			}
		)
			.on('progress', (job: Job, progress: number | object) => {})
			.on('failed', (job: Job | undefined, error: Error, prev: string) => {})
			.on('error', (err) => {}) //This prevents node from throwing errors for jobs directly.
			.run();
	};
}
