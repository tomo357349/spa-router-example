import { HTMLRouter } from '../components/index.js';

export default class AboutUsPage extends HTMLElement {
  connectedCallback() {
    const parentPath = HTMLRouter.parentRoute(this.parentNode).path;

    this.innerHTML = `
      <div class="page">
        <h1>About Us</h1>
        <ul>
            <li><a href="${parentPath}">Root</a></li>
            <li><a href="${parentPath}/sub1">Sub1</a></li>
            <li><a href="${parentPath}/sub2">Sub2</a></li>
            <li><a href="${parentPath}/sub2/sec2/9">Sub2/Sec2/9</a></li>
        </ul>
        <html-router id="about-router">
            <router-route path="${parentPath}/" component="page-void" default></router-route>
            <router-route path="${parentPath}/sub1" component="page-about-sub1"></router-route>
            <router-route path="${parentPath}/sub2" component="page-about-sub2"></router-route>
            <router-outlet></router-outlet>
        </html-router>
      </div>
    `;
  }
}

customElements.define('page-about', AboutUsPage);
