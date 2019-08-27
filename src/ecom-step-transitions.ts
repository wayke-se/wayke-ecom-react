import EcomStep from './enums/ecom-step';
import InsuranceOption from './enums/insurance-option';
import CustomerInformationInputType from './enums/customer-information-input-type';

import { validateRegistrationNumber, validateMilage, validateSSN, validateZip } from './utils/validation';
import { IEcomData } from './types';
import { PaymentType } from 'wayke-ecom';

export default {
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
    [EcomStep.PAYMENT_METHOD_CHOOSER]: (data: IEcomData) => {
        if (data.payment.paymentOption.type === PaymentType.Loan) {
            return EcomStep.PAYMENT_FINANCING_DETAILS;
        } else {
            return EcomStep.INSURANCE_TYPE_CHOOSER;
        }
    },
    [EcomStep.PAYMENT_FINANCING_DETAILS]: () => EcomStep.INSURANCE_TYPE_CHOOSER,
    [EcomStep.INSURANCE_TYPE_CHOOSER]: (data: IEcomData) => {
        if (data.insurance.insuranceOption === InsuranceOption.AUDI_INSURANCE) {
            return EcomStep.INSURANCE_INFORMATION_DEFINITION;
        } else {
            return EcomStep.CUSTOMER_INFORMATION_INITIAL;
        }
    },
    [EcomStep.INSURANCE_INFORMATION_DEFINITION]: (data: IEcomData) => {
        const isValid = validateSSN(data.insurance.personalNumber);

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

        const isValid = validateSSN(data.customer.personalNumber);

        if (isValid) {
            return EcomStep.CUSTOMER_INFORMATION_DETAILS;
        } else {
            return null;
        }
    },
    [EcomStep.CUSTOMER_INFORMATION_DETAILS]: (data: IEcomData) => {
        const isValidPersonalNumber = validateSSN(data.customer.personalNumber);
        const isValidEmail = !!data.customer.email;
        const isValidPhone = !!data.customer.phone;
        const hasAcceptedTerms = data.customer.hasAcceptedTerms;

        let isValid = isValidPersonalNumber && isValidEmail && isValidPhone && hasAcceptedTerms;

        if (data.customer.inputType === CustomerInformationInputType.MANUAL) {
            const isValidName = !!data.customer.name;
            const isValidAdress = !!data.customer.adress;
            const isValidZip = validateZip(data.customer.zip);
            const isValidCity = !!data.customer.city;

            isValid = isValid && isValidName && isValidAdress && isValidZip && isValidCity;
        }

        return isValid ? EcomStep.DELIVERY_TYPE_CHOOSER : null;
    },
    [EcomStep.DELIVERY_TYPE_CHOOSER]: () => EcomStep.FINAL_CONFIRMATION,
};