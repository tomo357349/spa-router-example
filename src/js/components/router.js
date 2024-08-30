import { router } from '../utils/router.js';
import { join } from '../utils/routeUtil.js';

export class HTMLRouter extends HTMLElement {
    static parentRoute(currentNode) {
        const findParent = (node) => {
            if (!node) return { route: { path: '' } };
            if (node.nodeName.toLowerCase() === 'html-router') {
                return node;
            }
            return findParent(node.parentNode);
        };

        const parentRouter = findParent(currentNode);
        return parentRouter.route;
    }

    constructor() {
        super();

        /** @type {Route} */
        this._currentRoute = null;

        /** @type {Route[]} */
        this._routes = null;

        /** @type {number} */
        this._stateid = 0;
    }

    get outletEl() {
        return this.querySelector("router-outlet");
    }

    get routes() {
        if (this._routes) return this._routes;

        const parentPath = HTMLRouter.parentRoute(this.parentNode).path;

        this._routes = Array.from(this.querySelectorAll("router-route"))
            .filter(node => node.parentNode === this)
            .map(node => ({
                path: join(node.getAttribute('path'), parentPath),
                title: node.getAttribute('title'),
                component: node.getAttribute('component'),
                lazyload: node.getAttribute('lazyload'),
                default: node.getAttribute('default') !== null
            }));
        return this._routes;
    }

    get route() {
        return this._currentRoute;
    }

    get nextid() {
        this._stateid++;
        return this._stateid;
    }

    connectedCallback() {
        const updateRoute = (route) => {
            this.refresh(route);
        };

        router.addAll(this.routes);

        this._listenerid = router.addEventListener('update', (evt) => {
            if (!this.routes.find(r => r.path === evt.$route.path)) return; // ignore
            updateRoute(evt.$route);
        });

        const matchedRoute = router.match(location.pathname, this.routes);
        if (matchedRoute) {
            updateRoute(matchedRoute);
        } else {
            const defaultRoute = this.routes.find(r => r.default);
            if (defaultRoute) updateRoute(defaultRoute);
        }
    }

    disconnectedCallback() {
        if (this._listenerid) {
            router.removeEventListener('update', this._listenerid);
            this._listenerid = null;
        }
        this.routes.forEach(r => {
            router.remove(r);
        });
    }

    /**
     * Refresh current route and view.
     *
     * @param {Route} route
     */
    refresh(route) {
        // Set current route.
        this._currentRoute = route;

        // Remove current view.
        while (this.outletEl.childNodes.length) {
            this.outletEl.childNodes[0].remove();
        }

        if (!route) return;

        const {
            component,
            title,
            params = {},
            lazyload = null
        } = route;

        if (!component) return;

        const updateView = () => {
            const view = document.createElement(component);
            // view.$params = params;
            document.title = title || document.title;
            Object.keys(params)
                .filter(key => key !== '*')
                .forEach(key => view.setAttribute(key, params[key]));

            this.outletEl.appendChild(view);
        };

        // Update view.
        if (lazyload) {
            import(lazyload).then(updateView);
        } else {
            updateView();
        }
    }
}

customElements.define("html-router", HTMLRouter);
