import { dbOpen } from '../../lib/db';

export const dynamic = 'force-dynamic';

export const GET = async (request: Request) => {
	const db = await dbOpen();

	const result = db.prepare(`SELECT * FROM actions`).all();

	db.close();
	return Response.json({ result });
};

export const PUT = async (request: Request) => {
	const db = await dbOpen();

	const body = await request.json();

	const result = db
		.prepare(
			`INSERT INTO actions (
                        name,
                        typeid,
                        databaseid,
                        folderid,
                        schedule,
                        retries)
			SELECT '${body.name}',
					'${body.typeid}',
					'${body.databaseid}',
					'${body.password}', 
					${body.isactive}`
		)
		.run();

	db.close();
	return Response.json({ result });
};
