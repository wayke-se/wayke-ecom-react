import React from "react";

import { IEcomExternalProps, IEcomStore, IExpectedDrivingDistance } from "./types";
import EcomLifecycle from './ecom-lifecycle';
import { getOrderOptions, getInsuranceOptions, getVehicleLookup } from "./sdk/ecom-sdk-actions";

import { IOrderOptionsResponse, IInsuranceOptionsResponse, IVehicleLookupResponse } from "wayke-ecom";
import { IPaymentOption } from "wayke-ecom/dist-types/orders/types";

export interface IEcomContextProps extends IEcomExternalProps, IEcomStore {
}

interface IState {
    orderOptions: IOrderOptionsResponse;
    insuranceOptions: IInsuranceOptionsResponse;
    vehicleLookup: IVehicleLookupResponse;

    orderOptionsError: boolean;
    insuranceOptionsError: boolean;
    vehicleLookupError: boolean;

    insuranceOptionsRequestInformation: {
        personalNumber: string;
        paymentOption: IPaymentOption;
        expectedDrivingDistance: IExpectedDrivingDistance;
    },

    vehicleLookupRequestInformation: {
        registrationNumber: string;
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

        this.state = {
            orderOptions: null,
            insuranceOptions: null,
            vehicleLookup: null,

            orderOptionsError: false,
            insuranceOptionsError: false,
            vehicleLookupError: false,

            insuranceOptionsRequestInformation: null,
            vehicleLookupRequestInformation: null
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

    render() {
        return (
            <EcomLifecycle
                onFetchInsuranceOptions={this.handleFetchInsuranceOptions}
                onFetchVehicleInformation={this.handleFetchVehicleInformation}
                {...this.state}
                {...this.props} />
        );
    }
};

export default EcomContext;