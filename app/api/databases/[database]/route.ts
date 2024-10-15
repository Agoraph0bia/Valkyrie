import { dbOpen } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export const GET = async (
	request: Request,
	{ params }: { params: { slug: string } }
) => {
	const db = await dbOpen();

	const result = db
		.prepare(`SELECT * FROM databases WHERE name = '${params.slug}'`)
		.run();

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
			`INSERT INTO databases (name, serverid, isactive) SELECT '${params.slug}', '${body.serverid}', ${body.isactive}`
		)
		.run();

	db.close();
	return Response.json({ result });
};
