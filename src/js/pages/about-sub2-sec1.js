export default class AboutSub2Sec1 extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<div class="page">
		  <h3>Section1</h3>
		</div>
	  `;
	}
}

customElements.define('page-about-sub2-sec1', AboutSub2Sec1);
