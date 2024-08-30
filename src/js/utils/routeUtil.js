function segmentize(uri) {
    return uri.replace(/(^\/+|\/+$)/g, '').split('/');
}

/**
 * Join uri
 *
 * @param {string} uri (absolute or relative path expression)
 * @param {string} baseUri (absolute path expression)
 */
export function join(uri, baseUri) {
    // return root
    if (!uri) return '/';

    // absolute path
    if (uri.startsWith('/')) return uri;

    if (!baseUri) baseUri = '/';

    if (baseUri.startsWith('.')) throw new Error('baseUri requires an absolute path. baseUri=' + baseUri);

    const [basePathname] = baseUri.split('?');
    const [pathname, pathquery] = uri.split('?');
    const querystring = pathquery ? '?' + pathquery : '';

    const segments = pathname.split('/');

    const baseSegments = basePathname.split('/');
    // /foo/ and /foo means the same path.
    if (baseSegments[baseSegments.length - 1]) {
        baseSegments.push('');
    }

    if (!segments[0]) return basePathname + querystring;

    const editSegments = [].concat(baseSegments);
    editSegments.pop();

    segments.forEach(segment => {
        if (segment === '..') {
            const item = editSegments.pop();
            if (!item) throw new Error('Illegal relative path.');
        } else if (segment !== '.') {
            editSegments.push(segment);
        }
    });

    return editSegments.join('/') + querystring;
}

/**
 * ref.
 * https://github.com/reach/router/blob/master/src/lib/utils.js
 *
 * @param {[]} routes - Route defenitions
 * @param {string} uri - Uri to match
 */
export function match(routes, uri) {
    routes = routes.sort((a, b) => {
        // sorted by DESC
        if (a.path < b.path) return 1;
        else if (a.path > b.path) return -1;
        else return 0;
    });

    const paramRegex = /^:(.+)/;
    let match;
    const [uriPathname] = uri.split('?');
    const uriSegments = segmentize(uriPathname);
    const isRootUri = uriSegments[0] === '/';
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        const routeSegments = segmentize(route.path);
        // const max = Math.max(uriSegments.length, routeSegments.length);
        const max = routeSegments.length;
        let index = 0;
        let missed = false;
        let params = {};
        for (; index < max; index++) {
            const uriSegment = uriSegments[index];
            const routeSegment = routeSegments[index];
            const fallback = routeSegment === '*';

            if (fallback) {
                params['*'] = uriSegments
                    .slice(index)
                    .map(decodeURIComponent)
                    .join('/');
                break;
            }

            if (uriSegment === undefined) {
                missed = true;
                break;
            }

            const dynamicMatch = paramRegex.exec(routeSegment);

            if (dynamicMatch && !isRootUri) {
                let value = decodeURIComponent(uriSegment);
                params[dynamicMatch[1]] = value;
            } else if (routeSegment !== uriSegment) {
                missed = true;
                break;
            }
        }

        if (!missed) {
            match = {
                params,
                ...route
            };
            break;
        }
    }

    return match || null;
}

/**
 * @param {string} uri
 * @param {*} params
 */
export function fill(uri, params) {
    const [uriPathname] = uri.split('?');
    const uriSegments = segmentize(uriPathname);
    const max = uriSegments.length;
    const isRootUri = uriSegments[0] === '/';
    const paramRegex = /^:(.+)/;

    return '/' + uriSegments.map(uriSegment => {
        if (uriSegment === undefined) throw new Error('invalid uri: ' + uri);

        const dynamicMatch = paramRegex.exec(uriSegment);
        if (dynamicMatch && !isRootUri) {
            return params[dynamicMatch[1]];
        }

        return uriSegment;
    }).join('/');
}