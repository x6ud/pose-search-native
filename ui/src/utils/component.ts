import {App, Component, createApp} from 'vue';

export function createComponentInstance(component: Component, callback?: (app: App) => void): () => void {
    const app = createApp(component);
    callback && callback(app);
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    app.mount(dom);
    return function () {
        app.unmount();
        dom.remove();
    };
}
