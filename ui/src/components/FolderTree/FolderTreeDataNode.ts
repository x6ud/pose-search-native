import {request} from '../../utils/request';

export type FolderTreeDataNode = {
    name: string;
    expanded: boolean;
    children?: FolderTreeDataNode[];
    path: string;
};

export async function fetchFolderTreeNode(parent?: FolderTreeDataNode): Promise<FolderTreeDataNode[]> {
    try {
        const res = parent ? await request('/fs/dir?path=' + parent.path) : await request('/fs/root');
        const json = await res.json() as string[];
        if (!Array.isArray(json)) {
            return [];
        }
        return json.map(path => {
            path = path.replaceAll('\\', '/');
            let name = path;
            if (name.endsWith('/') && name.length > 1) {
                name = name.substring(0, name.length - 1);
            }
            if (!path.endsWith('/')) {
                path += '/';
            }
            if (parent) {
                path = parent.path + path;
            }
            return {
                name,
                expanded: false,
                path,
            };
        });
    } catch (e) {
        return [];
    }
}
