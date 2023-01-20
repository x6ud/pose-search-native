import {createComponentInstance} from '../utils/component';
import AlertDialog from './AlertDialog.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import SelectFolderDialog from './SelectFolderDialog.vue';

export type SelectFolderDialogContext = {
    visible: boolean;
    path?: string;
    callback: (path: string) => void;
}

export function showSelectFolderDialog(path?: string) {
    let unmount: () => void;
    return new Promise<string>(function (resolve) {
        const context: SelectFolderDialogContext = {
            visible: true,
            path,
            callback: function (path: string) {
                unmount();
                resolve(path);
            }
        };
        unmount = createComponentInstance(SelectFolderDialog, app => {
            app.provide('context', context);
        });
    });
}

export type ConfirmDialogContext = {
    visible: boolean;
    message: string;
    callback: (b: boolean) => void;
}

export function showConfirmDialog(message: string) {
    let unmount: () => void;
    return new Promise<boolean>(function (resolve) {
        const context: ConfirmDialogContext = {
            visible: true,
            message,
            callback: function (b: boolean) {
                unmount();
                resolve(b);
            }
        };
        unmount = createComponentInstance(ConfirmDialog, app => {
            app.provide('context', context);
        });
    });
}

export type AlertDialogContext = {
    visible: boolean;
    message: string;
    callback: () => void;
}

export function showAlertDialog(message: string) {
    let unmount: () => void;
    return new Promise<void>(function (resolve) {
        const context: AlertDialogContext = {
            visible: true,
            message,
            callback: function () {
                unmount();
                resolve();
            }
        };
        unmount = createComponentInstance(AlertDialog, app => {
            app.provide('context', context);
        });
    });
}
