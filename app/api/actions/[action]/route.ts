import { dbOpen } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export const GET = async (
	request: Request,
	{ params }: { params: { slug: string } }
) => {
	const db = await dbOpen();

	const result = db
		.prepare(`SELECT * FROM actions WHERE name = '${params.slug}'`)
		.all();

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
					${body.typeid},
					${body.databaseid},
					${body.folderid},
					'${body.schedule}',
					${body.retries}`
		)
		.run();

	db.close();
	return Response.json({ result });
};
