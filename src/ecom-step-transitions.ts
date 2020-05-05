import {
    PaymentType,
    IOrderOptionsResponse,
    DeliveryType,
} from "@wayke-se/ecom";

import EcomStep from "./constants/ecom-step";
import { IEcomData } from "./types";

export const getInitialStep = (options: IOrderOptionsResponse): EcomStep => {
    return options.allowsTradeIn()
        ? EcomStep.TRADE_IN_EXISTS_CHOOSER
        : EcomStep.PAYMENT_METHOD_CHOOSER;
};

export const getIdentificationStep = (options: IOrderOptionsResponse) => {
    const useBankId = options.useBankId();
    return useBankId
        ? EcomStep.BANKID_AUTHENTICATION
        : EcomStep.CUSTOMER_INFORMATION_INITIAL;
};

const emptyList = [];
export const getPrimarySteps = (options: IOrderOptionsResponse): EcomStep[] => {
    const result = [];

    if (options.allowsTradeIn()) {
        result.push(EcomStep.TRADE_IN_EXISTS_CHOOSER);
    }

    result.push(EcomStep.PAYMENT_METHOD_CHOOSER);

    if (options.getInsuranceOption()) {
        result.push(EcomStep.INSURANCE_INFORMATION_DEFINITION);
    }

    result.push(getIdentificationStep(options));

    const deliveryOptions = options.getDeliveryOptions() || emptyList;
    if (
        deliveryOptions.length > 1 ||
        (deliveryOptions.length === 1 &&
            deliveryOptions[0].type !== DeliveryType.Pickup)
    ) {
        result.push(EcomStep.DELIVERY_METHOD);
    }

    result.push(EcomStep.FINAL_SUMMARY);
    result.push(EcomStep.FINAL_CONFIRMATION);

    return result;
};

/*
TODO Oscar Remove this stuff...?
const getAuthenticationTransition = (data: IEcomData) => {
    const alreadyAuthenticated = data.interact.customer.isAuthenticated;
    if (alreadyAuthenticated) {
        return EcomStep.CUSTOMER_INFORMATION_DETAILS;
    }

    return EcomStep.BANKID_AUTHENTICATION;
};
*/

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
            //return getAuthenticationTransition(data);
            return getIdentificationStep(options);
        }

        return EcomStep.INSURANCE_INFORMATION_DEFINITION;
    },
    [EcomStep.PAYMENT_FINANCING_DETAILS]: (
        data: IEcomData,
        options: IOrderOptionsResponse
    ) => {
        if (!options.getInsuranceOption()) {
            //return getAuthenticationTransition(data);
            return getIdentificationStep(options);
        }

        return EcomStep.INSURANCE_INFORMATION_DEFINITION;
    },
    [EcomStep.INSURANCE_INFORMATION_DEFINITION]: (
        data: IEcomData,
        options: IOrderOptionsResponse
    ) => {
        if (data.insurance.wantsToSeeInsuranceOptions) {
            return EcomStep.INSURANCE_ALTERNATIVE_CHOOSER;
        }

        //return getAuthenticationTransition(data);
        return getIdentificationStep(options);
    },
    [EcomStep.INSURANCE_ALTERNATIVE_CHOOSER]: (
        data: IEcomData,
        options: IOrderOptionsResponse
    ) => {
        //return getAuthenticationTransition(data);
        return getIdentificationStep(options);
    },
    [EcomStep.BANKID_AUTHENTICATION]: () =>
        EcomStep.CUSTOMER_INFORMATION_DETAILS,
    [EcomStep.CUSTOMER_INFORMATION_INITIAL]: () =>
        EcomStep.CUSTOMER_INFORMATION_DETAILS,
    [EcomStep.CUSTOMER_INFORMATION_DETAILS]: (
        data: IEcomData,
        options: IOrderOptionsResponse
    ) => {
        const deliveryOptions = options.getDeliveryOptions() || emptyList;
        if (
            deliveryOptions.length === 1 &&
            deliveryOptions[0].type === DeliveryType.Pickup
        ) {
            return EcomStep.FINAL_SUMMARY;
        }

        return EcomStep.DELIVERY_METHOD;
    },
    [EcomStep.DELIVERY_METHOD]: () => EcomStep.FINAL_SUMMARY,
    [EcomStep.FINAL_SUMMARY]: () => EcomStep.FINAL_CONFIRMATION,
});
