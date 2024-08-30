const users = [
    {
        id: 1001, name: "John Doe", subjects: [
            { id: 1, name: 'Public finance and taxation' },
            { id: 2, name: 'Financial markets and risk' },
        ]
    },
    { id: 1002, name: "Jane Doe" },
    {
        id: 1003, name: "Joe Bloggs", subjects: [
            { id: 1, name: 'Neuropsychology and brain function' },
            { id: 2, name: 'Social behavior and interactions' },
            { id: 3, name: 'Cognitive processes' },
        ]
    },
    { id: 1004, name: "John Smith", subjects: [] },
    { id: 1005, name: "Mary Smith" },
];

function UserService() {
    this.listAll = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const results = users.map(u => {
                    const res = { ...u };
                    delete res.subjects;
                    return res;
                });
                resolve(results);
            });
        });
    };

    this.detail = (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(users.find(u => u.id === +id));
            });
        });
    };
}

export const userService = new UserService();