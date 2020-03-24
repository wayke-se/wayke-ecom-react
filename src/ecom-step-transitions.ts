import EcomStep from "./constants/ecom-step";

import { IEcomData } from "./types";
import { PaymentType, IOrderOptionsResponse } from "@wayke-se/ecom";

export const getInitialStep = (options: IOrderOptionsResponse): EcomStep => {
    return options.allowsTradeIn()
        ? EcomStep.TRADE_IN_EXISTS_CHOOSER
        : EcomStep.PAYMENT_METHOD_CHOOSER;
};

export const getPrimarySteps = (options: IOrderOptionsResponse): EcomStep[] => {
    const result = [];

    if (options.allowsTradeIn()) {
        result.push(EcomStep.TRADE_IN_EXISTS_CHOOSER);
    }

    result.push(EcomStep.PAYMENT_METHOD_CHOOSER);

    if (options.getInsuranceOption()) {
        result.push(EcomStep.INSURANCE_INFORMATION_DEFINITION);
    }

    result.push(
        EcomStep.CUSTOMER_INFORMATION_INITIAL,
        EcomStep.FINAL_CONFIRMATION
    );

    return result;
};

export const getAllTransitions = () => ({
    [EcomStep.TRADE_IN_EXISTS_CHOOSER]: (data: IEcomData) => {
        if (data.tradeInCar.wantsToDefineTradeIn) {
            return EcomStep.TRADE_IN_CAR_DEFINITION;
        }

        return EcomStep.PAYMENT_METHOD_CHOOSER;
    },
    [EcomStep.TRADE_IN_CAR_DEFINITION]: (data: IEcomData) => {
        if (data.tradeInCar.hasProvidedTradeInInfo) {
            return EcomStep.TRADE_IN_CAR_CONDITION;
        }

        return EcomStep.PAYMENT_METHOD_CHOOSER;
    },
    [EcomStep.TRADE_IN_CAR_CONDITION]: (data: IEcomData) => {
        if (data.tradeInCar.hasProvidedTradeInCondition) {
            return EcomStep.TRADE_IN_CONFIRM_CAR;
        }

        return EcomStep.PAYMENT_METHOD_CHOOSER;
    },
    [EcomStep.TRADE_IN_CONFIRM_CAR]: () => EcomStep.PAYMENT_METHOD_CHOOSER,
    [EcomStep.PAYMENT_METHOD_CHOOSER]: (
        data: IEcomData,
        options: IOrderOptionsResponse
    ) => {
        const isLoan = data.payment.paymentType === PaymentType.Loan;

        if (isLoan) {
            return EcomStep.PAYMENT_FINANCING_DETAILS;
        }
        if (!options.getInsuranceOption()) {
            return EcomStep.CUSTOMER_INFORMATION_INITIAL;
        }

        return EcomStep.INSURANCE_INFORMATION_DEFINITION;
    },
    [EcomStep.PAYMENT_FINANCING_DETAILS]: (
        data: IEcomData,
        options: IOrderOptionsResponse
    ) => {
        if (!options.getInsuranceOption()) {
            return EcomStep.CUSTOMER_INFORMATION_INITIAL;
        }

        return EcomStep.INSURANCE_INFORMATION_DEFINITION;
    },
    [EcomStep.INSURANCE_INFORMATION_DEFINITION]: (data: IEcomData) => {
        if (data.insurance.wantsToSeeInsuranceOptions) {
            return EcomStep.INSURANCE_ALTERNATIVE_CHOOSER;
        }

        return EcomStep.CUSTOMER_INFORMATION_INITIAL;
    },
    [EcomStep.INSURANCE_ALTERNATIVE_CHOOSER]: () =>
        EcomStep.CUSTOMER_INFORMATION_INITIAL,
    [EcomStep.CUSTOMER_INFORMATION_INITIAL]: () =>
        EcomStep.CUSTOMER_INFORMATION_DETAILS,
    [EcomStep.CUSTOMER_INFORMATION_DETAILS]: () => EcomStep.FINAL_CONFIRMATION,
});
