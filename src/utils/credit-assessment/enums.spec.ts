import theoretically from "jest-theories";

import { MaritalStatus, Employment } from "@wayke-se/ecom";

import { asEmployment, asMaritalStatus } from "./enums";
import { MARITAL_STATUS, OCCUPATION } from "../../constants/credit-assessment";

describe("As marital status", () => {
    const theories = [
        {
            value: MARITAL_STATUS.married,
            expectedStatus: MaritalStatus.Married,
        },
        { value: MARITAL_STATUS.single, expectedStatus: MaritalStatus.Single },
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
            value: OCCUPATION.fullTimeEmployed,
            expectedEmployment: Employment.FullTimeEmployed,
        },
        { value: OCCUPATION.retired, expectedEmployment: Employment.Retired },
        { value: OCCUPATION.student, expectedEmployment: Employment.Student },
        {
            value: OCCUPATION.selfEmployed,
            expectedEmployment: Employment.SelfEmployed,
        },
        {
            value: OCCUPATION.temporarilyEmployed,
            expectedEmployment: Employment.TemporarilyEmployed,
        },
        { value: OCCUPATION.other, expectedEmployment: Employment.Other },
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
