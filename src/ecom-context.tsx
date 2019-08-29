import React from "react";

import { IEcomExternalProps, IEcomStore, IExpectedDrivingDistance } from "./types";
import EcomLifecycle from './ecom-lifecycle';
import { getOrderOptions, getInsuranceOptions, getVehicleLookup, getAddressLookup, createOrder } from "./sdk/ecom-sdk-actions";

import { IOrderOptionsResponse, IInsuranceOptionsResponse, IVehicleLookupResponse, IAddressLookupResponse, VehicleCondition, IAddress, PaymentType, DeliveryType, IOrderCreateResponse } from "wayke-ecom";
import { IPaymentOption } from "wayke-ecom/dist-types/orders/types";

export interface IEcomContextProps extends IEcomExternalProps, IEcomStore {
}

interface IState {
    orderOptions: IOrderOptionsResponse;
    insuranceOptions: IInsuranceOptionsResponse;
    vehicleLookup: IVehicleLookupResponse;
    addressLookup: IAddressLookupResponse;
    orderCreate: IOrderCreateResponse;

    orderOptionsError: boolean;
    insuranceOptionsError: boolean;
    vehicleLookupError: boolean;
    addressLookupError: boolean;
    orderCreateError: boolean;

    insuranceOptionsRequestInformation: {
        personalNumber: string;
        paymentOption: IPaymentOption;
        expectedDrivingDistance: IExpectedDrivingDistance;
    },

    vehicleLookupRequestInformation: {
        registrationNumber: string;
    },

    addressLookupRequestInformation: {
        personalNumber: string;
    }
};

class EcomContext extends React.Component<IEcomContextProps, IState> {
    constructor(props: IEcomContextProps) {
        super(props);

        this.handleFetchOrderOptions = this.handleFetchOrderOptions.bind(this);
        this.handleFetchOrderOptionsResponse = this.handleFetchOrderOptionsResponse.bind(this);

        this.shouldFetchInsuranceOptions = this.shouldFetchInsuranceOptions.bind(this);
        this.handleFetchInsuranceOptions = this.handleFetchInsuranceOptions.bind(this);
        this.handleFetchInsuranceOptionsResponse = this.handleFetchInsuranceOptionsResponse.bind(this);

        this.shouldFetchVehicleInformation = this.shouldFetchVehicleInformation.bind(this);
        this.handleFetchVehicleInformation = this.handleFetchVehicleInformation.bind(this);
        this.handleFetchVehicleInformationResponse = this.handleFetchVehicleInformationResponse.bind(this);

        this.shouldFetchAddressInformation = this.shouldFetchAddressInformation.bind(this);
        this.handleFetchAddressInformation = this.handleFetchAddressInformation.bind(this);
        this.handleFetchAddressInformationResponse = this.handleFetchAddressInformationResponse.bind(this);

        this.handleCreateOrder = this.handleCreateOrder.bind(this);
        this.handleCreateOrderResponse = this.handleCreateOrderResponse.bind(this);

        this.state = {
            orderOptions: null,
            insuranceOptions: null,
            vehicleLookup: null,
            addressLookup: null,
            orderCreate: null,

            orderOptionsError: false,
            insuranceOptionsError: false,
            vehicleLookupError: false,
            addressLookupError: false,
            orderCreateError: false,

            insuranceOptionsRequestInformation: null,
            vehicleLookupRequestInformation: null,
            addressLookupRequestInformation: null
        };
    }

    componentDidMount() {
        this.handleFetchOrderOptions();
    }

    handleFetchOrderOptions() {
        getOrderOptions(this.props.vehicle.id, this.handleFetchOrderOptionsResponse);
    }

    handleFetchOrderOptionsResponse(isSuccessful: boolean, response: IOrderOptionsResponse) {
        this.setState({
            orderOptions: response,
            orderOptionsError: !isSuccessful
        });
    }

    shouldFetchInsuranceOptions() {
        if (this.state.insuranceOptionsRequestInformation === null) {
            return true;
        }

        const information = this.state.insuranceOptionsRequestInformation;

        const isSamePersonalNumber = information.personalNumber === this.props.data.insurance.personalNumber;
        const isSamePaymentOption = information.paymentOption === this.props.data.payment.paymentOption;
        const isSameExpectedDrivingDistance = information.expectedDrivingDistance === this.props.data.insurance.expectedDrivingDistance;

        return !isSamePersonalNumber || !isSamePaymentOption || !isSameExpectedDrivingDistance;
    }

    handleFetchInsuranceOptions() {
        const hasPersonalNumber = this.props.data.insurance && this.props.data.insurance.personalNumber;
        const hasVehicleId = this.props.vehicle.id;
        const hasPaymentOption = this.props.data.payment && this.props.data.payment.paymentOption;
        const hasExpectedDrivingDistance = this.props.data.insurance && this.props.data.insurance.expectedDrivingDistance;

        const hasAllData = hasPersonalNumber && hasVehicleId && hasPaymentOption && hasExpectedDrivingDistance;

        if (!hasAllData) {
            return;
        }

        const shouldFetch = this.shouldFetchInsuranceOptions();

        if (!shouldFetch) {
            return;
        }

        const personalNumber = this.props.data.insurance.personalNumber;
        const vehicleId = this.props.vehicle.id;
        const paymentOption = this.props.data.payment.paymentOption;
        const expectedDrivingDistance = this.props.data.insurance.expectedDrivingDistance.optionIndex;

        this.setState({
            insuranceOptions: null,
            insuranceOptionsError: false,
            insuranceOptionsRequestInformation: null
        }, () => {
            getInsuranceOptions(
                personalNumber,
                vehicleId,
                paymentOption,
                expectedDrivingDistance,
                this.handleFetchInsuranceOptionsResponse
            );
        });
    }

    handleFetchInsuranceOptionsResponse(isSuccessful: boolean, response: IInsuranceOptionsResponse) {
        this.setState({
            insuranceOptions: response,
            insuranceOptionsError: !isSuccessful,
            insuranceOptionsRequestInformation: {
                personalNumber: this.props.data.insurance.personalNumber,
                paymentOption: this.props.data.payment.paymentOption,
                expectedDrivingDistance: this.props.data.insurance.expectedDrivingDistance
            }
        });
    }

    shouldFetchVehicleInformation() {
        return this.state.vehicleLookupRequestInformation === null || this.state.vehicleLookupRequestInformation.registrationNumber !== this.props.data.tradeInCar.registrationNumber;
    }

    handleFetchVehicleInformation() {
        const hasRegistrationNumber = this.props.data.tradeInCar && this.props.data.tradeInCar.registrationNumber;

        if (!hasRegistrationNumber) {
            return;
        }

        const shouldFetch = this.shouldFetchVehicleInformation();

        if (!shouldFetch) {
            return;
        }

        const registrationNumber = this.props.data.tradeInCar.registrationNumber;

        this.setState({
            vehicleLookup: null,
            vehicleLookupError: false,
            vehicleLookupRequestInformation: null
        }, () => {
            getVehicleLookup(registrationNumber, this.handleFetchVehicleInformationResponse);
        });
    }

    handleFetchVehicleInformationResponse(isSuccessful: boolean, response: IVehicleLookupResponse) {
        this.setState({
            vehicleLookup: response,
            vehicleLookupError: !isSuccessful,
            vehicleLookupRequestInformation: {
                registrationNumber: this.props.data.tradeInCar.registrationNumber
            }
        });
    }

    shouldFetchAddressInformation() {
        return this.state.addressLookupRequestInformation === null || this.state.addressLookupRequestInformation.personalNumber !== this.props.data.customer.personalNumber;
    }

    handleFetchAddressInformation() {
        const hasPersonalNumber = this.props.data.customer && this.props.data.customer.personalNumber;

        if (!hasPersonalNumber) {
            return;
        }

        const shouldFetch = this.shouldFetchAddressInformation();

        if (!shouldFetch) {
            return;
        }

        const personalNumber = this.props.data.customer.personalNumber;

        this.setState({
            addressLookup: null,
            addressLookupError: false,
            addressLookupRequestInformation: null
        }, () => {
            getAddressLookup(personalNumber, this.handleFetchAddressInformationResponse);
        });
    }

    handleFetchAddressInformationResponse(isSuccessful: boolean, response: IAddressLookupResponse) {
        this.setState({
            addressLookup: response,
            addressLookupError: !isSuccessful,
            addressLookupRequestInformation: {
                personalNumber: this.props.data.customer.personalNumber
            }
        });
    }

    handleCreateOrder() {
        var customer = this.props.data.customer;
        var insurance = this.props.data.insurance;
        var payment = this.props.data.payment;
        var tradeInCar = this.props.data.tradeInCar;

        var customerAddress = null;
        var customerPersonalNumber = customer.personalNumber;
        var customerEmail = customer.email;
        var customerPhone = customer.phone;

        if (this.state.addressLookup) {
            customerAddress = this.state.addressLookup.getAddress();
        } else {
            customerAddress = {
                city: customer.city,
                name: customer.name,
                postalCode: customer.zip,
                street: customer.address,
                street2: ''
            } as IAddress;
        }

        var paymentType = payment.paymentOption.type;
        var paymentLoanDeposit = 0;
        var paymentLoanDuration = 0;
        var paymentResidualValue = 0;

        if (paymentType === PaymentType.Loan) {
            paymentLoanDeposit = parseInt(payment.loanDeposit);
            paymentLoanDuration = payment.loanDuration;
        }

        var insuranceExpectedDrivingDistance = 0;
        var insuranceAddOns: string[] = [];

        if (insurance.hasAddedInsurance) {
            insuranceExpectedDrivingDistance = insurance.expectedDrivingDistance.optionIndex;
        }

        var tradeInRegistrationNumber = null;
        var tradeInMilage = null;
        var tradeInCondition = VehicleCondition.Ok;
        var tradeInComment = '';

        if (tradeInCar.hasTradeInCar) {
            tradeInRegistrationNumber = tradeInCar.registrationNumber;
            tradeInMilage = tradeInCar.milage;
        }

        var vehicleId = this.props.vehicle.id;
        var deliveryType = DeliveryType.Pickup;

        this.setState({
            orderCreate: null,
            orderCreateError: false,
        }, () => {
            createOrder(
                customerAddress,
                customerPersonalNumber,
                customerEmail,
                customerPhone,

                paymentType,
                paymentLoanDeposit,
                paymentLoanDuration,
                paymentResidualValue,

                insuranceExpectedDrivingDistance,
                insuranceAddOns,

                tradeInRegistrationNumber,
                tradeInMilage,
                tradeInCondition,
                tradeInComment,

                vehicleId,
                deliveryType,

                this.handleCreateOrderResponse
            );
        });
    }

    handleCreateOrderResponse(isSuccessful: boolean, response: IOrderCreateResponse) {
        this.setState({
            orderCreate: response,
            orderCreateError: !isSuccessful
        });
    }

    render() {
        return (
            <EcomLifecycle
                onFetchInsuranceOptions={this.handleFetchInsuranceOptions}
                onFetchVehicleInformation={this.handleFetchVehicleInformation}
                onFetchAddressInformation={this.handleFetchAddressInformation}
                onCreateOrder={this.handleCreateOrder}
                {...this.state}
                {...this.props} />
        );
    }
};

export default EcomContext;