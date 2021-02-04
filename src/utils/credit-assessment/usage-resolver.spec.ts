import { PaymentType } from "@wayke-se/ecom";

import shouldUseCreditAssessment from "./usage-resolver";

describe("Should use credit assessment", () => {
    describe("Given credit assessment supported in payment options", () => {
        let mockedOptions;

        beforeAll(() => {
            mockedOptions = {
                getPaymentOptions: () => [
                    {
                        type: PaymentType.Loan,
                        loanDetails: {
                            shouldUseCreditScoring: () => true,
                        },
                    },
                ],
            };
        });

        describe("Given no choosen payment option", () => {
            it("Should not use credit assessment", () => {
                const result = shouldUseCreditAssessment(
                    {} as any,
                    mockedOptions
                );
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
                getPaymentOptions: () => [
                    {
                        type: PaymentType.Loan,
                        loanDetails: {
                            shouldUseCreditScoring: () => false,
                        },
                    },
                ],
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
