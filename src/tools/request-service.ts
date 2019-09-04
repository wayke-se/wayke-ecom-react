import RequestType from "../constants/request-type";

import { IOrderOptionsResponse, IInsuranceOptionsResponse, IVehicleLookupResponse, IAddressLookupResponse, IPaymentLookupResponse } from '@wayke-se/ecom';

import { getOrderOptions } from "../sdk/get-order-options";
import { getVehicleLookup } from "../sdk/get-vehicle-lookup";
import { getInsuranceOptions } from "../sdk/get-insurance-options";
import { getAddressLookup } from "../sdk/get-address-lookup";
import { getPaymentLookup } from '../sdk/get-payment-lookup';
import { createOrder } from "../sdk/create-order";
import { IOrderOptionsSdkData, IVehicleLookupSdkData, IInsuranceOptionsSdkData, IAddressLookupSdkData, ICreateOrderSdkData, IPaymentLookupSdkData } from "../types";

const requestCache = {};

const getCachedRequestResponse = <T>(requestType: RequestType, requestIdentifier: string | null): T | null => {
    if (requestIdentifier === null) {
        return null;
    }

    // @ts-ignore
    const cachedRequest = requestCache[requestType];

    if (!cachedRequest) {
        return null;
    }

    const isSameIdentifier = requestIdentifier === cachedRequest.identifier;
    return isSameIdentifier ? cachedRequest.response : null;
}

const addRequestToCache = <T>(requestType: RequestType, requestIdentifier: string | null, response: T) => {
    if (requestIdentifier === null) {
        return;
    }

    // @ts-ignore
    requestCache[requestType] = {
        identifier: requestIdentifier,
        response
    };
};

const makeRequest = <S, T>(
        requestAction: (data: S, actionCallback: (response: T | null) => void) => void,
        requestType: RequestType,
        requestIdentifier: string | null,
        data: S,
        callback: (response: T | null) => void
) => {
    const cachedRequestResponse = getCachedRequestResponse<T>(requestType, requestIdentifier);

    if (cachedRequestResponse) {
        return callback(cachedRequestResponse);
    }

    requestAction(data, (response: T | null) => {
        if (response) {
            addRequestToCache(requestType, requestIdentifier, response);
        }

        callback(response);
    });
};

export const makeOrderOptionsRequest = (data: IOrderOptionsSdkData, callback: (response: IOrderOptionsResponse | null) => void) => {
    const requestIdentifier = '' + data.vehicleId;

    makeRequest(getOrderOptions, RequestType.GET_ORDER_OPTIONS, requestIdentifier, data, callback);
};

export const makeVehicleLookupRequest = (data: IVehicleLookupSdkData, callback: (response: IVehicleLookupResponse | null) => void) => {
    const requestIdentifier = '' + data.ecomData.registrationNumber + data.ecomData.milage;

    makeRequest(getVehicleLookup, RequestType.GET_VEHICLE_LOOKUP, requestIdentifier, data, callback);
};

export const makeInsuranceOptionsRequest = (data: IInsuranceOptionsSdkData, callback: (response: IInsuranceOptionsResponse | null) => void) => {
    const requestIdentifier = '' + data.vehicleId + data.paymentType + data.ecomData.expectedDrivingDistance + data.ecomData.personalNumber;

    makeRequest(getInsuranceOptions, RequestType.GET_INSURANCE_OPTIONS, requestIdentifier, data, callback);
};

export const makeAddressLookupRequest = (data: IAddressLookupSdkData, callback: (response: IAddressLookupResponse | null) => void) => {
    const requestIdentifier = '' + data.ecomData.personalNumber;

    makeRequest(getAddressLookup, RequestType.GET_ADDRESS_LOOKUP, requestIdentifier, data, callback);
};

export const makePaymentLookupRequest = (data: IPaymentLookupSdkData, callback: (response: IPaymentLookupResponse | null) => void) => {
    const requestIdentifier = '' + data.ecomData.loanDeposit + data.ecomData.loanDuration + data.ecomData.loanResidual;

    makeRequest(getPaymentLookup, RequestType.GET_PAYMENT_LOOKUP, requestIdentifier, data, callback);
}

export const makeCreateOrderRequest = (data: ICreateOrderSdkData, callback: (wasOrderSuccessful: boolean) => void) => {
    const requestIdentifier = null;

    // @ts-ignore
    makeRequest(createOrder, RequestType.CREATE_ORDER, requestIdentifier, data, callback);
};