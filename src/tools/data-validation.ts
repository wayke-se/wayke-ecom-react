import {
    PaymentType,
    DrivingDistance,
    IOrderOptionsResponse,
    IPaymentLookupResponse,
    DeliveryType,
    IAddress,
} from "@wayke-se/ecom";
import {
    ITradeInCarData,
    IPaymentData,
    IInsuranceData,
    ICustomerObject,
    IEcomData,
    IDeliveryMethodData,
} from "../types";

import {
    validateMilage,
    validateRegistrationNumber,
    validateNumberInRange,
    validatePersonalNumber,
    validateEmail,
    validatePhoneNumber,
    validateZip,
    validateName,
} from "../utils/validation";

import { createCustomerObject } from "./data-creator";
import { containsValue } from "../utils/enum";
import { getLoanDetails } from "../utils/payment";
import { isResidualEnabled } from "../utils/residual";

export const validateEcomData = (
    data: IEcomData,
    orderOptions: IOrderOptionsResponse,
    paymentLookup: IPaymentLookupResponse | undefined,
    address: IAddress
) => {
    const isValidTradeIn =
        data.tradeInCar.hasProvidedTradeInInfo && data.tradeInCar.hasTradeInCar
            ? validateTradeIn(data.tradeInCar)
            : true;
    const isValidPayment = validatePayment(
        data.payment,
        orderOptions,
        paymentLookup
    );
    const isValidInsurance = validateInsurance(data.insurance);

    const isValidDeliveryType = validateDeliveryType(
        orderOptions,
        data.delivery
    );

    const customerObject = createCustomerObject(data.customer, address);
    const isValidCustomer = validateCustomerObject(customerObject);

    const hasAcceptedConditions = data.customer.hasAcceptedConditions;

    const returnConditions = orderOptions.getOrderReturnConditions();
    let hasAcceptedReturnConditions = true;

    if (returnConditions) {
        hasAcceptedReturnConditions = data.customer.hasAcceptedReturnConditions;
    }

    return (
        isValidTradeIn &&
        isValidPayment &&
        isValidDeliveryType &&
        isValidInsurance &&
        isValidCustomer &&
        hasAcceptedConditions &&
        hasAcceptedReturnConditions
    );
};

export const validateTradeIn = (data: ITradeInCarData) => {
    if (!data.wantsToDefineTradeIn) {
        return true;
    }

    const isValidMilage = validateMilage(data.milage);
    const isValidRegistrationNumber = validateRegistrationNumber(
        data.registrationNumber
    );

    return isValidMilage && isValidRegistrationNumber;
};

export const validateDeliveryType = (
    options: IOrderOptionsResponse,
    delivery: IDeliveryMethodData
) => {
    const deliveryOptions = options.getDeliveryOptions() || [];
    const validDeliveryTypes = deliveryOptions.map((x) => x.type);

    return (
        validDeliveryTypes.includes(delivery.type) ||
        delivery.type === DeliveryType.None
    );
};

export const validatePayment = (
    data: IPaymentData,
    orderOptions: IOrderOptionsResponse,
    paymentLookup: IPaymentLookupResponse | undefined
) => {
    if (!data.paymentType) {
        return false;
    }

    const isLoan = data.paymentType === PaymentType.Loan;

    if (!isLoan) {
        return true;
    }

    const loanDetails = getLoanDetails(orderOptions, paymentLookup);

    const depositMin = loanDetails.getDownPaymentSpec().min;
    const depositMax = loanDetails.getDownPaymentSpec().max;

    const durationMin = loanDetails.getDurationSpec().min;
    const durationMax = loanDetails.getDurationSpec().max;

    const isValidDeposit = validateNumberInRange(
        data.loanDeposit,
        depositMin,
        depositMax
    );
    const isValidLoanDuration = validateNumberInRange(
        data.loanDuration,
        durationMin,
        durationMax
    );

    let isValidResidual = true;

    const hasResidual = isResidualEnabled(loanDetails.getResidualValueSpec());

    if (hasResidual) {
        const residualMin = loanDetails.getResidualValueSpec().min;
        const residualMax = loanDetails.getResidualValueSpec().max;

        isValidResidual = validateNumberInRange(
            data.loanResidual,
            residualMin,
            residualMax
        );
    }

    return isValidDeposit && isValidLoanDuration && isValidResidual;
};

export const validateInsurance = (data: IInsuranceData) => {
    if (!data.wantsToSeeInsuranceOptions) {
        return true;
    }

    const isValidPersonalNumber = validatePersonalNumber(data.personalNumber);
    const isValidExpectedDrivingDistance =
        data.expectedDrivingDistance &&
        containsValue(DrivingDistance, data.expectedDrivingDistance);
    const isValidAddons = Array.isArray(data.addons);

    return (
        isValidPersonalNumber && isValidExpectedDrivingDistance && isValidAddons
    );
};

export const validateCustomerObjectPersonalNumber = (
    customerObject: ICustomerObject
) => {
    return customerObject.isAutomaticLookup
        ? validatePersonalNumber(customerObject.personalNumber)
        : true;
};

export const validateCustomerObject = (customerObject: ICustomerObject) => {
    const isValidPersonalNumber = validateCustomerObjectPersonalNumber(
        customerObject
    );
    const isValidEmail = validateEmail(customerObject.email);
    const isValidPhone = validatePhoneNumber(customerObject.phone);

    const isValidName = validateName(customerObject);
    const isValidAddress = !!customerObject.street;
    const isValidCity = !!customerObject.city;

    const isValidZip = customerObject.isMasked
        ? !!customerObject.zip
        : validateZip(customerObject.zip);

    return (
        isValidPersonalNumber &&
        isValidEmail &&
        isValidPhone &&
        isValidName &&
        isValidAddress &&
        isValidZip &&
        isValidCity
    );
};
