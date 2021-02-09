import theoretically from "jest-theories";

import Formatter from "./formatter";

describe("Credit assessed formatter", () => {
    describe("Given down payment", () => {
        const theories = [
            { downPayment: 180000, expected: "180 000 kr" },
            { downPayment: 80, expected: "80 kr" },
            { downPayment: -2, expected: "-2 kr" },
        ];

        theoretically("Given {downPayment}, should be {expected}", theories, (theory) => {
            const paymentDetails: any = {
                getDownPaymentSpec: () => ({
                    current: theory.downPayment,
                }),
            };
            const formatter = new Formatter(paymentDetails);

            const formattedDownPayment = formatter.getDownPayment();

            expect(formattedDownPayment).toBe(theory.expected);
        });
    });

    describe("Given duration", () => {
        const theories = [
            { downPayment: 12, expected: "12 mån" },
            { downPayment: 72, expected: "72 mån" },
        ];

        theoretically("Given {downPayment}, should be {expected}", theories, (theory) => {
            const paymentDetails: any = {
                getDurationSpec: () => ({
                    current: theory.downPayment,
                }),
            };
            const formatter = new Formatter(paymentDetails);

            const formattedDownPayment = formatter.getDuration();

            expect(formattedDownPayment).toBe(theory.expected);
        });
    });
});
