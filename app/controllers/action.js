import { Queue } from "bullmq";
import client from "../db.js";
import { v4 as uuid } from "uuid";

// const dbconnection = require("../db.js").dbconnection;

const getJobs = async (req, res) => {
    try {
        return res.set("content-type", "application/JSON").status(200);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
const update = async (req, res) => {
    try {
        return res.set("content-type", "application/JSON").status(200);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
const create = async (req, res) => {
    const {
        name,
        schedule,
        servername,
        filename,
        timeout,
        retries,
        folderid,
        isactive,
    } = req.body;

    try {
        const mq = new Queue(servername);

        const id = uuid();
        await mq
            .add(
                name,
                {
                    filename: filename,
                    folderid: folderid,
                    schedulepattern: schedule,
                },
                {
                    attempts: retries > 1 ?? retries - 1,
                    jobId: id,
                    timeout: timeout,
                    repeat: { pattern: isactive ?? schedule },
                    // removeOnComplete: {
                    //     age: 3600 * 24,
                    // },
                    // removeOnFail: {
                    //     age: 3600 * 24,
                    // },
                }
            )
            .then((result) => {
                const jsonJob = JSON.stringify(result.toJSON());
                client.hSet("valk:servers:" + servername + ":actions:", {
                    [id]: jsonJob,
                });
                client.hSet("valk:folders:" + folderid + ":actions:", {
                    [id]: jsonJob,
                }); //Should be pipelined automatically.

                return res
                    .set("content-type", "application/x-www-form-urlencoded")
                    .status(200)
                    .send(jsonJob);
            });
    } catch (ex) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export default { getJobs, update, create };
