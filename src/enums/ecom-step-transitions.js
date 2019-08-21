import EcomStep from './ecom-step';
import PaymentMethod from './payment-method';
import InsuranceOption from './insurance-option';
import CustomerInformationInputType from './customer-information-input-type';

import { validateRegistrationNumber, validateMilage, validateSSN, validateZip } from '../../../../../utils/validation';

export default {
    [EcomStep.TRADE_IN_EXISTS_CHOOSER]: (state) => {
        if (state.hasTradeInCar) {
            return EcomStep.TRADE_IN_CAR_DEFINITION;
        } else {
            return EcomStep.PAYMENT_METHOD_CHOOSER;
        }
    },
    [EcomStep.TRADE_IN_CAR_DEFINITION]: (state) => {
        const isValid = validateRegistrationNumber(state.registrationNumber) && validateMilage(state.milage);

        if (isValid) {
            return EcomStep.TRADE_IN_CONFIRM_CAR;
        } else {
            return null;
        }
    },
    [EcomStep.TRADE_IN_CONFIRM_CAR]: () => EcomStep.PAYMENT_METHOD_CHOOSER,
    [EcomStep.PAYMENT_METHOD_CHOOSER]: (state) => {
        if (state.paymentMethod === PaymentMethod.FINANCING) {
            return EcomStep.PAYMENT_FINANCING_DETAILS;
        } else {
            return EcomStep.INSURANCE_TYPE_CHOOSER;
        }
    },
    [EcomStep.PAYMENT_FINANCING_DETAILS]: () => EcomStep.INSURANCE_TYPE_CHOOSER,
    [EcomStep.INSURANCE_TYPE_CHOOSER]: (state) => {
        if (state.insuranceOption === InsuranceOption.AUDI_INSURANCE) {
            return EcomStep.INSURANCE_INFORMATION_DEFINITION;
        } else {
            return EcomStep.CUSTOMER_INFORMATION_INITIAL;
        }
    },
    [EcomStep.INSURANCE_INFORMATION_DEFINITION]: (state) => {
        const isValid = validateSSN(state.insurancePersonalNumber);

        if (isValid)  {
            return EcomStep.INSURANCE_ALTERNATIVE_CHOOSER;
        } else {
            return null;
        }
    },
    [EcomStep.INSURANCE_ALTERNATIVE_CHOOSER]: () => EcomStep.CUSTOMER_INFORMATION_INITIAL,
    [EcomStep.CUSTOMER_INFORMATION_INITIAL]: (state) => {
        if (state.customerInformationInputType === CustomerInformationInputType.MANUAL) {
            return EcomStep.CUSTOMER_INFORMATION_DETAILS;
        }

        const isValid = validateSSN(state.customerPersonalNumber);

        if (isValid) {
            return EcomStep.CUSTOMER_INFORMATION_DETAILS;
        } else {
            return null;
        }
    },
    [EcomStep.CUSTOMER_INFORMATION_DETAILS]: (state) => {
        const isValidPersonalNumber = validateSSN(state.customerPersonalNumber);
        const isValidEmail = !!state.customerEmail;
        const isValidPhone = !!state.customerPhone;
        const hasAcceptedTerms = state.hasAcceptedTerms;

        let isValid = isValidPersonalNumber && isValidEmail && isValidPhone && hasAcceptedTerms;

        if (state.customerInformationInputType === CustomerInformationInputType.MANUAL) {
            const isValidName = !!state.customerName;
            const isValidAdress = !!state.customerAdress;
            const isValidZip = validateZip(state.customerZip);
            const isValidCity = !!state.customerCity;

            isValid = isValid && isValidName && isValidAdress && isValidZip && isValidCity;
        }

        return isValid ? EcomStep.DELIVERY_TYPE_CHOOSER : null;
    },
    [EcomStep.DELIVERY_TYPE_CHOOSER]: () => EcomStep.FINAL_CONFIRMATION,
};