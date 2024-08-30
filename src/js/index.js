export * from './utils/index.js';
export * from './components/index.js';
export * from './pages/index.js';

export default class IndexPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/users">Users</a></li>
                    <li><a href="/services">Services</a></li>
                    <li><a href="/about">About Us</a></li>
                </ul>
            </nav>
            <html-router id="router">
                <router-route path="/" title="Home" component="page-home" default></router-route>
                <router-route path="/users" title="Users" component="page-users"></router-route>
                <router-route path="/users/:user-id" title="User Details" component="page-userdetails"></router-route>
                <router-route path="/services" title="Services" component="page-services" lazyload="/js/pages/services.js"></router-route>
                <router-route path="/about" title="About Us" component="page-about"></router-route>
                <router-outlet></router-outlet>
            </html-router>
        `;
    }
}

customElements.define('page-index', IndexPage);
