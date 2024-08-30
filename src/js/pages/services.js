export default class ServicesPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="page">
                <h1>Services</h1>
                <ul>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
                    <li>Enim quasi deserunt officiis temporibus ea tempore architecto fugit officia at.</li>
                    <li>Repellendus labore repudiandae sit odio debitis aliquam aspernatur.</li>
                </ul>
            </div>
        `;
    }
}

customElements.define('page-services', ServicesPage);
