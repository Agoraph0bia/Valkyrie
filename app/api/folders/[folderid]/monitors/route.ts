import { Queue, Worker } from 'bullmq';
import { connect } from '../../../../lib/db';
import { NextResponse } from 'next/server';
import { Valkyrie } from '@/app/classes/valkyrie';

export const GET = async (
	request: Request,
	{ params }: { params: { folderid: number } }
) => {
	const valkyrie = new Valkyrie();

	const monitors = await valkyrie.getMonitors(params.folderid);
	return Response.json(monitors);
};

export const PUT = async (
	request: Request,
	{ params }: { params: { folderid: number } }
) => {
	const valkyrie = new Valkyrie();

	const { name, pattern, retries, actions } = await request.json();
	const results = await valkyrie.createMonitor(
		params.folderid,
		name,
		{
			pattern: pattern,
			retries: retries,
		},
		actions
	);

	return Response.json(results);
};
