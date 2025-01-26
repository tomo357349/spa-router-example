export function create(tagName, props, children) {
    const el = document.createElement(tagName);
    if (!children) {
        // ignore
    } else if (Array.isArray(children)) {
        children.forEach(c => el.appendChild(c));
    } else if (typeof(children) === 'string') {
        el.innerText = children;
    } else {
        el.appendChild(children);
    }
    if (props) {
        Object.keys(props).forEach(k => {
            if (k.startsWith('on')) {
                el.addEventListener(k.substring(2), props[k]);
            } else if (typeof(props[k]) === 'function') {
                el[k] = props[k];
            } else {
                el.setAttribute(k, props[k]);
            }
        });
    }
    return el;
}