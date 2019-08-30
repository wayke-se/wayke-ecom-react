import EcomStep from './constants/ecom-step';
import CustomerInformationInputType from './constants/customer-information-input-type';

import { IEcomData } from './types';
import { PaymentType, IOrderOptionsResponse } from 'wayke-ecom';

export const getInitialStep = (options: IOrderOptionsResponse): EcomStep => {
    return options.allowsTradeIn() ? EcomStep.TRADE_IN_EXISTS_CHOOSER : EcomStep.PAYMENT_METHOD_CHOOSER;
};

export const getPrimarySteps = (options: IOrderOptionsResponse): EcomStep[] => {
    const result = [];

    if (options.allowsTradeIn()) {
        result.push(EcomStep.TRADE_IN_EXISTS_CHOOSER);
    }

    result.push(
        EcomStep.PAYMENT_METHOD_CHOOSER
    );

    if (options.getInsuranceOption()) {
        result.push(
            EcomStep.INSURANCE_TYPE_CHOOSER
        );
    }

    result.push(
        EcomStep.CUSTOMER_INFORMATION_INITIAL,
        EcomStep.CONFIRM_ORDER,
        EcomStep.FINAL_CONFIRMATION
    );

    return result;
};

export const getAllTransitions = () => ({
    [EcomStep.TRADE_IN_EXISTS_CHOOSER]: (data: IEcomData) => {
        if (data.tradeInCar.hasTradeInCar) {
            return EcomStep.TRADE_IN_CAR_DEFINITION;
        } else {
            return EcomStep.PAYMENT_METHOD_CHOOSER;
        }
    },
    [EcomStep.TRADE_IN_CAR_DEFINITION]: () => EcomStep.TRADE_IN_CONFIRM_CAR,
    [EcomStep.TRADE_IN_CONFIRM_CAR]: () => EcomStep.PAYMENT_METHOD_CHOOSER,
    [EcomStep.PAYMENT_METHOD_CHOOSER]: (data: IEcomData, options: IOrderOptionsResponse) => {
        const isLoan = data.payment.paymentType === PaymentType.Loan;

        if (isLoan) {
            return EcomStep.PAYMENT_FINANCING_DETAILS;
        } else if (!options.getInsuranceOption()) {
            return EcomStep.CUSTOMER_INFORMATION_INITIAL;
        } else {
            return EcomStep.INSURANCE_TYPE_CHOOSER;
        }
    },
    [EcomStep.PAYMENT_FINANCING_DETAILS]: (data: IEcomData, options: IOrderOptionsResponse) => {
        if (!options.getInsuranceOption()) {
            return EcomStep.CUSTOMER_INFORMATION_INITIAL;
        } else {
            return EcomStep.INSURANCE_TYPE_CHOOSER;
        }
    },
    [EcomStep.INSURANCE_TYPE_CHOOSER]: (data: IEcomData) => {
        if (data.insurance.wantsToSeeInsuranceOptions) {
            return EcomStep.INSURANCE_INFORMATION_DEFINITION;
        } else {
            return EcomStep.CUSTOMER_INFORMATION_INITIAL;
        }
    },
    [EcomStep.INSURANCE_INFORMATION_DEFINITION]: () => EcomStep.INSURANCE_ALTERNATIVE_CHOOSER,
    [EcomStep.INSURANCE_ALTERNATIVE_CHOOSER]: () => EcomStep.CUSTOMER_INFORMATION_INITIAL,
    [EcomStep.CUSTOMER_INFORMATION_INITIAL]: (data: IEcomData) => {
        if (data.customer.inputType === CustomerInformationInputType.MANUAL) {
            return EcomStep.CUSTOMER_INFORMATION_DETAILS;
        } else {
            return EcomStep.CUSTOMER_INFORMATION_DETAILS;
        }
    },
    [EcomStep.CUSTOMER_INFORMATION_DETAILS]: () => EcomStep.CONFIRM_ORDER,
    [EcomStep.CONFIRM_ORDER]: () => EcomStep.FINAL_CONFIRMATION,
});