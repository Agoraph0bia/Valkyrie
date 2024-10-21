import { Queue, Worker } from 'bullmq';

import { connect } from '../../../../lib/db';

export const GET = async (
  request: Request,
  { params }: { params: { server: string } }
) => {
  const redis = await connect();
  const queue = new Queue(params.server);

  return Response.json(await queue.getJobs(['repeat']));
};

export const PUT = async (
  request: Request,
  { params }: { params: { slug: string } }
) => {
  const connection = await connect();
  const queue = new Queue(params.slug);

  const res = await request.json();

  const monitor = await queue.upsertJobScheduler(
    res.monitorName,
    { pattern: res.pattern, startDate: res.startDate, endDate: res.endDate },
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

  return Response.json(monitor.asJSON());
};
