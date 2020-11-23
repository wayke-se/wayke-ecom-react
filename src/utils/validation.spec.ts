const fixtures = require("../../test/fixtures");

import { ICustomerObject } from "../types";
import { validateName } from "./validation";

describe("Validate name", () => {
    describe("Given name", () => {
        describe("Given surname and given name", () => {
            it("Should be valid", () => {
                const customer: ICustomerObject = fixtures.create("ICustomerObject");
    
                const isValid = validateName(customer);
    
                expect(isValid).toBe(true);
            });
        });
    
        describe("Given neither surname nor given name", () => {
            it("Should be valid", () => {
                const customer: ICustomerObject = fixtures.create("ICustomerObject", (object) => {
                    object.givenName = null;
                    object.surname = null;
                    return object;
                });
    
                const isValid = validateName(customer);
    
                expect(isValid).toBe(true);
            });
        });
    });

    describe("Given no name", () => {
        describe("Given surname and given name", () => {
            it("Should be valid", () => {
                const customer: ICustomerObject = fixtures.create("ICustomerObject", (object) => {
                    object.name = null;
                    return object;
                });
    
                const isValid = validateName(customer);
    
                expect(isValid).toBe(true);
            });
        });

        describe("Given surname but no given name", () => {
            it("Should not be valid", () => {
                const customer: ICustomerObject = fixtures.create("ICustomerObject", (object) => {
                    object.name = null;
                    object.givenName = null;
                    return object;
                });
    
                const isValid = validateName(customer);
    
                expect(isValid).toBe(false);
            });
        });

        describe("Given given name but no surname", () => {
            it("Should not be valid", () => {
                const customer: ICustomerObject = fixtures.create("ICustomerObject", (object) => {
                    object.name = null;
                    object.surname = null;
                    return object;
                });
    
                const isValid = validateName(customer);
    
                expect(isValid).toBe(false);
            });
        });

        describe("Given neither surname nor given name", () => {
            it("Should not be valid", () => {
                const customer: ICustomerObject = fixtures.create("ICustomerObject", (object) => {
                    object.name = null;
                    object.givenName = null;
                    object.surname = null;
                    return object;
                });
    
                const isValid = validateName(customer);
    
                expect(isValid).toBe(false);
            });
        });
    });
});
