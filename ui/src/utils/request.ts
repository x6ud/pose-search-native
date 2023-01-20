export const BASE_PATH = import.meta.env.DEV ? 'http://localhost:11419' : '';

export function request(url: string, init?: RequestInit) {
    init = init || {};
    if (import.meta.env.DEV) {
        init.mode = 'cors';
    }
    return fetch(BASE_PATH + url, init);
}
