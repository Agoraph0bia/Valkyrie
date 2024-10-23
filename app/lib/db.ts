import SQLite3, { Database } from 'better-sqlite3';
import IORedis from 'ioredis';

interface Connection extends IORedis {
  getMonitors(): any;
}

export const connect = async () => {
  return new IORedis() as Connection;
};
