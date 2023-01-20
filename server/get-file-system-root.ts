import {exec} from 'child_process';
import fs from 'fs';

export async function getFileSystemRoot(): Promise<string[]> {
    if (process.platform === 'win32') {
        try {
            const stdout = await new Promise<string>(function (resolve, reject) {
                exec('wmic logicaldisk get name', function (err, stdout, stderr) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(stdout);
                    }
                });
            });
            const arr = stdout.split('\n')
                .map(str => str.trim())
                .filter(str => !!str)
                .map(str => str.endsWith('/') ? str : str + '/');
            arr.shift();
            return arr;
        } catch (e) {
            const ret: string[] = [];
            for (let i = 'a'.charCodeAt(0), last = 'z'.charCodeAt(0); i <= last; ++i) {
                const path = String.fromCharCode(i) + ':/';
                if (fs.existsSync(path)) {
                    ret.push(path);
                }
            }
            return ret;
        }
    } else {
        return ['/'];
    }
}
