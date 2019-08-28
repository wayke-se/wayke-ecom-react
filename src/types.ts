import CustomerInformationInputType from "./enums/customer-information-input-type";
import DeliveryType from "./enums/delivery-type";
import InsuranceOption from "./enums/insurance-option";
import StoreAction from './enums/store-action';
import { IPaymentOption, IOrderOptionsResponse } from "wayke-ecom/dist-types/orders/types";
import { IInsuranceOptionsResponse } from "wayke-ecom";

export interface IVehicle {
    id: string;
    title: string;
    shortDescription: string;
    price: number;
};

export interface IEcomContext {
    vehicle: IVehicle;
    orderOptions: IOrderOptionsResponse;
    insuranceOptions: IInsuranceOptionsResponse;

    onFetchInsuranceOptions: (
        personalNumber: string,
        vehicleId: string,
        paymentType: IPaymentOption,
        drivingDistance: number,
        callback: () => void
    ) => void;
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
    delivery: IDeliveryData,
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
    min: number;
    max: number;
};

export interface IInsuranceData {
    insuranceOption: InsuranceOption;
    personalNumber: string;
    expectedDrivingDistance: IExpectedDrivingDistance;
    alternative: string;
};

export interface IDeliveryData {
    type: DeliveryType;
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