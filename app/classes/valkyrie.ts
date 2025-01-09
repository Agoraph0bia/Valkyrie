import {
	FlowProducer,
	JobsOptions,
	Queue,
	QueueOptions,
	RedisConnection,
} from 'bullmq';
import { connect } from '../lib/db';
import IORedis, { ChainableCommander, Result } from 'ioredis';
import { Flow, FlowOptions } from './flow';
import { ActionBase } from './action';

// Add declarations
declare module 'ioredis' {
	interface RedisCommander<Context> {
		getMonitors(folderid: string): Result<[], Context>;
	}
}

export class Valkyrie {
	private redis: IORedis;
	private queue: Queue;

	constructor(queue: string) {
		this.redis = connect();
		this.queue = new Queue(queue);
	}

	async createMonitor(
		folderid: number,
		name: string,
		options: FlowOptions,
		actions: ActionBase[]
	) {
		const jobScheduler = await this.queue.upsertJobScheduler(
			`${folderid}%%${name}`,
			{
				pattern: options.pattern,
				immediately: options.startDate ? false : true,
				startDate: options.startDate ? new Date(options.startDate) : undefined,
				endDate: options.endDate ? new Date(options.endDate) : undefined,
			},
			{
				name: name,
				opts: {
					attempts: options.retries,
					backoff: {
						type: 'fixed',
						delay: options.retryDelay,
					},
				},
				data: { folderid: folderid, monitor: name, actions: actions },
			}
		);

		// return {

		// } as Monitor;
	}

	async getFolders(folderid: number): Promise<any[]> {
		this.redis.hgetall(`valkyrie:folders:${folderid}*:*`);
		return [];
	}

	async getFlows(folderid: number): Promise<Flow[]> {
		const stream = this.redis.scanStream({
			match: `bull:valkyrie:repeat:${folderid}%%*:*`,
			type: 'hash',
			count: 1000,
		});

		var pipeline = this.redis.pipeline();

		return new Promise((resolve, reject) => {
			stream
				.on('data', async (keys) => {
					keys?.forEach((k: string) => {
						pipeline = pipeline.hgetall(k);
					});
				})
				.on('end', async () => {
					const results = await pipeline.exec();

					const flows = results?.map((m) => {
						const [err, value] = m;
						if (err) reject(err);
						return value as Flow;
					});

					resolve(flows ?? []);
				});
		});
	}

	getActions(folderid: number, monitor: string) {
		throw new Error('Method not implemented.');
	}

	async getFolderContents(folderid: number) {
		this.redis
			.scanStream({
				match: `bull:valkyrie:repeat:${folderid}*:*`,
				type: 'hash',
			})
			.on('data', async (keys) => {
				keys?.map((k: number | string) => {});
			});
	}
}
