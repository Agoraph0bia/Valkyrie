import { dbOpen } from '../../lib/db';

export const dynamic = 'force-dynamic';

export const GET = async (request: Request) => {
	const db = await dbOpen();

	const result = db
		.prepare(`SELECT serverid, name, username, isactive FROM servers`)
		.all();
	db.close();
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
