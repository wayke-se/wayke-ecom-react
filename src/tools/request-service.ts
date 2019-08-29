import RequestType from "../constants/request-type";
import { getOrderOptions, getInsuranceOptions, getVehicleLookup, getAddressLookup, createOrder } from "../sdk/ecom-sdk-actions";
import { IOrderOptionsData, IVehicleLookupData, IInsuranceOptionsData, IAddressLookupData, ICreateOrderData } from "../types";
import { IOrderOptionsResponse, IInsuranceOptionsResponse, IVehicleLookupResponse, IAddressLookupResponse, IOrderCreateResponse } from "wayke-ecom";

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
        requestAction: (data: S, actionCallback: (isSuccessful: boolean, response: T) => void) => void,
        requestType: RequestType,
        data: S,
        callback: (isSuccessful: boolean, response: T) => void
) => {
    const requestIdentifier = getRequestIdentifier(data);
    const cachedRequestResponse = getCachedRequestResponse<T>(requestType, requestIdentifier);

    if (cachedRequestResponse) {
        return callback(true, cachedRequestResponse);
    }

    requestAction(data, (isSuccessful: boolean, response: T) => {
        if (isSuccessful) {
            addRequestToCache(requestType, requestIdentifier, response);
        }

        callback(isSuccessful, response);
    });
};

export const makeOrderOptionsRequest = (data: IOrderOptionsData, callback: (isSuccessful: boolean, response: IOrderOptionsResponse) => void) => {
    makeRequest(getOrderOptions, RequestType.GET_ORDER_OPTIONS, data, callback);
};

export const makeVehicleLookupRequest = (data: IVehicleLookupData, callback: (isSuccessful: boolean, response: IVehicleLookupResponse) => void) => {
    makeRequest(getVehicleLookup, RequestType.GET_VEHICLE_LOOKUP, data, callback);
};

export const makeInsuranceOptionsRequest = (data: IInsuranceOptionsData, callback: (isSuccessful: boolean, response: IInsuranceOptionsResponse) => void) => {
    makeRequest(getInsuranceOptions, RequestType.GET_INSURANCE_OPTIONS, data, callback);
};

export const makeAddressLookupRequest = (data: IAddressLookupData, callback: (isSuccessful: boolean, response: IAddressLookupResponse) => void) => {
    makeRequest(getAddressLookup, RequestType.GET_ADDRESS_LOOKUP, data, callback);
};

export const makeCreateOrderRequest = (data: ICreateOrderData, callback: (isSuccessful: boolean, response: IOrderCreateResponse) => void) => {
    makeRequest(createOrder, RequestType.CREATE_ORDER, data, callback);
};