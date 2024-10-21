import SQLite3, { Database } from 'better-sqlite3';
import IORedis from 'ioredis';

export const connect = async () => {
  return new IORedis();
};
