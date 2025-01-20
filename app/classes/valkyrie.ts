import { Job, MetricsTime, Queue, Worker } from 'bullmq';
import { connect } from '../lib/db';
import IORedis, { ChainableCommander, Result } from 'ioredis';
import { Flow, FlowOptions } from './flow';
import { ActionBase, ActionResult } from './action';
import { Folder } from '../types/folder';

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
      .on('error', (err) => {}).; //This prevents node from throwing errors for jobs directly.
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
        (index++).toString(),
      ])
    );

    await this.redis.zadd(
      `valkyrie:folders:${flow.folder.id}:flows:${flowId}`,
      ...flowObject.flat()
    );

    return this;
  }

  async getFolders(folderId: string = '0'): Promise<Folder[]> {
    let results = await this.redis.hgetall(`valkyrie:folders:${folderId}`);

    return Object.entries(results).map(([id, name]): Folder => {
      return { id: id, name: name, parentId: folderId };
    });
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

            return flowArr.reduce<Flow>((flow, item, index) => {
              let itemObj = JSON.parse(item);

              if (index === 0) return itemObj as Flow;
              else {
                flow.actions.push(item as ActionBase);
                return flow;
              }
            }, {} as Flow);
          });

          resolve(flows ?? []);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async getFolderContents(folderid: number) {
    return Promise.all([this.getFlows(), this.getFolders()]);
  }
}
