import RequestType from "../constants/request-type";

import { IOrderOptionsResponse, IInsuranceOptionsResponse, IVehicleLookupResponse, IAddressLookupResponse, IOrderCreateResponse } from "wayke-ecom";

import { getOrderOptions } from "../sdk/get-order-options";
import { getVehicleLookup } from "../sdk/get-vehicle-lookup";
import { getInsuranceOptions } from "../sdk/get-insurance-options";
import { getAddressLookup } from "../sdk/get-address-lookup";
import { createOrder } from "../sdk/create-order";
import { IOrderOptionsSdkData, IVehicleLookupSdkData, IInsuranceOptionsSdkData, IAddressLookupSdkData, ICreateOrderSdkData } from "../types";

const requestCache = {};

const getRequestIdentifier = (data: any) => {
    return JSON.stringify(data);
}

const getCachedRequestResponse = <T>(requestType: RequestType, requestIdentifier: string): T => {
    const cachedRequest = requestCache[requestType];

    if (!cachedRequest) {
        return null;
    }

    const isSameIdentifier = requestIdentifier === cachedRequest.identifier;
    return isSameIdentifier ? cachedRequest.response : null;
}

const addRequestToCache = <T>(requestType: RequestType, requestIdentifier: string, response: T) => {
    requestCache[requestType] = {
        identifier: requestIdentifier,
        response
    };
};

const makeRequest = <S, T>(
        requestAction: (data: S, actionCallback: (response: T) => void) => void,
        requestType: RequestType,
        data: S,
        callback: (response: T) => void
) => {
    const requestIdentifier = getRequestIdentifier(data);
    const cachedRequestResponse = getCachedRequestResponse<T>(requestType, requestIdentifier);

    if (cachedRequestResponse) {
        return callback(cachedRequestResponse);
    }

    requestAction(data, (response: T) => {
        if (response) {
            addRequestToCache(requestType, requestIdentifier, response);
        }

        callback(response);
    });
};

export const makeOrderOptionsRequest = (data: IOrderOptionsSdkData, callback: (response: IOrderOptionsResponse) => void) => {
    makeRequest(getOrderOptions, RequestType.GET_ORDER_OPTIONS, data, callback);
};

export const makeVehicleLookupRequest = (data: IVehicleLookupSdkData, callback: (response: IVehicleLookupResponse) => void) => {
    makeRequest(getVehicleLookup, RequestType.GET_VEHICLE_LOOKUP, data, callback);
};

export const makeInsuranceOptionsRequest = (data: IInsuranceOptionsSdkData, callback: (response: IInsuranceOptionsResponse) => void) => {
    makeRequest(getInsuranceOptions, RequestType.GET_INSURANCE_OPTIONS, data, callback);
};

export const makeAddressLookupRequest = (data: IAddressLookupSdkData, callback: (response: IAddressLookupResponse) => void) => {
    makeRequest(getAddressLookup, RequestType.GET_ADDRESS_LOOKUP, data, callback);
};

export const makeCreateOrderRequest = (data: ICreateOrderSdkData, callback: (response: IOrderCreateResponse) => void) => {
    makeRequest(createOrder, RequestType.CREATE_ORDER, data, callback);
};