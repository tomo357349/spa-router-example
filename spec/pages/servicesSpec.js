import { trimHtml } from "../support/util.js";
import ServicesPage from "../../src/js/pages/services.js";

describe("home page:", () => {
    it("create element", () => {
        const el = document.createElement("page-services");
        document.body.appendChild(el);
        expect(trimHtml(el.innerHTML)).toBe(trimHtml(`
            <div class="page">
                <h1>Services</h1>
                <ul>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
                    <li>Enim quasi deserunt officiis temporibus ea tempore architecto fugit officia at.</li>
                    <li>Repellendus labore repudiandae sit odio debitis aliquam aspernatur.</li>
                </ul>
            </div>
        `));
        el.remove();
    });
});
