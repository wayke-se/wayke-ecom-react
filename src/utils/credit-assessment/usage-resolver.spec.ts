import { PaymentType } from "@wayke-se/ecom";

import shouldUseCreditAssessment from "./usage-resolver";

describe("Should use credit assessment", () => {
    describe("Given not using bank id", () => {
        it("Should not use credit assessment", () => {
            const data: any = {
                useBankId: false,
            };

            const result = shouldUseCreditAssessment(data, null);

            expect(result).toBe(false);
        });
    });

    describe("Given using bank id", () => {
        let data: any;

        beforeAll(() => {
            data = {
                useBankId: true,
            };
        });

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
                        data,
                        mockedOptions
                    );
                    expect(result).toBe(false);
                });
            });

            describe("Given non loan payment option", () => {
                it("Should not use credit assessment", () => {
                    data.payment = {
                        paymentType: PaymentType.Lease,
                    };

                    const result = shouldUseCreditAssessment(
                        data,
                        mockedOptions
                    );

                    expect(result).toBe(false);
                });
            });

            describe("Given loan payment option", () => {
                it("Should use credit assessment", () => {
                    data.payment = {
                        paymentType: PaymentType.Loan,
                    };

                    const result = shouldUseCreditAssessment(
                        data,
                        mockedOptions
                    );

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
                data.payment = {
                    paymentType: PaymentType.Loan,
                };

                const result = shouldUseCreditAssessment(data, mockedOptions);

                expect(result).toBe(false);
            });
        });
    });
});
