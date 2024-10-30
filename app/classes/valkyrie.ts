import {
  FlowProducer,
  JobsOptions,
  Queue,
  QueueOptions,
  RedisConnection,
} from 'bullmq';
import { connect } from '../lib/db';
import IORedis, { ChainableCommander, Result } from 'ioredis';

// Add declarations
declare module 'ioredis' {
  interface RedisCommander<Context> {
    getMonitors(folderid: string): Result<[], Context>;
  }
}

export type MonitorOptions = {
  pattern: string;
  startDate?: Date;
  endDate?: Date;
  retries: number;
  retryDelay?: number;
};

export type Monitor = {
  id: string;
  name: string;
  options: MonitorOptions;
};

export type ActionOptions = {
  pattern: string;
  startDate?: Date;
  endDate?: Date;
  retries: number;
  retryDelay?: number;
};

export type Condition = {};

export type Action = {
  id?: string;
  name: string;
  monitor: Monitor;
  type: string;
  conditions: Condition[];
  options: ActionOptions;
};

export class Valkyrie {
  private redis: IORedis;
  private queue: Queue;

  constructor() {
    this.redis = connect();
    this.queue = new Queue('monitor', { connection: { stringNumbers: true } });
  }

  async createMonitor(
    folderid: number,
    name: string,
    options: MonitorOptions,
    actions: Action[]
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
        data: { actions: actions },
      }
    );

    // return {

    // } as Monitor;
  }

  async getFolders(folderid: number) {
    this.redis.hgetall(`valkyrie:folders:${folderid}*:*`);
  }

  async getMonitors(folderid: number): Promise<Monitor[]> {
    const stream = this.redis.scanStream({
      match: `bull:valkyrie:repeat:${folderid}%%*:*`,
      type: 'hash',
      count: 1000,
    });

    var pipeline = this.redis.pipeline();
    var returnvalue;

    return new Promise((resolve, reject) => {
      stream
        .on('data', async (keys) => {
          keys?.forEach((k: string) => {
            pipeline = pipeline.hgetall(k);
          });
        })
        .on('end', async () => {
          const results = await pipeline.exec();

          const monitors = results?.map((m) => {
            const [err, value] = m;
            if (err) reject(err);
            return value as Monitor;
          });

          resolve(monitors ?? []);
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
