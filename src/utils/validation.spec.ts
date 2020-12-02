import { validateName } from "./validation";

describe("Validate name", () => {
    describe("Given surname and given name", () => {
        it("Should be valid", () => {
            const isValid = validateName("Willard", "Sharples");
            expect(isValid).toBe(true);
        });
    });

    describe("Given surname but no given name", () => {
        it("Should not be valid", () => {
            const isValid = validateName(null, "Terry");
            expect(isValid).toBe(false);
        });
    });

    describe("Given given name but no surname", () => {
        it("Should not be valid", () => {
            const isValid = validateName("Mehreen", null);
            expect(isValid).toBe(false);
        });
    });

    describe("Given neither surname nor given name", () => {
        it("Should not be valid", () => {
            const isValid = validateName(null, null);
            expect(isValid).toBe(false);
        });
    });
});
