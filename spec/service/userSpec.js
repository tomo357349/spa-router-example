import { userService } from "../../src/js/service/user.js";

describe("user:", () => {
	describe("listAll():", () => {
		it("find all users.", async () => {
			const users = await userService.listAll();
			expect(users.length).toBe(5);

			let user = users[0];
			expect(user.id).toBe(1001);
			expect(user.name).toBe("John Doe");
			expect(user.subjects).toBeUndefined();
		});
	});

	describe("detail(id):", () => {
		it("find an user.", async () => {
			const user = await userService.detail("1001");
			expect(user.id).toBe(1001);
			expect(user.name).toBe("John Doe");

			const subjects = user.subjects;
			expect(subjects.length).toBe(2);

			const subject = subjects[0];
			expect(subject.id).toBe(1);
			expect(subject.name).toBe("Public finance and taxation");
		});
	});
});