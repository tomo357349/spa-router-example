import { join, match, fill } from "../../src/js/utils/routeUtil.js";

describe("routeUtil:", () => {

	describe("match(routes, uri)", () => {
		const routes = [
			{ title: "page1", path: "/page1" },
			{ title: "page2", path: "/page2" },
			{ title: "page3", path: "/page3" },
			{ title: "page4", path: "/page4" },
			{ title: "page4", path: "/page4/content1" },
			{ title: "page4", path: "/page4/content2" },
			{ title: "page4", path: "/page4/content2/:data-id" },
		];

		it("uri is not match one of the routes.", () => {
			const route = match(routes, "/page0");
			expect(route).toBeNull();
		});

		it("uri is exact match one of the routes.", () => {
			const route = match(routes, "/page4");
			expect(JSON.stringify(route)).toBe(JSON.stringify({
				params: {},
				title: "page4",
				path: "/page4"
			}));
		});

		it("uri is partial match one of the routes.", () => {
			const route = match(routes, "/page4/");
			expect(JSON.stringify(route)).toBe(JSON.stringify({
				params: {},
				title: "page4",
				path: "/page4"
			}));
		});

		it("uri is exact match one of the routes.", () => {
			const route = match(routes, "/page4/content2");
			expect(JSON.stringify(route)).toBe(JSON.stringify({
				params: {},
				title: "page4",
				path: "/page4/content2"
			}));
		});

		it("uri with querystring is exact match one of the routes. (ignores querystring)", () => {
			const route = match(routes, "/page4/content1?param1=abc&param2=123");
			expect(JSON.stringify(route)).toBe(JSON.stringify({
				params: {},
				title: "page4",
				path: "/page4/content1"
			}));
		});

		it("uri with querystring is exact match one of the routes. (ignores querystring)", () => {
			const route = match(routes, "/page4/content1?param1=abc&param2=123");
			expect(JSON.stringify(route)).toBe(JSON.stringify({
				params: {},
				title: "page4",
				path: "/page4/content1"
			}));
		});

		it("uri with path variable is exact match one of the routes.", () => {
			const route = match(routes, "/page4/content2/123");
			expect(JSON.stringify(route)).toBe(JSON.stringify({
				params: {
					"data-id": "123"
				},
				title: "page4",
				path: "/page4/content2/:data-id"
			}));
		});
	});

	describe("join(uri, baseUri):", () => {
		it("baseUri is an absolute path.", () => {
			// /foo/ and /foo means the same path.
			expect(join("bar", "/foo/")).toBe("/foo/bar");
			expect(join("bar", "/foo")).toBe("/foo/bar");
		});

		it("baseUri is not an absolute path.", () => {
			expect(join("bar", "foo")).toBe("foo/bar");
		});

		it("baseUri is a relative path.", () => {
			expect(() => {
				join("bar", "../foo");
			}).toThrowError("baseUri requires an absolute path. baseUri=../foo");
		});

		it("uri is an absolute path. (like /xxx)", () => {
			expect(join("/xxx", "/foo/bar")).toBe("/xxx");
			expect(join("/xxx/", "/foo/bar")).toBe("/xxx/");
		});

		it("uri is an absolute path. (like /xxx/yyy)", () => {
			expect(join("/xxx/yyy", "/foo/bar")).toBe("/xxx/yyy");
		});

		it("uri is a relative path. (like ./xxx)", () => {
			expect(join("./xxx", "/foo/bar/baz")).toBe("/foo/bar/baz/xxx");
			expect(join("./xxx/", "/foo/bar/baz")).toBe("/foo/bar/baz/xxx/");
		});

		it("uri is a relative path. (like ./xxx/yyy)", () => {
			expect(join("./xxx/yyy", "/foo/bar/baz")).toBe("/foo/bar/baz/xxx/yyy");
		});

		it("uri is a relative path. (like ../xxx)", () => {
			expect(join("../xxx", "/foo/bar/baz")).toBe("/foo/bar/xxx");
		});

		it("uri is a relative path. (like ../xxx/yyy)", () => {
			expect(join("../xxx/yyy", "/foo/bar/baz")).toBe("/foo/bar/xxx/yyy");
		});

		it("uri is a relative path. (like ../../xxx)", () => {
			expect(join("../../../xxx", "/foo/bar/baz")).toBe("/xxx");
		});

		it("uri is a relative path. and overflow the path tree.", () => {
			expect(() => {
				join("../../../../xxx", "/foo/bar/baz");
			}).toThrowError("Illegal relative path.");
		});

		it("baseUri contains querystring. (ignore)", () => {
			// ?a=b, /users?b=c => /users?a=b
			expect(join("./xxx", "/foo/bar/baz?str=abc&num=123")).toBe("/foo/bar/baz/xxx");
		});

		it("uri contains querystring.", () => {
			// ?a=b, /users?b=c => /users?a=b
			expect(join("./xxx?str=abc&num=123", "/foo/bar/baz")).toBe("/foo/bar/baz/xxx?str=abc&num=123");
		});
	});

	describe("fill(uri, params):", () => {
		it("params contains a string.", () => {
			expect(fill("/foo/:str", { str: "bar" })).toBe("/foo/bar");
		});

		it("params contains another string.", () => {
			expect(fill("/foo/:str1", { str2: "bar" })).toBe("/foo/");
		});

		it("params contains a string and a number.", () => {
			expect(fill("/foo/:str/:num", { str: "bar", num: 123 })).toBe("/foo/bar/123");
		});
	});
});
