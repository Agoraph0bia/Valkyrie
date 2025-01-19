import { Job, MetricsTime, Queue, Worker } from 'bullmq';
import { connect } from '../lib/db';
import IORedis, { ChainableCommander, Result } from 'ioredis';
import { Flow, FlowOptions } from './flow';
import { ActionBase, ActionResult } from './action';

export type Folder = {
	id: string;
	name: string;
	parentId: string;
};

export class Valkyrie {
	private redis: IORedis;
	private queue: Queue;

	constructor(queue: string) {
		this.redis = connect();
		this.queue = new Queue(queue);
	}

	async CreateWorker() {
		return new Worker<ActionResult[]>(
			'FlowQueue',
			`${__dirname}/workers/flowworker.js`,
			{
				useWorkerThreads: true,
				connection: {},
				metrics: {
					maxDataPoints: MetricsTime.ONE_WEEK * 2,
				},
			}
		)
			.on('progress', (job, progress) => {})
			.on('completed', (job, progress) => {})
			.on('failed', (job, error, prev) => {})
			.on('error', (err) => {}); //This prevents node from throwing errors for jobs directly.
	}

	async UpsertFlow(flowId: number, flow: Flow) {
		let flowObject = [
			[
				JSON.stringify({
					id: flowId,
					name: flow.name,
					folder: flow.folder,
					options: flow.options,
				}),
				'0',
			],
		].concat(
			flow.actions.map((a: ActionBase, index: number) => [
				JSON.stringify(a),
				(index + 1).toString(),
			])
		);

		await this.redis.zadd(
			`valkyrie:folders:${flow.folder.id}:flows:${flowId}`,
			...flowObject.flat()
		);

		return this;
	}

	async getFolders(folderid: number): Promise<Folder[]> {
		let result = await this.redis.hgetall(`valkyrie:folders:${folderid}*:*`);
		return [];
	}

	async getFlows(folderid?: number): Promise<Flow[]> {
		const stream = this.redis.scanStream({
			match: `valkyrie:folders:${folderid ?? '*'}:flows:*`,
			type: 'zset',
			count: 1000,
		});

		var pipeline = this.redis.pipeline();

		return new Promise<Flow[]>((resolve, reject) => {
			stream
				.on('data', async (keys) => {
					keys?.forEach((k: string) => {
						pipeline = pipeline.zrange(k, 0, -1);
					});
				})
				.on('end', async () => {
					const results = await pipeline.exec();

					const flows = results?.map(([err, result]) => {
						if (err) reject(err);

						let flowArr = result as any[];

						let flowData = JSON.parse(flowArr[0]);

						let actions = flowArr
							.slice(1)
							.map((a: string) => JSON.parse(a) as ActionBase);

						return new Flow({
							...flowData,
							actions: actions,
						});
					});

					resolve(flows ?? []);
				})
				.on('error', (error) => {
					reject(error);
				});
		});
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
