import { match } from './routeUtil.js';

/**
 * Route object.
 */
export function Route() {
    /**
     * Route path (always fullpath from the root).
     */
    this.path = '';

    /**
     * Web component tag name.
     */
    this.component = '';

    /**
     * HTML Title
     *
     * If this value is blank, the title will not be changed.
     */
    this.title = '';

    /**
     * Parameters received as path variable or query string.
     */
    this.params = {};

    /**
     * Imported module resource url. (lazy load)
     */
    this.url = '';
}

/**
 * SPA Router
 */
function Router() {
    /** @type {Route} */
    let _route = null;

    /** @type {Route[]} */
    let _routes = [];

    /** @type {any} */
    const _listeners = {};

    let _listenerid = 0;
    let _nextid = 0;

    // handle popstate to raise 'update' event to my listeners.
    window.addEventListener('popstate', backTo);

    // handle anchor click event to prevent default and redirect to go() method.
    window.addEventListener('click', evt => {
        const path = evt.composedPath();
        const a = path.find(p => p && p.tagName && (p.tagName.toLowerCase() === 'a'));
        if (!a) return;

        evt.preventDefault();

        const href = a.getAttribute('href');
        router.go(href);
    });

    /**
     * Add new route.
     *
     * when there is same path in _routes, overwrite this.
     *
     * @param {Route} route
     */
    this.add = (route) => {
        const idx = _routes.findIndex(r => r.path === route.path);
        if (idx > -1) _routes.splice(idx, 1, route);
        else _routes.push(route);
    };

    /**
     * Add new routes.
     *
     * @param {Route | Route[]} routes
     */
    this.addAll = (routes) => {
        if (!routes) return;
        if (!Array.isArray(routes)) routes = [ routes ];
        routes.forEach(this.add);
    };

    /**
     * Remove route
     *
     * @param {Route} route
     */
    this.remove = (route) => {
        const idx = _routes.indexOf(route);
        if (idx > -1) {
            return _routes.splice(idx, 1);
        } else {
            const pathidx = _routes.findIndex(r => r.path === route.path);
            return _routes.splice(pathidx, 1);
        }
    };

    /**
     * Add event listener.
     * 
     * @param {string} evtname
     * @param {(evt) => void} callback
     * @returns {number} event id
     */
    this.addEventListener = (evtname, callback) => {
        if (!evtname) throw new Error('Requires evtname');

        _listeners[evtname] = _listeners[evtname] || {};
        const currentid = '' + (++_listenerid);
        _listeners[evtname][currentid] = callback;
        return currentid;
    };

    /**
     * Remove event listener.
     *
     * @param {string} evtname
     * @param {number} evtid
     */
    this.removeEventListener = (evtname, evtid) => {
        if (!_listeners[evtname]) return;
        if (!_listeners[evtname][evtid]) return;
        const fn = _listeners[evtname][evtid];
        delete _listeners[evtname][evtid];
        return fn;
    };

    /**
     * Get current state's route.
     */
    this.here = () => {
        return _route || null;
    };

    /**
     * Go to next state.
     */
    this.go = (uri) => {
        goTo(uri);
    };

    /**
     * Go back to previous state.
     */
    this.back = () => {
        history.back();
    };

    /**
     * Find route by pathname.
     */
    this.match = (path, routes = null) => {
        return match(routes || _routes, path);
    };

    /**
     * Go back to previous state.
     *
     * this method is called when handle popstate event.
     */
    function backTo() {
        const uri = location.pathname;

        const matchedRoute = match(_routes, uri);
        if (!matchedRoute) return;

        _route = matchedRoute;
        dispatchUpdateEvent(uri);
    }

    /**
     * Go to next state.
     */
    function goTo(uri) {
        const matchedRoute = match(_routes, uri);

        if (!matchedRoute) {
            throw new Error("Not found: " + url);
        }

        history.pushState({ id: ++_nextid }, null, uri);

        _route = matchedRoute;
        dispatchUpdateEvent(uri);
    }

    /**
     * Dispatch update route event to all 'update' listeners.
     */
    function dispatchUpdateEvent(uri) {
        const listeners = _listeners['update'];
        if (!listeners) return;

        const evt = new Event('update');
        evt.$route = _route;
        evt.$path = uri;

        Object.keys(listeners).forEach((k) => {
            if (!listeners[k]) return;
            listeners[k](evt);
        });
    }
}

// There is only one Router instance in my SPA.
export const router = new Router();
