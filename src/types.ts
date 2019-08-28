import CustomerInformationInputType from "./enums/customer-information-input-type";
import InsuranceOption from "./enums/insurance-option";
import StoreAction from './enums/store-action';
import { IPaymentOption, IOrderOptionsResponse } from "wayke-ecom/dist-types/orders/types";
import { IInsuranceOptionsResponse, IVehicleLookupResponse } from "wayke-ecom";

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
    orderOptions: IOrderOptionsResponse;
    insuranceOptions: IInsuranceOptionsResponse;
    vehicleLookup: IVehicleLookupResponse;

    orderOptionsError: boolean;
    insuranceOptionsError: boolean;
    vehicleLookupError: boolean;

    onFetchInsuranceOptions: () => void;
    onFetchVehicleInformation: () => void;
}

export interface IEcomLifecycle {
    onNextStepClick: () => void;
    onShowCustomerInformationInitial: () => void;
    onShowInsuranceInformationDefinition: () => void;
    onShowTradeInCarDefinition: () => void;
};

export interface IEcomStore {
    data: IEcomData;
    dispatchStoreAction: (key: StoreAction, value: any, callback?: () => void) => void;
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
    paymentOption: IPaymentOption;
    financingDeposit: string;
    financingDuration: number;
};

export interface IExpectedDrivingDistance {
    optionIndex: number;
    min: number;
    max: number;
};

export interface IInsuranceData {
    insuranceOption: InsuranceOption;
    personalNumber: string;
    expectedDrivingDistance: IExpectedDrivingDistance;
    hasAddedInsurance: boolean;
};

export interface ICustomerData {
    hasAcceptedTerms: boolean;
    inputType: CustomerInformationInputType;
    personalNumber: string;
    name: string;
    adress: string;
    zip: string;
    city: string;
    email: string;
    phone: string;
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
        adress: boolean;
        zip: boolean;
        city: boolean;
        email: boolean;
        phone: boolean;
    };
};