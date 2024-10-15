import { dbOpen } from '../../lib/db';

export const dynamic = 'force-dynamic';

export const GET = async (request: Request) => {
	const db = await dbOpen();

	const result = db.prepare(`SELECT * FROM databases`).run();

	db.close();
	return Response.json({ result });
};

export const PUT = async (
	request: Request,
	{ params }: { params: { slug: string } }
) => {
	const db = await dbOpen();

	const body = await request.json();

	const result = db
		.prepare(
			`INSERT INTO databases (name, serverid) SELECT '${params.slug}', '${body.serverid}'`
		)
		.run();

	db.close();
	return Response.json({ result });
};
