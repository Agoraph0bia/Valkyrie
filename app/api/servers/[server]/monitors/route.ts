import { Queue, Worker } from 'bullmq';
import { connect } from '../../../../lib/db';
import { NextResponse } from 'next/server';

export const GET = async (
  request: Request,
  { params }: { params: { server: string } }
) => {
  const redis = await connect();
  const queue = new Queue(params.server);

  const result = await redis.getMonitors(params.server);

  const monitors = result
    .filter((m: string[]) => m.length > 0)
    .map((m: string[]) => {
      return m.reduce(
        (current: any, item: string, i: number, monitors: string[]) => {
          if (i % 2) current[monitors[i - 1]] = item;
          return current;
        },
        {}
      );
    }) as {}[];

  return NextResponse.json(monitors);
};

export const PUT = async (
  request: Request,
  { params }: { params: { server: string } }
) => {
  const connection = await connect();
  const queue = new Queue(params.server);

  const res = await request.json();

  const monitor = await queue.upsertJobScheduler(
    res.monitorName,
    {
      pattern: res.pattern,
      immediately: res.startDate ? false : true,
      startDate: res.startDate ? new Date(res.startDate) : undefined,
      endDate: res.endDate ? new Date(res.endDate) : undefined,
    },
    {
      name: res.monitorName,
      data: res.data,
      opts: {
        attempts: res.retries,
        backoff: {
          type: 'fixed',
          delay: res.retryDelay,
        },
      },
    }
  );

  return Response.json(monitor.toJSON());
};
