import '../utils/index.js';
import { create as $el } from '../utils/element.js';
import '../components/index.js';
import "./home.js";
// lazy load
// import "./about.js";
// import "./about-sub1.js";
// import "./about-sub2.js";
// import "./about-sub2-sec1.js";
// import "./about-sub2-sec2.js";
import "./notfound.js";
// lazy load
// import "./users.js";
// import "./userdetails.js";
// import "./userdetails-subject.js";
import "./void.js";

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
        `;

        this.appendChild($el('html-router', { id: 'router'}, [
            $el('router-route', { path: '/', title: 'Home', component: "page-home", default: true }),
            $el('router-route', { path: '/users', title: 'Users', component: "page-users", $lazyload: () => {
                return import('./users.js');
            } }),
            $el('router-route', { path: '/users/:user-id', title: 'User Details', component: "page-userdetails", $lazyload: () => {
                return import('./userdetails.js');
            } }),
            $el('router-route', { path: '/services', title: 'Services', component: "page-services", $lazyload: () => {
                return import('./services.js');
            } }),
            $el('router-route', { path: '/about', title: 'About Us', component: "page-about", $lazyload: () => {
                return import('./about.js');
            } }),
            $el('router-outlet'),
        ]));
    }
}

customElements.define('page-index', IndexPage);
