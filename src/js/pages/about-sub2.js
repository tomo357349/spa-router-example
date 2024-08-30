export default class AboutSub2 extends HTMLElement {
	connectedCallback() {
		const list = 'abc'.split('');
		this.innerHTML = `
		<div class="page">
		  <h2>Sub2</h2>
		  <ul>
		  	${list.map((v, i) => `<li><a href="/about/sub2/sec2/${i}">${i}</a></li>`).join('')}
		  </ul>
          <html-router id="about-sub2-router">
            <router-route path="./" title="(void)" component="page-about-sub2-sec1"></router-route>
            <router-route path="./sec1" title="Sub1 Section1" component="page-about-sub2-sec1"></router-route>
            <router-route path="./sec2/:num" title="Sub2 Section2" component="page-about-sub2-sec2"></router-route>
            <router-outlet></router-outlet>
          </html-router>
		</div>
	  `;
	}
}

customElements.define('page-about-sub2', AboutSub2);
