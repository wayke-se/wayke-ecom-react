const fixtures = require("../test/fixtures");

import {
    PaymentType,
    IOrderOptionsResponse,
    IAvailableInsuranceOption,
    DeliveryType,
    IDeliveryOption,
} from "@wayke-se/ecom";

import {
    getAllTransitions,
    getIdentificationStep,
} from "./ecom-step-transitions";
import EcomStep from "./constants/ecom-step";
import { IEcomData } from "./types";
import { IAccessory } from "@wayke-se/ecom/dist-types/orders/types";

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
            it("Should transition to BANKID_AUTHENTICATION, given bank id", () => {
                const data: IEcomData = fixtures.create(
                    "IEcomData",
                    (d: IEcomData) => {
                        d.payment.paymentType = PaymentType.Cash;
                        d.useBankId = true;
                        return d;
                    }
                );
                const orderOptions: IOrderOptionsResponse = fixtures.create(
                    "IOrderOptionsResponse"
                );

                const step = getAllTransitions()[
                    EcomStep.PAYMENT_METHOD_CHOOSER
                ](data, orderOptions);

                expect(step).toBe(EcomStep.BANKID_AUTHENTICATION);
            });

            it("Should transition to CUSTOMER_INFORMATION_INITIAL, given not bank id", () => {
                const data: IEcomData = fixtures.create(
                    "IEcomData",
                    (d: IEcomData) => {
                        d.payment.paymentType = PaymentType.Cash;
                        d.useBankId = false;
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
        describe("Given insurance options", () => {
            it("Should transition to INSURANCE_INFORMATION_DEFINITION", () => {
                const data: IEcomData = fixtures.create("IEcomData");
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
                    EcomStep.CUSTOMER_INFORMATION_DETAILS
                ](data, orderOptions);

                expect(step).toBe(EcomStep.INSURANCE_INFORMATION_DEFINITION);
            });
        });

        describe("Given no insurance options", () => {
            describe("Given no pickup delivery method", () => {
                describe("Given no accessories", () => {
                    it("Should transition to DELIVERY_METHOD", () => {
                        const data: IEcomData = fixtures.create("IEcomData");
                        const orderOptions: IOrderOptionsResponse = fixtures.create(
                            "IOrderOptionsResponse",
                            (options: IOrderOptionsResponse) => {
                                options.getDeliveryOptions = () => [];
                                options.getInsuranceOption = () => null;
                                options.getAccessories = () => [];
                                return options;
                            }
                        );

                        const step = getAllTransitions()[
                            EcomStep.CUSTOMER_INFORMATION_DETAILS
                        ](data, orderOptions);

                        expect(step).toBe(EcomStep.DELIVERY_METHOD);
                    });
                });

                describe("Given accessories", () => {
                    it("Should transition to ACCESORIES_CHOOSER", () => {
                        const data: IEcomData = fixtures.create("IEcomData");
                        const accessory: IAccessory = fixtures.create(
                            "IAccessory"
                        );
                        const orderOptions: IOrderOptionsResponse = fixtures.create(
                            "IOrderOptionsResponse",
                            (options: IOrderOptionsResponse) => {
                                options.getDeliveryOptions = () => [];
                                options.getInsuranceOption = () => null;
                                options.getAccessories = () => [accessory];
                                return options;
                            }
                        );

                        const step = getAllTransitions()[
                            EcomStep.CUSTOMER_INFORMATION_DETAILS
                        ](data, orderOptions);

                        expect(step).toBe(EcomStep.ACCESORIES_CHOOSER);
                    });
                });
            });

            describe("Given single pickup delivery method", () => {
                describe("Given no accessories", () => {
                    it("Should transition to FINAL_SUMMARY", () => {
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
                                options.getDeliveryOptions = () => [
                                    deliveryOption,
                                ];
                                options.getInsuranceOption = () => null;
                                options.getAccessories = () => [];
                                return options;
                            }
                        );

                        const step = getAllTransitions()[
                            EcomStep.CUSTOMER_INFORMATION_DETAILS
                        ](data, orderOptions);

                        expect(step).toBe(EcomStep.FINAL_SUMMARY);
                    });
                });

                describe("Given accessories", () => {
                    it("Should transition to ACCESORIES_CHOOSER", () => {
                        const data: IEcomData = fixtures.create("IEcomData");
                        const accessory: IAccessory = fixtures.create(
                            "IAccessory"
                        );
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
                                options.getDeliveryOptions = () => [
                                    deliveryOption,
                                ];
                                options.getInsuranceOption = () => null;
                                options.getAccessories = () => [accessory];
                                return options;
                            }
                        );

                        const step = getAllTransitions()[
                            EcomStep.CUSTOMER_INFORMATION_DETAILS
                        ](data, orderOptions);

                        expect(step).toBe(EcomStep.ACCESORIES_CHOOSER);
                    });
                });
            });
        });
    });

    describe("Given step INSURANCE_INFORMATION_DEFINITION", () => {
        describe("Given wants to see insurance options", () => {
            it("Should transition to INSURANCE_ALTERNATIVE_CHOOSER", () => {
                const data: IEcomData = fixtures.create("IEcomData", (d) => {
                    d.insurance.wantsToSeeInsuranceOptions = true;
                    return d;
                });
                const orderOptions: IOrderOptionsResponse = fixtures.create(
                    "IOrderOptionsResponse",
                    (options: IOrderOptionsResponse) => {
                        options.getAccessories = () => [];
                        return options;
                    }
                );

                const step = getAllTransitions()[
                    EcomStep.INSURANCE_INFORMATION_DEFINITION
                ](data, orderOptions);

                expect(step).toBe(EcomStep.INSURANCE_ALTERNATIVE_CHOOSER);
            });
        });
        describe("Given not wants to insurance options flag", () => {
            let data: IEcomData;

            beforeAll(() => {
                data = fixtures.create("IEcomData", (d: IEcomData) => {
                    d.insurance.wantsToSeeInsuranceOptions = false;
                    return d;
                });
            });

            describe("Given no pickup delivery method", () => {
                describe("Given no accessories", () => {
                    it("Should transition to DELIVERY_METHOD", () => {
                        const orderOptions: IOrderOptionsResponse = fixtures.create(
                            "IOrderOptionsResponse",
                            (options: IOrderOptionsResponse) => {
                                options.getDeliveryOptions = () => [];
                                options.getAccessories = () => [];
                                return options;
                            }
                        );

                        const step = getAllTransitions()[
                            EcomStep.INSURANCE_INFORMATION_DEFINITION
                        ](data, orderOptions);

                        expect(step).toBe(EcomStep.DELIVERY_METHOD);
                    });
                });

                describe("Given accessories", () => {
                    it("Should transition to ACCESORIES_CHOOSER", () => {
                        const accessory: IAccessory = fixtures.create(
                            "IAccessory"
                        );
                        const orderOptions: IOrderOptionsResponse = fixtures.create(
                            "IOrderOptionsResponse",
                            (options: IOrderOptionsResponse) => {
                                options.getDeliveryOptions = () => [];
                                options.getAccessories = () => [accessory];
                                return options;
                            }
                        );

                        const step = getAllTransitions()[
                            EcomStep.INSURANCE_INFORMATION_DEFINITION
                        ](data, orderOptions);

                        expect(step).toBe(EcomStep.ACCESORIES_CHOOSER);
                    });
                });
            });

            describe("Given single pickup delivery method", () => {
                describe("Given no accessories", () => {
                    it("Should transition to FINAL_SUMMARY", () => {
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
                                options.getDeliveryOptions = () => [
                                    deliveryOption,
                                ];
                                options.getAccessories = () => [];
                                return options;
                            }
                        );

                        const step = getAllTransitions()[
                            EcomStep.INSURANCE_INFORMATION_DEFINITION
                        ](data, orderOptions);

                        expect(step).toBe(EcomStep.FINAL_SUMMARY);
                    });
                });

                describe("Given accessories", () => {
                    it("Should transition to ACCESSORIES_CHOOSER", () => {
                        const accessory: IAccessory = fixtures.create(
                            "IAccessory"
                        );
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
                                options.getDeliveryOptions = () => [
                                    deliveryOption,
                                ];
                                options.getAccessories = () => [accessory];
                                return options;
                            }
                        );

                        const step = getAllTransitions()[
                            EcomStep.INSURANCE_INFORMATION_DEFINITION
                        ](data, orderOptions);

                        expect(step).toBe(EcomStep.ACCESORIES_CHOOSER);
                    });
                });
            });
        });
    });

    describe("Given step INSURANCE_ALTERNATIVE_CHOOSER", () => {
        describe("Given no pickup delivery method", () => {
            describe("Given no accessories", () => {
                it("Should transition to DELIVERY_METHOD", () => {
                    const data: IEcomData = fixtures.create("IEcomData");
                    const orderOptions: IOrderOptionsResponse = fixtures.create(
                        "IOrderOptionsResponse",
                        (options: IOrderOptionsResponse) => {
                            options.getDeliveryOptions = () => [];
                            options.getAccessories = () => [];
                            return options;
                        }
                    );

                    const step = getAllTransitions()[
                        EcomStep.INSURANCE_ALTERNATIVE_CHOOSER
                    ](data, orderOptions);

                    expect(step).toBe(EcomStep.DELIVERY_METHOD);
                });
            });

            describe("Given accessories", () => {
                it("Should transition to ACCESORIES_CHOOSER", () => {
                    const data: IEcomData = fixtures.create("IEcomData");
                    const accessory: IAccessory = fixtures.create("IAccessory");
                    const orderOptions: IOrderOptionsResponse = fixtures.create(
                        "IOrderOptionsResponse",
                        (options: IOrderOptionsResponse) => {
                            options.getDeliveryOptions = () => [];
                            options.getAccessories = () => [accessory];
                            return options;
                        }
                    );

                    const step = getAllTransitions()[
                        EcomStep.INSURANCE_ALTERNATIVE_CHOOSER
                    ](data, orderOptions);

                    expect(step).toBe(EcomStep.ACCESORIES_CHOOSER);
                });
            });
        });

        describe("Given single pickup delivery method", () => {
            describe("Given no accessories", () => {
                it("Should transition to FINAL_SUMMARY", () => {
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
                            options.getAccessories = () => [];
                            return options;
                        }
                    );

                    const step = getAllTransitions()[
                        EcomStep.INSURANCE_ALTERNATIVE_CHOOSER
                    ](data, orderOptions);

                    expect(step).toBe(EcomStep.FINAL_SUMMARY);
                });
            });

            describe("Given no accessories", () => {
                it("Should transition to ACCESORIES_CHOOSER", () => {
                    const data: IEcomData = fixtures.create("IEcomData");
                    const accessory: IAccessory = fixtures.create("IAccessory");
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
                            options.getAccessories = () => [accessory];
                            return options;
                        }
                    );

                    const step = getAllTransitions()[
                        EcomStep.INSURANCE_ALTERNATIVE_CHOOSER
                    ](data, orderOptions);

                    expect(step).toBe(EcomStep.ACCESORIES_CHOOSER);
                });
            });
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

    describe("Given step CREDIT_ASSESSMENT_INFORMATION", () => {
        it("Should transition to CREDIT_ASSESSMENT_SIGNING", () => {
            const step = getAllTransitions()[
                EcomStep.CREDIT_ASSESSMENT_INFORMATION
            ]();
            expect(step).toBe(EcomStep.CREDIT_ASSESSMENT_SIGNING);
        });
    });

    describe("Given step CREDIT_ASSESSMENT_SIGNING", () => {
        it("Should transition to CREDIT_ASSESSED", () => {
            const step = getAllTransitions()[
                EcomStep.CREDIT_ASSESSMENT_SIGNING
            ]();
            expect(step).toBe(EcomStep.CREDIT_ASSESSED);
        });
    });

    describe("Given step CREDIT_ASSESSED", () => {
        it("Should transition to CREDIT_ASSESSED", () => {
            const step = getAllTransitions()[EcomStep.CREDIT_ASSESSED]();
            expect(step).toBe(EcomStep.CUSTOMER_INFORMATION_DETAILS);
        });
    });
});

describe("Get identification step", () => {
    describe("Given use bank id", () => {
        describe("Given credit assessment", () => {
            it("Should return credit assessment information step", () => {
                const step = getIdentificationStep(true, true);
                expect(step).toBe(EcomStep.CREDIT_ASSESSMENT_INFORMATION);
            });
        });

        describe("Given no credit assessment", () => {
            it("Should return bank id authentication step", () => {
                const step = getIdentificationStep(true);
                expect(step).toBe(EcomStep.BANKID_AUTHENTICATION);
            });
        });
    });

    describe("Given no bank id", () => {
        it("Should return initial customer information step", () => {
            const step = getIdentificationStep(false);
            expect(step).toBe(EcomStep.CUSTOMER_INFORMATION_INITIAL);
        });
    });
});
