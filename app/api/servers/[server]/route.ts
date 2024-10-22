import { connect } from '../../../lib/db';

export const dynamic = 'force-dynamic';

// export const GET = async (
// 	request: Request,
// 	{ params }: { params: { slug: string } }
// ) => {
// 	const db = await dbOpen();

// 	const result = db
// 		.prepare(
// 			`SELECT serverid, name, username, isactive FROM servers WHERE name = '${params.slug}'`
// 		)
// 		.run();

// 	db.close();
// 	return Response.json({ result });
// };

// export const PUT = async (
// 	request: Request,
// 	{ params }: { params: { slug: string } }
// ) => {
// 	const db = await dbOpen();

// 	const body = await request.json();

// 	const result = db
// 		.prepare(
// 			`INSERT INTO servers (name, host, username, password, isactive) SELECT '${params.slug}','${body.host}','${body.username}','${body.password}', ${body.isactive}`
// 		)
// 		.run();

// 	db.close();
// 	return Response.json({ result });
// };
