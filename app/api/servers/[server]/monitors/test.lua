local monitorNames = redis.call('ZRANGE', 'bull:localhost2:repeat:', '0', '-1', 'WITHSCORES')

local result = {}
for i,v in ipairs(monitorNames) do
    local data = redis.call('HGETALL', 'bull:localhost2:repeat:' .. v[1] .. ':' .. v[2])
    result[i] = data
end
return result