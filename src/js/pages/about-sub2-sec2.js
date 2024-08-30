export default class AboutSub2Sec2 extends HTMLElement {
	static observedAttributes() {
		return ["num"];
	}

	connectedCallback() {
		const num = this.getAttribute("num");
		this.innerHTML = `
		<div class="page">
		    <h3>Section2</h3>
			<p>num:${num}</p>
		</div>
	  `;
	}
}

customElements.define('page-about-sub2-sec2', AboutSub2Sec2);
