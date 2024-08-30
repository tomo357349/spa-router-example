import { trimHtml, waitLoad } from "../support/util.js";
import { router } from "../../src/js/utils/router.js";

class Test1Page extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div class="page"><h1>Page1</h1></div>`;
    }
}
customElements.define('page-test1', Test1Page);

class Test2Page extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="page">
                <h1>Page2</h1>
                <html-router id="second-router">
                    <router-route path="./sub1" component="page-test-sub1"></router-route>
                    <router-outlet id="second-outlet"></router-outlet>
                </html-router>
            </div>
        `;
    }
}
customElements.define('page-test2', Test2Page);

class TestSub1Page extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div class="page"><h2>Sub1</h2></div>`;
    }
}
customElements.define('page-test-sub1', TestSub1Page);

describe("router:", () => {
    it("go(uri) / back()", (done) => {
        const routes = [
            { path: "/page1", component: "page-test1" },
            { path: "/page2", component: "page-test2" },
        ];

        // register all routes.
        routes.forEach(route => router.add(route));

        let hndl = null;

        new Promise(resolve => {
            // go to page1
            hndl = router.addEventListener('update', function (evt) {
                expect(evt.$route.path).toBe("/page1");
                router.removeEventListener('update', hndl);
                    hndl = null;
                    resolve();
            });
            router.go("/page1");
        }).then(() => {
            return new Promise(resolve => {
                // go to page2
                hndl = router.addEventListener('update', function (evt) {
                    expect(evt.$route.path).toBe("/page2");
                    router.removeEventListener('update', hndl);
                    hndl = null;
                    resolve();
                });
                router.go("/page2");
            });
        }).then(() => {
            return new Promise(resolve => {
                // back to page1
                hndl = router.addEventListener('update', function (evt) {
                    expect(evt.$route.path).toBe("/page1");
                    router.removeEventListener('update', hndl);
                    hndl = null;
                    resolve();
                });
                router.back();
            });
        }).then(() => {
            // unregister all routes.
            routes.forEach(route => router.remove(route));
            done();
        });
    });

    it("go(uri) / partial", () => {
        const hndl = router.addEventListener('update', function (evt) {
            expect(evt.$route.path).toBe("/page1");
        });

        const routes = [
            { path: "/page1", component: "page-test1" },
            { path: "/page2", component: "page-test2" },
        ];

        // register all routes.
        routes.forEach(route => router.add(route));


        try {
            router.go("/page1");
            // success to route to that is match with "/page1".
        } catch (err) {
            fail();
        }

        try {
            router.go("/page1/any");
            // success to go to that is started with "/page1".
            // (it will processed remaining route "/any" on "/page1" component.)
        } catch (err) {
            fail();
        }

        // unregister all routes.
        routes.forEach(route => router.remove(route));

        router.removeEventListener('update', hndl);

        try {
            // already removed.
            router.go("/page1");
            fail();
        } catch (err) {
            // ignore
            // routing to that is not on routes, throw error.
        }
    });

    it("go(url)", () => {
        const el = document.createElement("div");
        el.innerHTML = `
            <html-router id="first-router">
                <router-route path="/page1" component="page-test1"></router-route>
                <router-route path="/page2" component="page-test2"></router-route>
                <router-outlet id="first-outlet"></router-outlet>
            </html-router>
        `;
        document.body.appendChild(el);
        router.go("/page1");
        const outletEl = el.querySelector("#first-outlet");
        waitLoad(outletEl);
        expect(trimHtml(outletEl.innerHTML)).toBe(`<page-test1><div class="page"><h1>Page1</h1></div></page-test1>`);
        el.remove();
    });

    it("go(url) / jump to nested route directly.", () => {
        const el = document.createElement("div");
        el.innerHTML = `
            <html-router id="first-router">
                <router-route path="/page2" component="page-test2"></router-route>
                <router-outlet id="first-outlet"></router-outlet>
            </html-router>
        `;
        document.body.appendChild(el);

        // the uri is processed twice in html-router.
        // 1. listen 'update' event from router.
        // 2. connect to DOM itself.
        //
        // '<html-router id="first-router">' in 'el' does not have web component 'page-test-sub1' for '/sub1' now.
        // but on connecting to '/page2', loaded web component '<html-router id="second-router">' in 'page-test2' processes the uri again.
        router.go("/page2/sub1");
        const outletEl = el.querySelector("#first-outlet");
        waitLoad(outletEl);
        expect(trimHtml(outletEl.innerHTML)).toBe(trimHtml(`
            <page-test2>
                <div class="page">
                    <h1>Page2</h1>
                    <html-router id="second-router">
                        <router-route path="./sub1" component="page-test-sub1"></router-route>
                        <router-outlet id="second-outlet">
                            <page-test-sub1>
                                <div class="page">
                                    <h2>Sub1</h2>
                                </div>
                            </page-test-sub1>
                        </router-outlet>
                    </html-router>
                </div>
            </page-test2>
        `));
        el.remove();
    });
});
