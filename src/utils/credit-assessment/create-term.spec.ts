import theoretically from "jest-theories";

import createTerm from "./create-term";

describe("Create term", () => {
    describe("Given invalid months", () => {
        const theories = [
            { value: null },
            { value: undefined },
            { value: 13 },
            { value: -12 },
            { value: 0 },
        ];

        theoretically("given {value}, shoudl throw", theories, (theory) => {
            expect(() => createTerm(theory.value)).toThrow(TypeError);
        });
    });

    describe("Given valid months", () => {
        const theories = [
            { value: 12, expectedTerm: "12months" },
            { value: 24, expectedTerm: "24months" },
            { value: 36, expectedTerm: "36months" },
            { value: 48, expectedTerm: "48months" },
            { value: 60, expectedTerm: "60months" },
            { value: 72, expectedTerm: "72months" },
            { value: 84, expectedTerm: "84months" },
        ];
        
        theoretically("given {value}, should be {expectedTerm}", theories, (theory) => {
            const term = createTerm(theory.value);
            expect(term).toBe(theory.expectedTerm);
        });
    });
});
