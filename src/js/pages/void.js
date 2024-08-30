export default class VoidPage extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div class="page"></div>
		`;
	}
}

customElements.define('page-void', VoidPage);
