export default class AboutSub1 extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<div class="page">
		  <h2>Sub1</h2>
		</div>
	  `;
	}
}

customElements.define('page-about-sub1', AboutSub1);
