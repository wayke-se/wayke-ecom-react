import React from "react";

import { IEcomExternalProps, IEcomStore } from "./types";
import EcomLifecycle from './ecom-lifecycle';
import { getInitialData, getInsuranceOptions, getVehicleLookup } from "./sdk/ecom-sdk-actions";
import { IOrderOptionsResponse, IInsuranceOptionsResponse, IVehicleLookupResponse } from "wayke-ecom";

export interface IEcomContextProps extends IEcomExternalProps, IEcomStore {
}

interface IState {
    orderOptions: IOrderOptionsResponse;
    insuranceOptions: IInsuranceOptionsResponse;
    vehicleLookup: IVehicleLookupResponse;
};

class Ecom extends React.Component<IEcomContextProps, IState> {
    constructor(props: IEcomContextProps) {
        super(props);

        this.handleFetchInsuranceOptions = this.handleFetchInsuranceOptions.bind(this);
        this.handleFetchVehicleInformation = this.handleFetchVehicleInformation.bind(this);

        this.state = {
            orderOptions: null,
            insuranceOptions: null,
            vehicleLookup: null
        };
    }

    componentDidMount() {
        getInitialData(this.props.vehicle.id, (response: IOrderOptionsResponse) => {
            this.setState({
                orderOptions: response
            });
        });
    }

    handleFetchInsuranceOptions(callback?: () => void) {
        const hasPersonalNumber = this.props.data.insurance && this.props.data.insurance.personalNumber;
        const hasVehicleId = this.props.vehicle.id;
        const hasPaymentOption = this.props.data.payment && this.props.data.payment.paymentOption;
        const hasDrivingDistance = this.props.data.insurance && this.props.data.insurance.expectedDrivingDistance;

        const hasAllData = hasPersonalNumber && hasVehicleId && hasPaymentOption && hasDrivingDistance;

        if (!hasAllData) {
            if (callback) {
                callback();
            }

            return;
        }

        const personalNumber = this.props.data.insurance.personalNumber;
        const vehicleId = this.props.vehicle.id;
        const paymentOption = this.props.data.payment.paymentOption;
        const drivingDistance = this.props.data.insurance.expectedDrivingDistance.optionIndex;

        getInsuranceOptions(
            personalNumber,
            vehicleId,
            paymentOption,
            drivingDistance,
            (response: IInsuranceOptionsResponse) => {
                this.setState({
                    insuranceOptions: response
                }, callback);
            }
        );
    }

    handleFetchVehicleInformation(callback?: () => void) {
        const hasRegistrationNumber = this.props.data.tradeInCar && this.props.data.tradeInCar.registrationNumber;

        if (!hasRegistrationNumber) {
            if (callback) {
                callback();
            }

            return;
        }

        const registrationNumber = this.props.data.tradeInCar.registrationNumber;

        getVehicleLookup(registrationNumber, (response: IVehicleLookupResponse) => {
            this.setState({
                vehicleLookup: response,
            }, callback);
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

export default Ecom;