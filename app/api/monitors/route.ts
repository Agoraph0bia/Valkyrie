import { Queue, Worker } from 'bullmq';

import IORedis from 'ioredis';
import { connect } from '../../lib/db';

export const GET = async (
  request: Request,
  { params }: { params: { slug: string } }
) => {
  const redis = await connect();
  const queue = new Queue(params.slug);

  const keys = redis.scanStream({
    match: 'bull:*:id',
    type: 'string',
  });

  const monitors = [];
  keys.forEach(async (k) => {
    monitors.push(await new Queue(k).getJobSchedulers());
  });

  return Response.json(await queue.getJobSchedulers());
};
