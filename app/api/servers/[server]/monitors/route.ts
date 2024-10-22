import { Queue, Worker } from 'bullmq';
import { connect } from '../../../../lib/db';

export const GET = async (
	request: Request,
	{ params }: { params: { server: string } }
) => {
	const redis = await connect();
	const queue = new Queue(params.server);

	redis.defineCommand('getMonitors', {
		numberOfKeys: 0,
		readOnly: true,
		lua: `local monitorNames = redis.call("ZRANGE", "bull:${params.server}:repeat", 0, -1, "WITHSCORES")

			  local result = {}
			  for i,v in pairs(monitorNames) do
			    if(monitorNames[i + 1] ~= nil ) then
					local data = redis.call("HGETALL", "bull:${params.server}:repeat:" .. monitorNames[i] .. ":" .. monitorNames[i + 1])
					table.insert(result, data)
				end
			  end
			  return result`.replace(/\n/g, ' '),
	});

	// table.insert(result, {monitorNames[k], monitorNames[k + 1]})

	// lua: `local monitorNames = redis.call("ZRANGE", "bull:${params.server}:repeat", 0, -1, "WITHSCORES")

	// local result = {}
	// for i,v in ipairs(monitorNames) do
	//   local data = redis.call("HGETALL", "bull:${params.server}:repeat:" .. v[1] .. ":" .. v[2])
	//   result[i] = data
	// end
	// return result`.replace(/\n/g, ' '),

	const monitors = await redis.getMonitors();

	// const jobData = await redis.hgetall(`bull:${params.server}:repeat:*:`);

	return Response.json(monitors);
};

export const PUT = async (
	request: Request,
	{ params }: { params: { server: string } }
) => {
	const connection = await connect();
	const queue = new Queue(params.server);

	const res = await request.json();

	const monitor = await queue.upsertJobScheduler(
		res.monitorName,
		{
			pattern: res.pattern,
			immediately: res.startDate ? true : false,
			startDate: res.startDate ? new Date(res.startDate) : undefined,
			endDate: res.endDate ? new Date(res.endDate) : undefined,
		},
		{
			name: res.monitorName,
			data: res.data,
			opts: {
				attempts: res.retries,
				backoff: {
					type: 'fixed',
					delay: res.retryDelay,
				},
			},
		}
	);

	return Response.json(monitor.toJSON());
};
