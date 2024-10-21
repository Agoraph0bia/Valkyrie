import { Queue } from 'bullmq';
import { connect } from '../../../../lib/db';

export const GET = async (
  request: Request,
  { params }: { params: { slug: string } }
) => {
  const redis = await connect();
  const queue = new Queue(params.slug);
  const test = await queue.getJobSchedulers();

  return Response.json(await queue.getJobSchedulers());
};
