import client from "../db.js";
import bullmq from "bullmq";
import { v4 as uuid } from "uuid";

const getFolders = async (req, res) => {
    try {
        const { folderid } = req.params;

        client.hGet("valk:folders:", "folderstructure").then((results) => {
            const folderStructure = JSON.parse(results);

            let folderString;
            const getFolder = (folder) => {
                if (folder.id == folderid) {
                    folderString = JSON.stringify(folder);
                    return folderString;
                }

                for (const f of folder.folders) {
                    getFolder(f);
                }
                return folderString;
            };

            const folder = getFolder(folderStructure);

            if (!folder) return res.status(404);

            return res
                .set("content-type", "application/JSON")
                .status(200)
                .send(folder);
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

const getActions = async (req, res) => {
    try {
        const { folderid } = req.params;

        client
            .hScan("valk:folders:" + folderid + ":actions:", 0, {
                MATCH: "*",
                COUNT: 9999,
            })
            .then((results) => {
                const actionsString = results?.tuples?.map((a) => a.value);

                if (actionsString)
                    return res
                        .set("Content-Type", "application/JSON")
                        .status(200)
                        .send();
            });
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
    try {
        const { name, parentid } = req.body;

        let folderid = uuid();

        let structure = await client.hGet("valk:folders:", "folderstructure");
        let structureObject = JSON.parse(structure);

        const addFolder = (folder) => {
            if (folder.id == parentid) {
                folder.folders.push({
                    id: folderid,
                    name: name,
                    folders: [],
                });
                return JSON.stringify(structureObject);
            }

            for (const f of folder.folders) {
                addFolder(f);
            }
        };

        structure = addFolder(structureObject);

        if (!structure)
            throw {
                message: "Folder structure error. Changes not saved.",
            };

        client
            .hSet("valk:folders:", {
                folderstructure: structure,
            })
            .then(() => {
                return res
                    .set("content-type", "application/JSON")
                    .status(200)
                    .send(structure);
            });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export default { getFolders, getActions, update, create };
