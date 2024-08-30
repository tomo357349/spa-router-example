export default class HomePage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="page">
        <h1>Home Page</h1>
        Quick links:
        <ul>
          <li><a href="/users/1002">User: Joe Bloggs</a></li>
          <li><a href="/users/1001/subject/1">User: John Doe / Public finance and taxation</a></li>
        </ul>
      </div>
    `;
  }
}

customElements.define('page-home', HomePage);
