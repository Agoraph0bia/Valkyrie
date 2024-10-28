import IORedis, { Result } from 'ioredis';

// Add declarations
declare module 'ioredis' {
	interface RedisCommander<Context> {
		getMonitors(folderid: string): Result<[], Context>;
	}
}

export const connect = () => {
	const redis = new IORedis();
	redis.defineCommand('getMonitors', {
		numberOfKeys: 1,
		readOnly: true,
		lua: `local monitorNames = redis.call("ZRANGE", "bull:" .. KEYS[1] .. ":repeat", 0, -1, "WITHSCORES")
         local result = {}
         for i,v in pairs(monitorNames) do
            if(monitorNames[i + 1] ~= nil ) then
              local data = redis.call("HGETALL", "bull:" .. KEYS[1] .. ":repeat:" .. monitorNames[i] .. ":" .. monitorNames[i + 1])
              table.insert(result, data)
            end
          end
          return result`.replace(/\n/g, ' '),
	});

	return redis;
};
