import { dbOpen } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export const GET = async (
	request: Request,
	{ params }: { params: { slug: string } }
) => {
	const db = await dbOpen();

	const result = db
		.prepare(
			`SELECT f.folderid AS ID,
				f.[Name],
				NULL AS Status,
				NULL AS LastRunTime,
				NULL AS NextRunTime,
				f.IsActive
			FROM folders f
			WHERE f.parentid = ${params.slug}
				
			UNION

			SELECT m.monitorid AS ID,
				m.[Name],
				t.[Name],
				m.LastRunTime,
				m.NextRunTime,
				m.isactive
			FROM monitors m
			JOIN statustypes t
				ON m.statusid = t.statusid
			WHERE m.folderid = ${params.slug}`
		)
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
