import theoretically from "jest-theories";

import { MaritalStatus, Employment } from "@wayke-se/ecom";

import { asEmployment, asMaritalStatus } from "./enums";

describe("As marital status", () => {
    const theories = [
        { value: "Gift", expectedStatus: MaritalStatus.Married },
        { value: "Singel", expectedStatus: MaritalStatus.Single },
        { value: "asdf", expectedStatus: MaritalStatus.Single },
    ];

    theoretically(
        "Given {value}, should be {expectedStatus}",
        theories,
        (theory) => {
            const status = asMaritalStatus(theory.value);
            expect(status).toBe(theory.expectedStatus);
        }
    );
});

describe("As employment", () => {
    const theories = [
        {
            value: "Fulltidsanställd",
            expectedEmployment: Employment.FullTimeEmployed,
        },
        { value: "Pensionär", expectedEmployment: Employment.Retired },
        { value: "Student", expectedEmployment: Employment.Student },
        {
            value: "Egenföretagare",
            expectedEmployment: Employment.SelfEmployed,
        },
        {
            value: "Deltidsanställd",
            expectedEmployment: Employment.TemporarilyEmployed,
        },
        { value: "Annat", expectedEmployment: Employment.Other },
        { value: "asdf", expectedEmployment: Employment.Other },
    ];

    theoretically(
        "Given {value}, should be {expectedEmployment}",
        theories,
        (theory) => {
            const employment = asEmployment(theory.value);
            expect(employment).toBe(theory.expectedEmployment);
        }
    );
});
