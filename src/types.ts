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
    IAddress,
    ICreditAssessmentCase,
    ICreditAssessmentSignResponse,
    ICreditAssessmentStatusResponse,
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
    useBankId?: boolean;
    displayBankIdAlert?: boolean;
}

export interface IEcomContext {
    isWaitingForResponse: boolean;

    orderOptions: IOrderOptionsResponse;
    insuranceOptions: IInsuranceOptionsResponse;
    vehicleLookup: IVehicleLookupResponse;
    addressLookup: IAddressLookupResponse;
    paymentLookup: IPaymentLookupResponse;
    bankIdAuth: IBankIdAuthResponse;
    pendingBankIdAuthRequest: boolean;
    bankIdCollect: IBankIdCollectResponse;
    hasBankIdError: boolean;
    hasCreditAssessmentError: boolean;
    pendingCreateCreditAssessmentCase: boolean;
    creditAssessmentCase: ICreditAssessmentCase;
    creditAssessmentStatus: ICreditAssessmentStatusResponse;
    creditAssessmentSigning: ICreditAssessmentSignResponse;
    pendingCreditAssessmentSignRequest: boolean;

    getAddress: () => IAddress;

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
    onBankIdQrCodeAuth: () => void;
    onBankIdSameDeviceAuth: () => void;
    onBankIdCollect: () => void;
    onBankIdCancel: (callback: (response: boolean) => void) => void;
    onBankIdReset: () => void;
    createCreditAssessmentCase: () => void;
    declineCreditAssessmentCase: () => void;
    acceptCreditAssessmentCase: (callback: (response: boolean) => void) => void;
    signCreditAssessmentWithQrCode: () => void;
    signCreditAssessmentWithSameDevice: () => void;
    cancelCreditAssessmentSigning: (
        callback: (response: boolean) => void
    ) => void;
    resetCreditAssessmentSigning: () => void;
    getCreditAssessmentStatus: () => void;
}

export interface IEcomLifecycle {
    onProceedToNextStep: () => void;
    onPreviousStepClick: () => void;
    onShowCustomerInformationInitial: () => void;
    onShowInsuranceInformationDefinition: () => void;
    onShowTradeInCarDefinition: () => void;
    onShowPaymentMethodChooser: () => void;
    onShowCreditAssessmentInformation: () => void;
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
    householdEconomy: IHouseholdEconomyData;
    delivery: IDeliveryMethodData;
    insurance: IInsuranceData;
    interact: IInteractData;
    payment: IPaymentData;
    tradeInCar: ITradeInCarData;
    useBankId: boolean;
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
    externalId?: string;
    financialProductCode?: string;
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
    givenName: string;
    surname: string;
    street: string;
    zip: string;
    city: string;
    email: string;
    phone: string;
}

export interface IHouseholdEconomyData {
    maritalStatus: string;
    income: string;
    employment: string;
    householdChildren: string;
    householdIncome: string;
    householdHousingCost: string;
    householdDebt: string;
}

export interface ICustomerObject {
    isMasked: boolean;
    isAutomaticLookup: boolean;
    personalNumber: string;
    email: string;
    phone: string;
    givenName: string;
    surname: string;
    street: string;
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
        givenName: boolean;
        surname: boolean;
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
    orderOptions: IOrderOptionsResponse;
    paymentLookup: IPaymentLookupResponse | undefined;
    address: IAddress;
    creditAssessmentStatus: ICreditAssessmentStatusResponse;
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
}

export interface IIpLookupResponse {
    ip: string;
}

export interface IBankIdCollectSdkData {
    method: AuthMethod;
    orderRef: string;
}

export interface IBankIdCancelSdkData {
    orderRef: string;
}

export enum IdentificationMethod {
    Manual = "manual",
    BankId = "bank-id",
    CreditAssessment = "credit-assessment",
}
