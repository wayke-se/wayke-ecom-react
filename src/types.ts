import CustomerInformationInputType from "./constants/customer-information-input-type";
import StoreAction from './constants/store-action';
import UserEvent from "./constants/user-event";

import { IInsuranceOptionsResponse, IVehicleLookupResponse, IAddressLookupResponse, IOrderOptionsResponse, DrivingDistance, PaymentType, IPaymentLookupResponse } from '@wayke-se/ecom';

export interface IVehicle {
    id: string;
    title: string;
    shortDescription: string;
    price: number;
    imageUrl: string;
    retailerName: string;
    retailerEmail: string;
    retailerPhoneNumber: string;
    modelYear: number;
    milage: string;
    gearBox: string;
    fuelType: string;
};

export interface IEcomExternalProps {
    vehicle: IVehicle;
    serviceLogotypeUrl: string;

    onExit: () => void;
    onUserEvent?: (userEvent: string, currentStep: string) => void;
}

export interface IEcomContext {
    isWaitingForResponse: boolean;

    orderOptions: IOrderOptionsResponse;
    insuranceOptions: IInsuranceOptionsResponse;
    vehicleLookup: IVehicleLookupResponse;
    addressLookup: IAddressLookupResponse;
    paymentLookup: IPaymentLookupResponse;

    onFetchInsuranceOptions: (callback: (isSuccessful: boolean) => void) => void;
    onFetchVehicleInformation: (callback: (isSuccessful: boolean) => void) => void;
    onFetchAddressInformation: (callback: (isSuccessful: boolean) => void) => void;
    onFetchPaymentInformation: (callback: (isSuccessful: boolean) => void) => void;
    onCreateOrder: (callback: (isSuccessful: boolean) => void) => void;
}

export interface IEcomLifecycle {
    onProceedToNextStep: () => void;
    onShowCustomerInformationInitial: () => void;
    onShowInsuranceInformationDefinition: () => void;
    onShowTradeInCarDefinition: () => void;
    onShowPaymentMethodChooser: () => void;
    onIncompleteUserEvent: (userEvent: UserEvent) => void;
};

export interface IEcomStore {
    data: IEcomData;

    dispatchStoreAction: (key: StoreAction, value: any, callback?: (state: IEcomData) => void) => void;
};

export interface IEcomData {
    customer: ICustomerData,
    insurance: IInsuranceData,
    interact: IInteractData,
    payment: IPaymentData,
    tradeInCar: ITradeInCarData
};

export interface ITradeInCarData {
    wantsToDefineTradeIn: boolean;
    hasProvidedTradeInInfo: boolean;
    hasTradeInCar: boolean;
    registrationNumber: string;
    milage: string;
    description: string;
};

export interface IPaymentData {
    paymentType: PaymentType;
    loanDeposit: number;
    loanDuration: number;
    loanResidual: number;
};

export interface IInsuranceData {
    wantsToSeeInsuranceOptions: boolean;
    hasAddedInsurance: boolean;
    personalNumber: string;
    expectedDrivingDistance: DrivingDistance;
    addons: string[];
};

export interface ICustomerData {
    hasAcceptedTerms: boolean;
    inputType: CustomerInformationInputType;
    personalNumber: string;
    name: string;
    address: string;
    zip: string;
    city: string;
    email: string;
    phone: string;
};

export interface ICustomerObject {
    isMasked: boolean;
    isAutomaticLookup: boolean;
    personalNumber: string;
    email: string;
    phone: string;
    name: string;
    address: string;
    zip: string;
    city: string;
};

export interface IInteractData {
    tradeInCar: {
        registrationNumber: boolean;
        milage: boolean;
    };

    insurance: {
        personalNumber: boolean;
    };

    customer: {
        hasAcceptedTerms: boolean;
        personalNumber: boolean;
        name: boolean;
        address: boolean;
        zip: boolean;
        city: boolean;
        email: boolean;
        phone: boolean;
    };
};

export interface IOrderOptionsSdkData {
    vehicleId: string;
};

export interface IInsuranceOptionsSdkData {
    vehicleId: string;
    paymentType: PaymentType;
    ecomData: IInsuranceData;
};

export interface IVehicleLookupSdkData {
    ecomData: ITradeInCarData;
};

export interface IAddressLookupSdkData {
    ecomData: ICustomerData;
};

export interface ICreateOrderSdkData {
    vehicleId: string;
    ecomData: IEcomData;
    addressLookup: IAddressLookupResponse;
    orderOptions: IOrderOptionsResponse;
    paymentLookup: IPaymentLookupResponse | undefined;
};

export interface IPaymentLookupSdkData {
    vehicleId: string;
    ecomData: IPaymentData;
    orderOptions: IOrderOptionsResponse;
    paymentLookup: IPaymentLookupResponse | undefined;
};