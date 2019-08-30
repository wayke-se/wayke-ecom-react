import { PaymentType, IAddressLookupResponse } from "wayke-ecom";
import { ITradeInCarData, IPaymentData, IInsuranceData, ICustomerObject, IEcomData, ILoanSpecification } from "../types";

import { validateMilage, validateRegistrationNumber, validateNumberInRange, validatePersonalNumber, validateEmail, validatePhoneNumber, validateZip } from "../utils/validation";

import drivingDistanceOptions from '../constants/driving-distance-options';
import { createCustomerObject } from "./data-creator";

var loanSpecification: ILoanSpecification = null;

export const initialize = (specification: ILoanSpecification) => {
    loanSpecification = specification;
}

export const isValidEcomData = (data: IEcomData, addressLookup: IAddressLookupResponse) => {
    const isValidTradeIn = validateTradeIn(data.tradeInCar);
    const isValidPayment = validatePayment(data.payment);
    const isValidInsurance = validateInsurance(data.insurance);

    const customerObject = createCustomerObject(data.customer, addressLookup);
    const isValidCustomer = validateCustomerObject(customerObject);

    return isValidTradeIn && isValidPayment && isValidInsurance && isValidCustomer;
}

export const validateTradeIn = (data: ITradeInCarData) => {
    if (!data.hasTradeInCar) {
        return true;
    }

    const isValidMilage = validateMilage(data.milage);
    const isValidRegistrationNumber = validateRegistrationNumber(data.registrationNumber);

    return isValidMilage && isValidRegistrationNumber;
};

export const validatePayment = (data: IPaymentData) => {
    const depositMin = loanSpecification.depositMin;
    const depositMax = loanSpecification.depositMax;
    const durationMin = loanSpecification.durationMin;
    const durationMax = loanSpecification.durationMax;

    if (!data.paymentOption) {
        return false;
    }

    const isLoan = data.paymentOption.type === PaymentType.Loan;

    if (!isLoan) {
        return true;
    }

    const isValidDeposit = validateNumberInRange(data.loanDeposit, depositMin, depositMax);
    const isValidLoanDuration = validateNumberInRange(data.loanDuration, durationMin, durationMax);

    return isValidDeposit && isValidLoanDuration;
};

export const validateInsurance = (data: IInsuranceData) => {
    if (!data.wantsToSeeInsuranceOptions) {
        return true;
    }

    const numberOfDrivingDistanceOptions = drivingDistanceOptions.length;

    const isValidPersonalNumber = validatePersonalNumber(data.personalNumber);
    const isValidExpectedDrivingDistance = data.expectedDrivingDistance && validateNumberInRange(data.expectedDrivingDistance.optionIndex, 0, numberOfDrivingDistanceOptions - 1);

    return isValidPersonalNumber && isValidExpectedDrivingDistance;
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