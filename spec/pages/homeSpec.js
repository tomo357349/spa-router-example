import { trimHtml } from "../support/util.js";
import HomePage from "../../src/js/pages/home.js";

describe("home page:", () => {
    it("create element", () => {
        const el = document.createElement("page-home");
        document.body.appendChild(el);
        expect(trimHtml(el.innerHTML)).toBe(trimHtml(`
            <div class="page">
                <h1>Home Page</h1>
                Quick links:
                <ul>
                    <li><a href="/users/1002">User: Joe Bloggs</a></li>
                    <li><a href="/users/1001/subject/1">User: John Doe / Public finance and taxation</a></li>
                </ul>
            </div>
        `));
        el.remove();
    });
});
