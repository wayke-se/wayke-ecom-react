import { PaymentType, IAddressLookupResponse, DrivingDistance, IOrderOptionsResponse, IPaymentLookupResponse } from '@wayke-se/ecom';
import { ITradeInCarData, IPaymentData, IInsuranceData, ICustomerObject, IEcomData } from "../types";

import { validateMilage, validateRegistrationNumber, validateNumberInRange, validatePersonalNumber, validateEmail, validatePhoneNumber, validateZip } from "../utils/validation";

import { createCustomerObject } from "./data-creator";
import { containsValue } from "../utils/enum";
import { getLoanPaymentOptions } from "../utils/payment";
import { isResidualEnabled } from '../utils/residual';

export const validateEcomData = (data: IEcomData, addressLookup: IAddressLookupResponse, orderOptions: IOrderOptionsResponse, paymentLookup: IPaymentLookupResponse | undefined) => {
    const isValidTradeIn = data.tradeInCar.hasProvidedTradeInInfo && data.tradeInCar.hasTradeInCar ? validateTradeIn(data.tradeInCar) : true;
    const isValidPayment = validatePayment(data.payment, orderOptions, paymentLookup);
    const isValidInsurance = validateInsurance(data.insurance);

    const customerObject = createCustomerObject(data.customer, addressLookup);
    const isValidCustomer = validateCustomerObject(customerObject);

    const hasAcceptedTerms = data.customer.hasAcceptedTerms;

    return isValidTradeIn && isValidPayment && isValidInsurance && isValidCustomer && hasAcceptedTerms;
}

export const validateTradeIn = (data: ITradeInCarData) => {
    if (!data.wantsToDefineTradeIn) {
        return true;
    }

    const isValidMilage = validateMilage(data.milage);
    const isValidRegistrationNumber = validateRegistrationNumber(data.registrationNumber);

    return isValidMilage && isValidRegistrationNumber;
};

export const validatePayment = (data: IPaymentData, orderOptions: IOrderOptionsResponse, paymentLookup: IPaymentLookupResponse | undefined) => {
    if (!data.paymentType) {
        return false;
    }

    const isLoan = data.paymentType === PaymentType.Loan;

    if (!isLoan) {
        return true;
    }

    const selectedPaymentLookup = paymentLookup ? paymentLookup : getLoanPaymentOptions(orderOptions).loanDetails;

    const depositMin = selectedPaymentLookup.getDownPaymentSpec().min;
    const depositMax = selectedPaymentLookup.getDownPaymentSpec().max;

    const durationMin = selectedPaymentLookup.getDurationSpec().min;
    const durationMax = selectedPaymentLookup.getDurationSpec().max;

    const isValidDeposit = validateNumberInRange(data.loanDeposit, depositMin, depositMax);
    const isValidLoanDuration = validateNumberInRange(data.loanDuration, durationMin, durationMax);

    var isValidResidual = true;

    const hasResidual = isResidualEnabled(selectedPaymentLookup.getResidualValueSpec());

    if (hasResidual) {
        const residualMin = selectedPaymentLookup.getResidualValueSpec().min;
        const residualMax = selectedPaymentLookup.getResidualValueSpec().max;

        isValidResidual = validateNumberInRange(data.loanResidual, residualMin, residualMax);
    }

    return isValidDeposit && isValidLoanDuration && isValidResidual;
};

export const validateInsurance = (data: IInsuranceData) => {
    if (!data.wantsToSeeInsuranceOptions) {
        return true;
    }

    const isValidPersonalNumber = validatePersonalNumber(data.personalNumber);
    const isValidExpectedDrivingDistance = data.expectedDrivingDistance && containsValue(DrivingDistance, data.expectedDrivingDistance);
    const isValidAddons = Array.isArray(data.addons);

    return isValidPersonalNumber && isValidExpectedDrivingDistance && isValidAddons;
};

export const validateCustomerObjectPersonalNumber = (customerObject: ICustomerObject) => {
    return customerObject.isAutomaticLookup ? validatePersonalNumber(customerObject.personalNumber) : true;
}

export const validateCustomerObject = (customerObject: ICustomerObject) => {
    const isValidPersonalNumber = validateCustomerObjectPersonalNumber(customerObject);
    const isValidEmail = validateEmail(customerObject.email);
    const isValidPhone = validatePhoneNumber(customerObject.phone);

    const isValidName = !!customerObject.name;
    const isValidAddress = !!customerObject.address;
    const isValidCity = !!customerObject.city;

    var isValidZip: boolean;

    if (customerObject.isMasked) {
        isValidZip = !!customerObject.zip;
    } else {
        isValidZip = validateZip(customerObject.zip);
    }

    return isValidPersonalNumber && isValidEmail && isValidPhone && isValidName && isValidAddress && isValidZip && isValidCity;
};