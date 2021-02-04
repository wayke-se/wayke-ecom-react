import theoretically from "jest-theories";

import { formatPersonalNumber } from "./formatting";

describe("Format personal number", () => {
    describe("Given invalid personal number", () => {
        const theories = [
            { value: null },
            { value: undefined },
            { value: "8402174951" },
            { value: "84021" },
            { value: "asdf" },
        ];
        theoretically("Given {value}, should throw type error", theories, (theory) => {
            expect(() => formatPersonalNumber(theory.value)).toThrow(TypeError);
        });
    });

    describe("Given valid personal number", () => {
        const theories = [
            { value: "198402174951", expected: "198402174951" },
            { value: "20010610-3410", expected: "200106103410" },
        ];
        theoretically("Given {value}, should be {expected}", theories, (theory) => {
            const formatted = formatPersonalNumber(theory.value);
            expect(formatted).toBe(theory.expected);
        });
    });
});