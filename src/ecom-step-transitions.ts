import EcomStep from './constants/ecom-step';
import InsuranceOption from './constants/insurance-option';
import CustomerInformationInputType from './constants/customer-information-input-type';

import { validateRegistrationNumber, validateMilage, validatePersonalNumber, validateZip } from './utils/validation';
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
    [EcomStep.TRADE_IN_CAR_DEFINITION]: (data: IEcomData) => {
        const isValid = validateRegistrationNumber(data.tradeInCar.registrationNumber) && validateMilage(data.tradeInCar.milage);

        if (isValid) {
            return EcomStep.TRADE_IN_CONFIRM_CAR;
        } else {
            return null;
        }
    },
    [EcomStep.TRADE_IN_CONFIRM_CAR]: () => EcomStep.PAYMENT_METHOD_CHOOSER,
    [EcomStep.PAYMENT_METHOD_CHOOSER]: (data: IEcomData, options: IOrderOptionsResponse) => {
        if (data.payment.paymentOption.type === PaymentType.Loan) {
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
        if (data.insurance.insuranceOption === InsuranceOption.AUDI_INSURANCE) {
            return EcomStep.INSURANCE_INFORMATION_DEFINITION;
        } else {
            return EcomStep.CUSTOMER_INFORMATION_INITIAL;
        }
    },
    [EcomStep.INSURANCE_INFORMATION_DEFINITION]: (data: IEcomData) => {
        const isValid = validatePersonalNumber(data.insurance.personalNumber);

        if (isValid)  {
            return EcomStep.INSURANCE_ALTERNATIVE_CHOOSER;
        } else {
            return null;
        }
    },
    [EcomStep.INSURANCE_ALTERNATIVE_CHOOSER]: () => EcomStep.CUSTOMER_INFORMATION_INITIAL,
    [EcomStep.CUSTOMER_INFORMATION_INITIAL]: (data: IEcomData) => {
        if (data.customer.inputType === CustomerInformationInputType.MANUAL) {
            return EcomStep.CUSTOMER_INFORMATION_DETAILS;
        }

        const isValid = validatePersonalNumber(data.customer.personalNumber);

        if (isValid) {
            return EcomStep.CUSTOMER_INFORMATION_DETAILS;
        } else {
            return null;
        }
    },
    [EcomStep.CUSTOMER_INFORMATION_DETAILS]: (data: IEcomData) => {
        const isValidPersonalNumber = validatePersonalNumber(data.customer.personalNumber);
        const isValidEmail = !!data.customer.email;
        const isValidPhone = !!data.customer.phone;
        const hasAcceptedTerms = data.customer.hasAcceptedTerms;

        let isValid = isValidPersonalNumber && isValidEmail && isValidPhone && hasAcceptedTerms;

        if (data.customer.inputType === CustomerInformationInputType.MANUAL) {
            const isValidName = !!data.customer.name;
            const isValidAddress = !!data.customer.address;
            const isValidZip = validateZip(data.customer.zip);
            const isValidCity = !!data.customer.city;

            isValid = isValid && isValidName && isValidAddress && isValidZip && isValidCity;
        }

        return isValid ? EcomStep.CONFIRM_ORDER : null;
    },
    [EcomStep.CONFIRM_ORDER]: () => EcomStep.FINAL_CONFIRMATION,
});