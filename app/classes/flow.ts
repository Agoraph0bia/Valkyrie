import { Queue } from 'bullmq';
import { ActionBase, ActionResult } from './action';
import { Folder } from '../types/folder';

export type FlowOptions = {
  pattern: string;
  startDate?: Date;
  endDate?: Date;
  retries: number;
  timeout: number;
};

export interface IFlow {
  id: string;
  name: string;
  folder: any;
  options: FlowOptions;
  actions: ActionBase[];
  queue: Queue;
}

export class Flow implements IFlow {
  public id!: string;
  public name!: string;
  public folder!: Folder;
  public actions: ActionBase[] = [];
  public options!: FlowOptions;
  public status?: string;
  public queue!: Queue;

  constructor(args: IFlow) {
    Object.assign(this, args);
  }

  Start = async () => {
    await this.queue.upsertJobScheduler(
      this.id,
      {
        pattern: this.options.pattern,
        immediately: this.options.startDate ? false : true,
        startDate: this.options.startDate
          ? new Date(this.options.startDate)
          : undefined,
        endDate: this.options.endDate
          ? new Date(this.options.endDate)
          : undefined,
      },
      {
        name: this.name,
        opts: {
          attempts: this.options.retries,
          backoff: {
            type: 'fixed',
          },
        },
        data: {
          flow: this,
          options: this.options,
          actions: this.actions,
        },
      }
    );

    this.status = 'Scheduled';
    return this;
  };

  Stop = async () => {
    await this.queue.removeJobScheduler(this.id);

    this.status = 'Stopped';
    return this;
  };
}
