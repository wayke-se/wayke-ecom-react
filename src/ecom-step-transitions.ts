import {
    PaymentType,
    IOrderOptionsResponse,
    DeliveryType,
} from "@wayke-se/ecom";

import EcomStep from "./constants/ecom-step";
import { IEcomData } from "./types";
import shouldUseCreditAssessment from "./utils/credit-assessment/usage-resolver";

export const getInitialStep = (options: IOrderOptionsResponse): EcomStep => {
    return options.allowsTradeIn()
        ? EcomStep.TRADE_IN_EXISTS_CHOOSER
        : EcomStep.PAYMENT_METHOD_CHOOSER;
};

// TODO Refactor using two variables here to two separate methods. Not sure if this break initial steps.
export const getIdentificationStep = (
    useBankId: boolean,
    useCreditAssessment?: boolean
) => {
    if (useBankId) {
        if (useCreditAssessment) {
            return EcomStep.CREDIT_ASSESSMENT_INFORMATION;
        }
        return EcomStep.BANKID_AUTHENTICATION;
    }
    return EcomStep.CUSTOMER_INFORMATION_INITIAL;
};

const emptyList = [];
export const getPrimarySteps = (
    options: IOrderOptionsResponse,
    useBankId: boolean
): EcomStep[] => {
    const result = [];

    if (options.allowsTradeIn()) {
        result.push(EcomStep.TRADE_IN_EXISTS_CHOOSER);
    }

    result.push(EcomStep.PAYMENT_METHOD_CHOOSER);

    if (options.getInsuranceOption()) {
        result.push(EcomStep.INSURANCE_INFORMATION_DEFINITION);
    }

    result.push(getIdentificationStep(useBankId));

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
            return getIdentificationStep(data.useBankId);
        }

        return EcomStep.INSURANCE_INFORMATION_DEFINITION;
    },
    [EcomStep.PAYMENT_FINANCING_DETAILS]: (
        data: IEcomData,
        options: IOrderOptionsResponse
    ) => {
        const useCreditAssessment = shouldUseCreditAssessment(data, options);

        if (!options.getInsuranceOption()) {
            return getIdentificationStep(data.useBankId, useCreditAssessment);
        }

        return EcomStep.INSURANCE_INFORMATION_DEFINITION;
    },
    [EcomStep.INSURANCE_INFORMATION_DEFINITION]: (
        data: IEcomData,
        options: IOrderOptionsResponse
    ) => {
        const useCreditAssessment = shouldUseCreditAssessment(data, options);

        if (data.insurance.wantsToSeeInsuranceOptions) {
            return EcomStep.INSURANCE_ALTERNATIVE_CHOOSER;
        }

        return getIdentificationStep(data.useBankId, useCreditAssessment);
    },
    [EcomStep.INSURANCE_ALTERNATIVE_CHOOSER]: (
        data: IEcomData,
        options: IOrderOptionsResponse
    ) => {
        const useCreditAssessment = shouldUseCreditAssessment(data, options);
        return getIdentificationStep(data.useBankId, useCreditAssessment);
    },
    [EcomStep.CREDIT_ASSESSMENT_INFORMATION]: () =>
        EcomStep.CREDIT_ASSESSMENT_SIGNING,
    [EcomStep.CREDIT_ASSESSMENT_SIGNING]: () => EcomStep.CREDIT_ASSESSED,
    [EcomStep.CREDIT_ASSESSED]: () => EcomStep.CUSTOMER_INFORMATION_DETAILS,
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
