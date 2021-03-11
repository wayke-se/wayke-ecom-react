import RequestType from "../constants/request-type";

import {
    IOrderOptionsResponse,
    IInsuranceOptionsResponse,
    IVehicleLookupResponse,
    IAddressLookupResponse,
    IPaymentLookupResponse,
    IBankIdAuthResponse,
    IBankIdCollectResponse,
    ICreditAssessmentInquiry,
    ICreditAssessmentCase,
    ICreditAssessmentSignResponse,
    ICreditAssessmentStatusResponse,
} from "@wayke-se/ecom";

import { getOrderOptions } from "../sdk/get-order-options";
import { getVehicleLookup } from "../sdk/get-vehicle-lookup";
import { getInsuranceOptions } from "../sdk/get-insurance-options";
import { getAddressLookup } from "../sdk/get-address-lookup";
import { getPaymentLookup } from "../sdk/get-payment-lookup";
import { createOrder } from "../sdk/create-order";
import bankIdAuth from "../sdk/bankid/auth";
import bankIdCollect from "../sdk/bankid/collect";
import bankIdCancel from "../sdk/bankid/cancel";
import createCreditAssessmentCase from "../sdk/credit-assessment/new-case";
import declineCreditAssessmentCase from "../sdk/credit-assessment/decline-case";
import acceptCreditAssessmentCase from "../sdk/credit-assessment/accept-case";
import signCreditAssessmentCaseWithQrCode from "../sdk/credit-assessment/sign-with-qr-code";
import signCreditAssessmentCaseWithSameDevice from "../sdk/credit-assessment/sign-with-same-device";
import cancelCreditAssessmentSigning from "../sdk/credit-assessment/cancel-signing";
import getCreditAssessmentStatus from "../sdk/credit-assessment/get-status";

import {
    IOrderOptionsSdkData,
    IVehicleLookupSdkData,
    IInsuranceOptionsSdkData,
    IAddressLookupSdkData,
    ICreateOrderSdkData,
    IPaymentLookupSdkData,
    IBankIdAuthSdkData,
    IBankIdCollectSdkData,
    IBankIdCancelSdkData,
} from "../types";

const requestCache = {};

const getCachedRequestResponse = <T>(
    requestType: RequestType,
    requestIdentifier: string | null,
    dealerIdentifier: string | null
): T | null => {
    if (requestIdentifier === null) {
        return null;
    }

    const cachedRequest = requestCache[requestType];

    if (!cachedRequest) {
        return null;
    }

    let key = requestIdentifier;
    if (dealerIdentifier) key = `${key}/${dealerIdentifier}`;

    const isSameIdentifier = key === cachedRequest.identifier;
    return isSameIdentifier ? cachedRequest.response : null;
};

const addRequestToCache = <T>(
    requestType: RequestType,
    requestIdentifier: string | null,
    dealerIdentifier: string | null,
    response: T
) => {
    if (requestIdentifier === null) {
        return;
    }

    let key = requestIdentifier;
    if (dealerIdentifier) key = `${key}/${dealerIdentifier}`;

    requestCache[requestType] = {
        response,
        identifier: key,
    };
};

const makeRequest = <S, T>(
    requestAction: (
        data: S,
        actionCallback: (response: T | null) => void
    ) => void,
    requestType: RequestType,
    requestIdentifier: string | null,
    dealerIdentifier: string | null,
    data: S,
    callback: (response: T | null) => void
) => {
    const cachedRequestResponse = getCachedRequestResponse<T>(
        requestType,
        requestIdentifier,
        dealerIdentifier
    );

    if (cachedRequestResponse) {
        return callback(cachedRequestResponse);
    }

    requestAction(data, (response: T | null) => {
        if (response) {
            addRequestToCache(
                requestType,
                requestIdentifier,
                dealerIdentifier,
                response
            );
        }

        callback(response);
    });
};

export const makeOrderOptionsRequest = (
    data: IOrderOptionsSdkData,
    callback: (response: IOrderOptionsResponse | null) => void
) => {
    const requestIdentifier = data.vehicleId;
    const dealerIdentifier = data.dealerId;

    makeRequest(
        getOrderOptions,
        RequestType.GET_ORDER_OPTIONS,
        requestIdentifier,
        dealerIdentifier,
        data,
        callback
    );
};

export const makeVehicleLookupRequest = (
    data: IVehicleLookupSdkData,
    callback: (response: IVehicleLookupResponse | null) => void
) => {
    const requestIdentifier = `${data.ecomData.registrationNumber}${data.ecomData.milage}${data.ecomData.condition}`;

    makeRequest(
        getVehicleLookup,
        RequestType.GET_VEHICLE_LOOKUP,
        requestIdentifier,
        null,
        data,
        callback
    );
};

export const makeInsuranceOptionsRequest = (
    data: IInsuranceOptionsSdkData,
    callback: (response: IInsuranceOptionsResponse | null) => void
) => {
    const requestIdentifier = `${data.vehicleId}${data.paymentType}${data.ecomData.expectedDrivingDistance}${data.ecomData.personalNumber}`;

    makeRequest(
        getInsuranceOptions,
        RequestType.GET_INSURANCE_OPTIONS,
        requestIdentifier,
        null,
        data,
        callback
    );
};

export const makeAddressLookupRequest = (
    data: IAddressLookupSdkData,
    callback: (response: IAddressLookupResponse | null) => void
) => {
    const requestIdentifier = data.ecomData.personalNumber;

    makeRequest(
        getAddressLookup,
        RequestType.GET_ADDRESS_LOOKUP,
        requestIdentifier,
        null,
        data,
        callback
    );
};

export const makePaymentLookupRequest = (
    data: IPaymentLookupSdkData,
    callback: (response: IPaymentLookupResponse | null) => void
) => {
    const requestIdentifier = `${data.ecomData.loanDeposit}${data.ecomData.loanDuration}${data.ecomData.loanResidual}`;
    const dealerIdentifier = data.dealerId;

    makeRequest(
        getPaymentLookup,
        RequestType.GET_PAYMENT_LOOKUP,
        requestIdentifier,
        dealerIdentifier,
        data,
        callback
    );
};

export const makeCreateOrderRequest = (
    data: ICreateOrderSdkData,
    callback: (wasOrderSuccessful: boolean) => void
) => {
    const requestIdentifier = null;

    makeRequest(
        createOrder,
        RequestType.CREATE_ORDER,
        requestIdentifier,
        null,
        data,
        callback
    );
};

export const makeBankIdAuthRequest = (
    data: IBankIdAuthSdkData,
    callback: (response: IBankIdAuthResponse | Error | null) => void
) => {
    const requestIdentifier = null;

    makeRequest(
        bankIdAuth,
        RequestType.BANK_ID_AUTH,
        requestIdentifier,
        null,
        data,
        callback
    );
};

export const makeBankIdCollectRequest = (
    data: IBankIdCollectSdkData,
    callback: (response: IBankIdCollectResponse | null) => void
) => {
    const requestIdentifier = null;

    makeRequest(
        bankIdCollect,
        RequestType.BANK_ID_COLLECT,
        requestIdentifier,
        null,
        data,
        callback
    );
};

export const makeBankIdCancelRequest = (
    data: IBankIdCancelSdkData,
    callback: (response: boolean) => void
) => {
    const requestIdentifier = null;

    makeRequest(
        bankIdCancel,
        RequestType.BANK_ID_CANCEL,
        requestIdentifier,
        null,
        data,
        callback
    );
};

export const makeCreditAssessmentCreateCaseRequest = (
    inquiry: ICreditAssessmentInquiry,
    callback: (response: ICreditAssessmentCase | null) => void
) => {
    const requestIdentifier = null;
    makeRequest(
        createCreditAssessmentCase,
        RequestType.CREATE_CREDIT_ASSESSMENT_CASE,
        requestIdentifier,
        null,
        inquiry,
        callback
    );
};

export const makeCreditAssessmentDeclineRequest = (
    caseId: string,
    callback: (response: boolean) => void
) => {
    const requestIdentifier = null;
    makeRequest(
        declineCreditAssessmentCase,
        RequestType.DECLINE_CREDIT_ASSESSMENT_CASE,
        requestIdentifier,
        null,
        caseId,
        callback
    );
};

export const makeCreditAssessmentAcceptRequest = (
    caseId: string,
    callback: (response: boolean) => void
) => {
    const requestIdentifier = null;
    makeRequest(
        acceptCreditAssessmentCase,
        RequestType.DECLINE_CREDIT_ASSESSMENT_CASE,
        requestIdentifier,
        null,
        caseId,
        callback
    );
};

export const makeCreditAssessmentQrCodeSignRequest = (
    caseId: string,
    callback: (response: ICreditAssessmentSignResponse | Error | null) => void
) => {
    const requestIdentifier = null;
    makeRequest(
        signCreditAssessmentCaseWithQrCode,
        RequestType.SIGN_CREDIT_ASSESSMENT_WITH_QR_CODE,
        requestIdentifier,
        null,
        caseId,
        callback
    );
};

export const makeCreditAssessmentSameDeviceSignRequest = (
    caseId: string,
    callback: (response: ICreditAssessmentSignResponse | Error | null) => void
) => {
    const requestIdentifier = null;
    makeRequest(
        signCreditAssessmentCaseWithSameDevice,
        RequestType.SIGN_CREDIT_ASSESSMENT_WITH_SAME_DEVICE,
        requestIdentifier,
        null,
        caseId,
        callback
    );
};

export const makeCreditAssessmentCancelSigningRequest = (
    caseId: string,
    callback: (response: boolean) => void
) => {
    const requestIdentifier = null;
    makeRequest(
        cancelCreditAssessmentSigning,
        RequestType.CANCEL_CREDIT_ASSESSMENT_SIGNING,
        requestIdentifier,
        null,
        caseId,
        callback
    );
};

export const makeCreditAssessmentGetStatusRequest = (
    caseId: string,
    callback: (response: ICreditAssessmentStatusResponse | Error | null) => void
) => {
    const requestIdentifier = null;
    makeRequest(
        getCreditAssessmentStatus,
        RequestType.GET_CREDIT_ASSESSMENT_STATUS,
        requestIdentifier,
        null,
        caseId,
        callback
    );
};
