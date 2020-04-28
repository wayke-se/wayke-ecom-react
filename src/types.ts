import CustomerInformationInputType from "./constants/customer-information-input-type";
import StoreAction from "./constants/store-action";
import UserEvent from "./constants/user-event";
import OverlayType from "./constants/overlay-type";

import {
    IInsuranceOptionsResponse,
    IVehicleLookupResponse,
    IAddressLookupResponse,
    IOrderOptionsResponse,
    DrivingDistance,
    PaymentType,
    IPaymentLookupResponse,
    VehicleCondition,
    DeliveryType,
    IBankIdAuthResponse,
    AuthMethod,
    IBankIdCollectResponse,
} from "@wayke-se/ecom";

export interface IVehicle {
    id: string;
    title: string;
    shortDescription: string;
    price: number;
    imageUrl: string;
    modelYear: number;
    milage: string;
    gearBox: string;
    fuelType: string;
}

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
    hasIpAddress: boolean;
    bankIdAuth: IBankIdAuthResponse;
    bankIdCollect: IBankIdCollectResponse;

    onFetchInsuranceOptions: (
        callback: (isSuccessful: boolean) => void
    ) => void;
    onFetchVehicleInformation: (
        callback: (isSuccessful: boolean) => void
    ) => void;
    onFetchAddressInformation: (
        callback: (isSuccessful: boolean) => void
    ) => void;
    onFetchPaymentInformation: (
        callback: (isSuccessful: boolean) => void
    ) => void;
    onCreateOrder: (callback: (isSuccessful: boolean) => void) => void;
    onLookupIpAddress: () => void;
    onBankIdQrCodeAuth: (
        callback: (response: IBankIdAuthResponse) => void
    ) => void;
    onBankIdCollect: (
        callback: (response: IBankIdCollectResponse) => void
    ) => void;
    onBankIdSuccess: () => void;
}

export interface IEcomLifecycle {
    onProceedToNextStep: () => void;
    onPreviousStepClick: () => void;
    onShowCustomerInformationInitial: () => void;
    onShowInsuranceInformationDefinition: () => void;
    onShowTradeInCarDefinition: () => void;
    onShowPaymentMethodChooser: () => void;
    onIncompleteUserEvent: (userEvent: UserEvent) => void;
    onDisplayOverlay: (overlayType: OverlayType) => void;
}

export interface IEcomStore {
    data: IEcomData;

    dispatchStoreAction: (
        key: StoreAction,
        value: any,
        callback?: (state: IEcomData) => void
    ) => void;
}

export interface IEcomData {
    customer: ICustomerData;
    delivery: IDeliveryMethodData;
    insurance: IInsuranceData;
    interact: IInteractData;
    payment: IPaymentData;
    tradeInCar: ITradeInCarData;
}

export interface IDeliveryMethodData {
    type: DeliveryType;
}

export interface ITradeInCarData {
    wantsToDefineTradeIn: boolean;
    hasProvidedTradeInInfo: boolean;
    hasProvidedTradeInCondition: boolean;
    hasTradeInCar: boolean;
    registrationNumber: string;
    milage: string;
    condition: VehicleCondition;
    description: string;
}

export interface IPaymentData {
    paymentType: PaymentType;
    loanDeposit: number;
    loanDuration: number;
    loanResidual: number;
    hasAcceptedLoanDetails: boolean;
}

export interface IInsuranceData {
    wantsToSeeInsuranceOptions: boolean;
    hasAddedInsurance: boolean;
    personalNumber: string;
    expectedDrivingDistance: DrivingDistance;
    addons: string[];
}

export interface ICustomerData {
    hasAcceptedConditions: boolean;
    hasAcceptedReturnConditions: boolean;
    inputType: CustomerInformationInputType;
    personalNumber: string;
    name: string;
    address: string;
    zip: string;
    city: string;
    email: string;
    phone: string;
}

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
}

export interface IInteractData {
    tradeInCar: {
        registrationNumber: boolean;
        milage: boolean;
    };

    insurance: {
        personalNumber: boolean;
    };

    customer: {
        hasAcceptedConditions: boolean;
        hasAcceptedReturnConditions: boolean;
        personalNumber: boolean;
        name: boolean;
        address: boolean;
        zip: boolean;
        city: boolean;
        email: boolean;
        phone: boolean;
        isAuthenticated: boolean;
    };

    delivery: {
        type: boolean;
    };
}

export interface IOrderOptionsSdkData {
    vehicleId: string;
}

export interface IInsuranceOptionsSdkData {
    vehicleId: string;
    paymentType: PaymentType;
    ecomData: IInsuranceData;
}

export interface IVehicleLookupSdkData {
    ecomData: ITradeInCarData;
}

export interface IAddressLookupSdkData {
    ecomData: ICustomerData;
}

export interface ICreateOrderSdkData {
    vehicleId: string;
    ecomData: IEcomData;
    addressLookup: IAddressLookupResponse;
    orderOptions: IOrderOptionsResponse;
    paymentLookup: IPaymentLookupResponse | undefined;
}

export interface IPaymentLookupSdkData {
    vehicleId: string;
    ecomData: IPaymentData;
    orderOptions: IOrderOptionsResponse;
    paymentLookup: IPaymentLookupResponse | undefined;
}

export interface IRetailerInformation {
    name: string;
    email: string;
    phoneNumber: string;
}

export interface ILoanInformation {
    name: string;
    unit: string;
}

export interface IBankIdAuthSdkData {
    method: AuthMethod;
    ipAddress: string;
}

export interface IIpLookupResponse {
    ip: string;
}

export interface IBankIdCollectSdkData {
    method: AuthMethod;
    orderRef: string;
}
