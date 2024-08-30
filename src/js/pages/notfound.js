export default class NotFoundPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="page">
                <h1>Error 404</h1>
            </div>
        `;
    }
}

customElements.define('page-notfound', NotFoundPage);
