import { JobsOptions, Queue, QueueOptions } from 'bullmq';
import { connect } from '../lib/db';
import IORedis, { Result } from 'ioredis';

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

export class Valkyrie extends Queue {
  private redis: IORedis;

  constructor() {
    super('valkyrie');
    this.redis = connect();
  }

  async createMonitor(
    folderid: number,
    server: string,
    name: string,
    options: MonitorOptions
  ) {
    super.upsertJobScheduler(
      `${folderid}%%${server}%%${name}`,
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
      }
    );
  }

  async getFolderContents(folderid: number) {
    this.redis
      .scanStream({
        match: `bull:valkyrie:repeat:${folderid}*:*`,
        type: 'hash',
      })
      .on('data', async (keys) => {
        keys?.map((k: number) => {});
      });
  }
}
