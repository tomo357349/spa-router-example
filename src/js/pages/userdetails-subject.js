import { userService } from '../service/user.js';

export default class UserDetailsSubject extends HTMLElement {
    static observedAttributes() {
        return ['subject-id'];
    }

    async connectedCallback() {
        // const parentParams = HTMLRouter.parentParams(this.parentNode);
        // const userId = parentParams['user-id'];
        const userId = this.getAttribute('user-id');
        const subjectId = this.getAttribute('subject-id');
        if (!userId || !subjectId) return;
        const user = await userService.detail(userId) || {};
        const subject = (user.subjects || []).find(e => e.id === +subjectId) || {};
        this.innerHTML = `
            <div class="page">
                <h2>${subject.name}</h2>
            </div>
    `;
    }
}

customElements.define('page-userdetails-subject', UserDetailsSubject);
