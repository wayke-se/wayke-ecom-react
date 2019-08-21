import { ChangeEvent, FocusEvent } from 'react';

import CustomerInformationInputType from "./enums/customer-information-input-type";
import DeliveryType from "./enums/delivery-type";
import InsuranceOption from "./enums/insurance-option";
import PaymentMethod from "./enums/payment-method";

export interface IVehicle {
    title: string;
    shortDescription: string;
    price: number;
};

export interface IEcomContext {
    hasAcceptedTerms: boolean;
};

export interface IEcomLifecycle {
    onInputChange: (e: ChangeEvent) => void;
    onInputBlur: (e: FocusEvent) => void;
    onNextStepClick: () => void;
};

export interface ITradeInCarData {
    hasTradeInCar: boolean;
    registrationNumber: string;
    milage: string;
};

export interface IPaymentData {
    method: PaymentMethod;
    financingDownPayment: string;
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

    context: {
        hasAcceptedTerms: boolean;
    };

    customer: {
        personalNumber: boolean;
        name: boolean;
        adress: boolean;
        zip: boolean;
        city: boolean;
        email: boolean;
        phone: boolean;
    };
};