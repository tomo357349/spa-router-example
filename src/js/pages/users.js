import { userService } from "../service/user.js";

export default class UsersPage extends HTMLElement {
    async connectedCallback() {
        const list = await userService.listAll();
        this.innerHTML = `
            <div class="page">
                <h1>Users</h1>
                <ul>
                    ${list
                        .map(e => `<li><a href="/users/${e.id}">${e.name}</a></li>`)
                        .join('')}
                </ul>
            </div>
        `;
    }
}

customElements.define('page-users', UsersPage);
