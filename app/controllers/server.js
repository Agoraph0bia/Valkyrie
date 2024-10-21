import client from "../db.js";
import { Queue } from "bullmq";

const getServers = async (req, res) => {
    try {
        client
            .hscan("valk:servers", 0, "MATCH", "valk:servers:*")
            .then((servers) => {
                return res
                    .set("content-type", "application/JSON")
                    .status(200)
                    .send(servers.map((s) => s[1]));
            });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
const update = async (req, res) => {
    try {
        return res
            .status(500)
            .json({ success: false, error: "Not implemented" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
const create = async (req, res) => {
    try {
        const { server, alias, defaultuser } = req.body;

        client
            .hset("valk:servers:" + server, {
                server: server,
                alias: alias,
                defaultuser: defaultuser,
            })
            .then((results) => {
                return res
                    .set("content-type", "application/JSON")
                    .status(200)
                    .send(results);
            });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

const createdb = async (req, res) => {
    try {
        const { server, database, defaultuser } = req.body;

        client
            .hset("valk:servers:" + server + ":databases:" + database, {
                server: server,
                database: database,
                defaultuser: defaultuser,
            })
            .then((results) => {
                return res
                    .set("content-type", "application/JSON")
                    .status(200)
                    .send(results);
            });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
const getActions = async (req, res) => {
    const { servername } = req.params;

    try {
        let keyData = [];

        client
            .scan(0, "MATCH", "bull:" + servername + ":repeat:*", "COUNT", 9999)
            .then((keys) => {
                if (keys?.length > 0) {
                    var data = keys[1].map(async (key) => {
                        return await client.hgetall(key);
                    });
                    keyData.push(data);
                }
            });

        return res
            .set("content-type", "application/JSON")
            .status(200)
            .send(JSON.stringify(keyData));
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export default { getActions, getServers, update, create, createdb };
