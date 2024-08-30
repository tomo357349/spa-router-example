import { trimHtml, waitLoad } from "../support/util.js";
import UserdetailsPage from "../../src/js/pages/userdetails.js";

describe("userdetails page:", () => {
    it("create element", async () => {
        const parentPath = "/user/1001";

        const parentEl = document.createElement("html-router");
        parentEl._currentRoute = { path: parentPath };
        document.body.appendChild(parentEl);

        const el = document.createElement("page-userdetails");
        el.setAttribute("user-id", "1001");
        parentEl.appendChild(el);
        await waitLoad(el);
        expect(trimHtml(el.innerHTML)).toBe(trimHtml(`
            <div class="page">
                <h1>User Details</h1>
                <div>Name: John Doe</div>
                Subjects:<br>
                <ul>
                    <li><a href="${parentPath}/subject/1">Public finance and taxation</a></li>
                    <li><a href="${parentPath}/subject/2">Financial markets and risk</a></li>
                </ul>
                <html-router id="userdetails-router">
                    <router-route path="./subject/:subject-id" component="page-userdetails-subject"></router-route>
                    <router-outlet></router-outlet>
                </html-router>
            </div>`));

        el.remove();
        parentEl.remove();
    });
});
