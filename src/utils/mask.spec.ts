import theoretically from "jest-theories";

import { maskText } from "./mask";

describe("Mask text", () => {
    const theories = [
        { text: "", expected: "" },
        { text: "O", expected: "O" },
        { text: "Ak", expected: "A***" },
        { text: "Fre", expected: "Fr***" },
        { text: "Gustav", expected: "Gus***" },
    ];

    theoretically("Given {text}, should be {expected}", theories, (theory) => {
        const masked = maskText(theory.text);
        expect(masked).toBe(theory.expected);
    });
});
