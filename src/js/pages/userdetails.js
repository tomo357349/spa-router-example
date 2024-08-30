import { userService } from '../service/user.js';
import { HTMLRouter } from '../components/index.js';
import { fill } from '../utils/routeUtil.js';

export default class UserDetails extends HTMLElement {
    static observedAttributes() {
        return ['user-id'];
    }

    async connectedCallback() {
        const parentRoute = HTMLRouter.parentRoute(this.parentNode);
        const parentPath = fill(parentRoute.path, parentRoute.params);

        const id = this.getAttribute('user-id');
        if (!id) return;

        const user = await userService.detail(id);
        if (!user) {
            this.innerHTML = '';
            return;
        }

        this.innerHTML = `
            <div class="page">
                <h1>User Details</h1>
                <div>Name: ${user.name}</div>
                Subjects:<br>
                <ul>
                    ${(user.subjects || [])
                        .map(subject => `<li><a href="${parentPath}/subject/${subject.id}">${subject.name}</a></li>`)
                        .join('')}
                </ul>
                <html-router id="userdetails-router">
                    <router-route path="./subject/:subject-id" component="page-userdetails-subject"></router-route>
                    <router-outlet></router-outlet>
                </html-router>
            </div>`;
    }
}

customElements.define('page-userdetails', UserDetails);
