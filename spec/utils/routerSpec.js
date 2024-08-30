import { router } from "../../src/js/utils/router.js";
import HomePage from "../../src/js/pages/home.js";

describe("router:", () => {
	describe("go(uri)", () => {
		it("routes has target path.", () => {
			router.add({ path: "/home", component: "page-home" });
			router.go("/home");
			expect(location.pathname).toBe("/home");
			expect(location.search).toBe("");
		});
	});
});