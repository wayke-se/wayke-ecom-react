import theoretically from "jest-theories";

import { PaymentType, MaritalStatus, Employment } from "@wayke-se/ecom";

import { asEmployment, asMaritalStatus, shouldUseCreditAssessment } from "./credit-assessment";

describe("Should use credit assessment", () => {
    describe("Given credit assessment supported in payment options", () => {
        let mockedOptions;

        beforeAll(() => {
            mockedOptions = {
                getPaymentOptions: () => [{
                    type: PaymentType.Loan,
                    loanDetails: {
                        shouldUseCreditScoring: () => true,
                    },
                }],
            };
        });

        describe("Given no choosen payment option", () => {
            it("Should not use credit assessment", () => {
                const result = shouldUseCreditAssessment({} as any, mockedOptions);
                expect(result).toBe(false);
            });
        });

        describe("Given non loan payment option", () => {
            it("Should not use credit assessment", () => {
                const data: any = {
                    payment: {
                        paymentType: PaymentType.Lease,
                    },
                };

                const result = shouldUseCreditAssessment(data, mockedOptions);
                
                expect(result).toBe(false);
            });
        });

        describe("Given loan payment option", () => {
            it("Should use credit assessment", () => {
                const data: any = {
                    payment: {
                        paymentType: PaymentType.Loan,
                    },
                };

                const result = shouldUseCreditAssessment(data, mockedOptions);
                
                expect(result).toBe(true);
            });
        });
    });

    describe("Given credit assessment not supported in payment options", () => {
        let mockedOptions;

        beforeAll(() => {
            mockedOptions = {
                getPaymentOptions: () => [{
                    type: PaymentType.Loan,
                    loanDetails: {
                        shouldUseCreditScoring: () => false,
                    },
                }],
            };
        });

        it("Should not use credit assessment", () => {
            const data: any = {
                payment: {
                    paymentType: PaymentType.Loan,
                },
            };

            const result = shouldUseCreditAssessment(data, mockedOptions);
            
            expect(result).toBe(false);
        });
    });
});

describe("As marital status", () => {
    const theories = [
        { value: "Gift", expectedStatus: MaritalStatus.Married },
        { value: "Singel", expectedStatus: MaritalStatus.Single },
        { value: "asdf", expectedStatus: MaritalStatus.Single },
    ];

    theoretically("Given {value}, should be {expectedStatus}", theories, (theory) => {
        const status = asMaritalStatus(theory.value);
        expect(status).toBe(theory.expectedStatus);
    });
});

describe("As employment", () => {
    const theories = [
        { value: "Fulltidsanställd", expectedEmployment: Employment.FullTimeEmployed },
        { value: "Pensionär", expectedEmployment: Employment.Retired },
        { value: "Student", expectedEmployment: Employment.Student },
        { value: "Egenföretagare", expectedEmployment: Employment.SelfEmployed },
        { value: "Deltidsanställd", expectedEmployment: Employment.TemporarilyEmployed },
        { value: "Annat", expectedEmployment: Employment.Other },
        { value: "asdf", expectedEmployment: Employment.Other },
    ];

    theoretically("Given {value}, should be {expectedEmployment}", theories, (theory) => {
        const employment = asEmployment(theory.value);
        expect(employment).toBe(theory.expectedEmployment);
    });
});
