import CustomerInformationInputType from "./constants/customer-information-input-type";
import StoreAction from './constants/store-action';
import { IInsuranceOptionsResponse, IVehicleLookupResponse, IAddressLookupResponse, IOrderOptionsResponse, DrivingDistance, PaymentType } from "wayke-ecom";

export interface IVehicle {
    id: string;
    title: string;
    shortDescription: string;
    price: number;
    imageUrl: string;
    retailerName: string;
    modelYear: number;
    milage: string;
    gearBox: string;
    fuelType: string;
};

export interface IEcomExternalProps {
    vehicle: IVehicle;
    serviceLogotypeUrl: string;

    onExit: () => void;
}

export interface IEcomContext {
    isWaitingForResponse: boolean;

    orderOptions: IOrderOptionsResponse;
    insuranceOptions: IInsuranceOptionsResponse;
    vehicleLookup: IVehicleLookupResponse;
    addressLookup: IAddressLookupResponse;

    onFetchInsuranceOptions: (callback: (isSuccessful: boolean) => void) => void;
    onFetchVehicleInformation: (callback: (isSuccessful: boolean) => void) => void;
    onFetchAddressInformation: (callback: (isSuccessful: boolean) => void) => void;
    onCreateOrder: (callback: (isSuccessful: boolean) => void) => void;
}

export interface IEcomLifecycle {
    onProceedToNextStep: () => void;
    onShowCustomerInformationInitial: () => void;
    onShowInsuranceInformationDefinition: () => void;
    onShowTradeInCarDefinition: () => void;
};

export interface IEcomStore {
    data: IEcomData;
    loanSpecification: ILoanSpecification;

    dispatchStoreAction: (key: StoreAction, value: any, callback?: (state : IEcomData) => void) => void;
};

export interface IEcomData {
    customer: ICustomerData,
    insurance: IInsuranceData,
    interact: IInteractData,
    payment: IPaymentData,
    tradeInCar: ITradeInCarData
};

export interface ITradeInCarData {
    hasTradeInCar: boolean;
    registrationNumber: string;
    milage: string;
};

export interface IPaymentData {
    paymentType: PaymentType;
    loanDeposit: number;
    loanDuration: number;
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

export interface ILoanSpecification {
    durationMin: number;
    durationMax: number;
    durationStep: number;
    durationDefault: number;

    depositMin: number;
    depositMax: number;
    depositStep: number;
    depositDefault: number;
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
};