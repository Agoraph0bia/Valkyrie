import { Queue, Worker } from 'bullmq';
import { connect } from '../../../lib/db';
import { NextResponse } from 'next/server';

export const GET = async (
  request: Request,
  { params }: { params: { folderid: string } }
) => {
  const redis = await connect();
  redis.pipeline().getMonitors();

  const result = await redis.getMonitors();
  const response = redis.get(`valk:folders:${params.folderid}:`);

  return Response.json({ result });
};

export const PUT = async (request: Request) => {
  const db = await dbOpen();

  const body = await request.json();

  const result = db
    .prepare(
      `INSERT INTO servers (name, host, username, password) SELECT '${body.name}','${body.host}','${body.username}','${body.password}'`
    )
    .run();
  db.close();
  return Response.json({ result });
};
