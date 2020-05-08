const fixtures = require("../test/fixtures");

import {
    PaymentType,
    IOrderOptionsResponse,
    IAvailableInsuranceOption,
    DeliveryType,
    IDeliveryOption,
} from "@wayke-se/ecom";

import { getAllTransitions } from "./ecom-step-transitions";
import EcomStep from "./constants/ecom-step";
import { IEcomData } from "./types";

describe("Get transitions", () => {
    describe("Given step TRADE_IN_EXISTS_CHOOSER", () => {
        it("Should transition to TRADE_IN_CAR_DEFINITION, if trade in should be defined", () => {
            const data: IEcomData = fixtures.create(
                "IEcomData",
                (d: IEcomData) => {
                    d.tradeInCar.wantsToDefineTradeIn = true;
                    return d;
                }
            );

            const step = getAllTransitions()[EcomStep.TRADE_IN_EXISTS_CHOOSER](
                data
            );

            expect(step).toBe(EcomStep.TRADE_IN_CAR_DEFINITION);
        });

        it("Should transition to PAYMENT_METHOD_CHOOSER, if trade in should not be defined", () => {
            const data: IEcomData = fixtures.create(
                "IEcomData",
                (d: IEcomData) => {
                    d.tradeInCar.wantsToDefineTradeIn = false;
                    return d;
                }
            );

            const step = getAllTransitions()[EcomStep.TRADE_IN_EXISTS_CHOOSER](
                data
            );

            expect(step).toBe(EcomStep.PAYMENT_METHOD_CHOOSER);
        });
    });

    describe("Given step TRADE_IN_CAR_DEFINITION", () => {
        it("Should transition to TRADE_IN_CAR_CONDITION, if trade in info is provided", () => {
            const data: IEcomData = fixtures.create(
                "IEcomData",
                (d: IEcomData) => {
                    d.tradeInCar.hasProvidedTradeInInfo = true;
                    return d;
                }
            );

            const step = getAllTransitions()[EcomStep.TRADE_IN_CAR_DEFINITION](
                data
            );

            expect(step).toBe(EcomStep.TRADE_IN_CAR_CONDITION);
        });

        it("Should transition to PAYMENT_METHOD_CHOOSER, if trade in info has not been provided", () => {
            const data: IEcomData = fixtures.create(
                "IEcomData",
                (d: IEcomData) => {
                    d.tradeInCar.hasProvidedTradeInInfo = false;
                    return d;
                }
            );

            const step = getAllTransitions()[EcomStep.TRADE_IN_CAR_DEFINITION](
                data
            );

            expect(step).toBe(EcomStep.PAYMENT_METHOD_CHOOSER);
        });
    });

    describe("Given step TRADE_IN_CAR_CONDITION", () => {
        it("Should transition to TRADE_IN_CONFIRM_CAR, if trade in condition is provided", () => {
            const data: IEcomData = fixtures.create(
                "IEcomData",
                (d: IEcomData) => {
                    d.tradeInCar.hasProvidedTradeInCondition = true;
                    return d;
                }
            );

            const step = getAllTransitions()[EcomStep.TRADE_IN_CAR_CONDITION](
                data
            );

            expect(step).toBe(EcomStep.TRADE_IN_CONFIRM_CAR);
        });

        it("Should transition to PAYMENT_METHOD_CHOOSER, if trade in condition has not been provided", () => {
            const data: IEcomData = fixtures.create(
                "IEcomData",
                (d: IEcomData) => {
                    d.tradeInCar.hasProvidedTradeInCondition = false;
                    return d;
                }
            );

            const step = getAllTransitions()[EcomStep.TRADE_IN_CAR_CONDITION](
                data
            );

            expect(step).toBe(EcomStep.PAYMENT_METHOD_CHOOSER);
        });
    });

    describe("Given step TRADE_IN_CONFIRM_CAR", () => {
        it("Should transition to PAYMENT_METHOD_CHOOSER", () => {
            const step = getAllTransitions()[EcomStep.TRADE_IN_CONFIRM_CAR]();
            expect(step).toBe(EcomStep.PAYMENT_METHOD_CHOOSER);
        });
    });

    describe("Given step PAYMENT_METHOD_CHOOSER", () => {
        describe("Given loan", () => {
            it("Should transition to PAYMENT_FINANCING_DETAILS", () => {
                const data: IEcomData = fixtures.create(
                    "IEcomData",
                    (d: IEcomData) => {
                        d.payment.paymentType = PaymentType.Loan;
                        return d;
                    }
                );
                const orderOptions = fixtures.create("IOrderOptionsResponse");

                const step = getAllTransitions()[
                    EcomStep.PAYMENT_METHOD_CHOOSER
                ](data, orderOptions);

                expect(step).toBe(EcomStep.PAYMENT_FINANCING_DETAILS);
            });
        });

        describe("Given no loan", () => {
            it("Should transition to BANKID_AUTHENTICATION, given no insurance and bank id", () => {
                const data: IEcomData = fixtures.create(
                    "IEcomData",
                    (d: IEcomData) => {
                        d.payment.paymentType = PaymentType.Cash;
                        d.skipBankId = false;
                        return d;
                    }
                );
                const orderOptions: IOrderOptionsResponse = fixtures.create(
                    "IOrderOptionsResponse",
                    (options: IOrderOptionsResponse) => {
                        options.getInsuranceOption = () => null;
                        return options;
                    }
                );

                const step = getAllTransitions()[
                    EcomStep.PAYMENT_METHOD_CHOOSER
                ](data, orderOptions);

                expect(step).toBe(EcomStep.BANKID_AUTHENTICATION);
            });

            it("Should transition to CUSTOMER_INFORMATION_INITIAL, given no insurance and not bank id", () => {
                const data: IEcomData = fixtures.create(
                    "IEcomData",
                    (d: IEcomData) => {
                        d.payment.paymentType = PaymentType.Cash;
                        d.skipBankId = true;
                        return d;
                    }
                );
                const orderOptions: IOrderOptionsResponse = fixtures.create(
                    "IOrderOptionsResponse",
                    (options: IOrderOptionsResponse) => {
                        options.getInsuranceOption = () => null;
                        return options;
                    }
                );

                const step = getAllTransitions()[
                    EcomStep.PAYMENT_METHOD_CHOOSER
                ](data, orderOptions);

                expect(step).toBe(EcomStep.CUSTOMER_INFORMATION_INITIAL);
            });

            it("Should transition to INSURANCE_INFORMATION_DEFINITION, given insurance", () => {
                const data: IEcomData = fixtures.create(
                    "IEcomData",
                    (d: IEcomData) => {
                        d.payment.paymentType = PaymentType.Cash;
                        return d;
                    }
                );
                const insuranceOptions: IAvailableInsuranceOption = fixtures.create(
                    "IAvailableInsuranceOption"
                );
                const orderOptions: IOrderOptionsResponse = fixtures.create(
                    "IOrderOptionsResponse",
                    (options: IOrderOptionsResponse) => {
                        options.getInsuranceOption = () => insuranceOptions;
                        return options;
                    }
                );

                const step = getAllTransitions()[
                    EcomStep.PAYMENT_METHOD_CHOOSER
                ](data, orderOptions);

                expect(step).toBe(EcomStep.INSURANCE_INFORMATION_DEFINITION);
            });
        });
    });

    describe("Given step BANKID_AUTHENTICATION", () => {
        it("Should transition to CUSTOMER_INFORMATION_DETAILS", () => {
            const step = getAllTransitions()[EcomStep.BANKID_AUTHENTICATION]();
            expect(step).toBe(EcomStep.CUSTOMER_INFORMATION_DETAILS);
        });
    });

    describe("Given step CUSTOMER_INFORMATION_INITIAL", () => {
        it("Should transition to CUSTOMER_INFORMATION_DETAILS", () => {
            const step = getAllTransitions()[
                EcomStep.CUSTOMER_INFORMATION_INITIAL
            ]();
            expect(step).toBe(EcomStep.CUSTOMER_INFORMATION_DETAILS);
        });
    });

    describe("Given step CUSTOMER_INFORMATION_DETAILS", () => {
        it("Should transition to DELIVERY_METHOD, given no pickup delivery", () => {
            const data: IEcomData = fixtures.create("IEcomData");
            const orderOptions: IOrderOptionsResponse = fixtures.create(
                "IOrderOptionsResponse",
                (options: IOrderOptionsResponse) => {
                    options.getDeliveryOptions = () => [];
                    return options;
                }
            );

            const step = getAllTransitions()[
                EcomStep.CUSTOMER_INFORMATION_DETAILS
            ](data, orderOptions);

            expect(step).toBe(EcomStep.DELIVERY_METHOD);
        });

        it("Should transition to FINAL_SUMMARY, given pickup delivery", () => {
            const data: IEcomData = fixtures.create("IEcomData");
            const deliveryOption: IDeliveryOption = fixtures.create(
                "IDeliveryOption",
                (option: IDeliveryOption) => {
                    option.type = DeliveryType.Pickup;
                    return option;
                }
            );
            const orderOptions: IOrderOptionsResponse = fixtures.create(
                "IOrderOptionsResponse",
                (options: IOrderOptionsResponse) => {
                    options.getDeliveryOptions = () => [deliveryOption];
                    return options;
                }
            );

            const step = getAllTransitions()[
                EcomStep.CUSTOMER_INFORMATION_DETAILS
            ](data, orderOptions);

            expect(step).toBe(EcomStep.FINAL_SUMMARY);
        });
    });

    describe("Given step DELIVERY_METHOD", () => {
        it("Should transition to FINAL_SUMMARY", () => {
            const step = getAllTransitions()[EcomStep.DELIVERY_METHOD]();
            expect(step).toBe(EcomStep.FINAL_SUMMARY);
        });
    });

    describe("Given step FINAL_SUMMARY", () => {
        it("Should transition to FINAL_CONFIRMATION", () => {
            const step = getAllTransitions()[EcomStep.FINAL_SUMMARY]();
            expect(step).toBe(EcomStep.FINAL_CONFIRMATION);
        });
    });
});
