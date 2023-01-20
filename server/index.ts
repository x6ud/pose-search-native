import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import multiparty from 'multiparty';
import open from 'open';
import os from 'os';
import {getFileSystemRoot} from './get-file-system-root';

dotenv.config();

const app = express();
const port = process.env.PORT || 11419;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/fs/homedir', async (req, res) => {
    res.send(os.homedir());
});

app.get('/fs/root', async (req, res) => {
    res.json(await getFileSystemRoot());
});

app.get('/fs/dir', async (req, res) => {
    const path = req.query.path as string;
    if (!path) {
        res.status(400).send();
        return;
    }
    try {
        const files = await fs.promises.readdir(path, {withFileTypes: true});
        res.json(files.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name));
    } catch (err) {
        res.json([]);
    }
});

app.get('/fs/files', async (req, res) => {
    let path = req.query.path as string;
    if (!path) {
        res.status(400).send();
        return;
    }
    if (!path.endsWith('/')) {
        path += '/';
    }
    try {
        const stack: [string, string][] = [[path, '']];
        const ret: string[] = [];
        while (stack.length) {
            const pair = stack.pop();
            if (!pair) {
                break;
            }
            const dir = pair[0];
            const midPath = pair[1];
            for (let dirent of await fs.promises.readdir(dir, {withFileTypes: true})) {
                if (dirent.isDirectory()) {
                    if (dirent.name.startsWith('.')) {
                        continue;
                    }
                    stack.push([dir + dirent.name + '/', midPath + dirent.name + '/']);
                } else {
                    ret.push(midPath + dirent.name);
                }
            }
        }
        res.json(ret);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/fs/file', async (req, res) => {
    const path = req.query.path as string;
    try {
        const file = await fs.promises.readFile(path);
        const ext = path.substring(path.lastIndexOf('.') + 1).toLowerCase();
        const map: { [name: string]: string } = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'jfif': 'image/jpeg',
            'pjpeg': 'image/jpeg',
            'pjp': 'image/jpeg',
            'png': 'image/png',
            'apng': 'image/apng',
            'gif': 'image/gif',
            'avif': 'image/avif',
            'webp': 'image/webp',
            'bmp': 'image/bmp',
        };
        res.writeHead(200, {'Content-Type': map[ext] || 'application/octet-stream'});
        res.end(file, 'binary');
    } catch (err) {
        res.status(404).send(err);
    }
});

app.get('/ds/dataset', async (req, res) => {
    try {
        if (!fs.existsSync('./dataset.json')) {
            res.json({});
            return;
        }
        const json = await fs.promises.readFile('./dataset.json');
        res.send(json);
    } catch (e) {
        res.json({});
    }
});

app.post('/ds/dataset', async (req, res) => {
    try {
        await fs.promises.writeFile('./dataset.json', JSON.stringify(req.body));
        res.status(200).end();
    } catch (e) {
        res.status(500).send(e);
    }
});

app.get('/ds/records', async (req, res) => {
    let path = req.query.path as string;
    if (!path) {
        res.status(400).end();
        return;
    }
    if (!path.endsWith('/')) {
        path += '/';
    }
    path += '.pose_search/';
    try {
        const file = path + req.query.file as string;
        if (fs.existsSync(file)) {
            res.writeHead(200, {'Content-Type': 'binary'});
            res.write(await fs.promises.readFile(file));
            res.end();
        } else {
            res.status(404).end();
        }
    } catch (e) {
        res.status(404).send(e);
    }
});

app.post('/ds/records', async (req, res) => {
    let path = req.query.path as string;
    if (!path) {
        res.status(400).end();
        return;
    }
    if (!path.endsWith('/')) {
        path += '/';
    }
    path += '.pose_search/';
    try {
        if (!fs.existsSync(path)) {
            await fs.promises.mkdir(path);
        }
        const parts = await new Promise<{
            fields: { [name: string]: any },
            files: {
                [name: string]: {
                    fieldName: string,
                    originalFilename: string,
                    path: string,
                    headers: { [name: string]: string },
                    size: number
                }[]
            }
        }>(function (resolve) {
            const form = new multiparty.Form();
            form.parse(req, function (error, fields, files) {
                resolve({fields, files});
            });
        });
        for (let name in parts.files) {
            for (let file of parts.files[name]) {
                await fs.promises.copyFile(file.path, path + file.originalFilename, fs.constants.COPYFILE_FICLONE);
                await fs.promises.rm(file.path);
            }
        }
        res.status(200).end();
    } catch (e) {
        res.status(500).send(e);
    }
});

app.listen(port, async () => {
    if (process.env.NODE_ENV === 'development') {
        return;
    }
    const url = `http://localhost:${port}`;
    console.log(`[server]: Server is running at ${url}`);
    await open(url);
});
