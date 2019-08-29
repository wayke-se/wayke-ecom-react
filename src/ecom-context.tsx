import React from "react";

import { IEcomExternalProps, IEcomStore } from "./types";
import EcomLifecycle from './ecom-lifecycle';

import { IOrderOptionsResponse, IInsuranceOptionsResponse, IVehicleLookupResponse, IAddressLookupResponse, IOrderCreateResponse } from "wayke-ecom";

import { makeOrderOptionsRequest, makeVehicleLookupRequest, makeInsuranceOptionsRequest, makeAddressLookupRequest, makeCreateOrderRequest } from './tools/request-service';
import RequestType from "./constants/request-type";

export interface IEcomContextProps extends IEcomExternalProps, IEcomStore {
}

interface IState {
    isWaitingForResponse: boolean;

    orderOptions: IOrderOptionsResponse | undefined;
    insuranceOptions: IInsuranceOptionsResponse | undefined;
    vehicleLookup: IVehicleLookupResponse | undefined;
    addressLookup: IAddressLookupResponse | undefined;
    orderCreate: IOrderCreateResponse | undefined;
};

class EcomContext extends React.Component<IEcomContextProps, IState> {
    constructor(props: IEcomContextProps) {
        super(props);

        this.handleFetchVehicleInformation = this.handleFetchVehicleInformation.bind(this);
        this.handleFetchInsuranceOptions = this.handleFetchInsuranceOptions.bind(this);
        this.handleFetchAddressInformation = this.handleFetchAddressInformation.bind(this);
        this.handleCreateOrder = this.handleCreateOrder.bind(this);

        this.makeRequest = this.makeRequest.bind(this);
        this.saveResponse = this.saveResponse.bind(this);

        this.state = {
            isWaitingForResponse: false,

            orderOptions: null,
            insuranceOptions: null,
            vehicleLookup: null,
            addressLookup: null,
            orderCreate: null
        };
    }

    componentDidMount() {
    }

    handleFetchVehicleInformation() {
        const request = () => {
            makeVehicleLookupRequest({
                registrationNumber: this.props.data.tradeInCar.registrationNumber
            }, (isSuccessful: boolean, response: IVehicleLookupResponse) => {
                this.saveResponse(response);
            });
        }

        this.makeRequest(request);
    }

    handleFetchInsuranceOptions() {
        makeInsuranceOptionsRequest({
            personalNumber: this.props.data.insurance.personalNumber,
            vehicleId: this.props.vehicle.id,
            paymentType: this.props.data.payment.paymentOption,
            drivingDistance: this.props.data.insurance.expectedDrivingDistance.optionIndex
        }, (isSuccessful: boolean, response: IInsuranceOptionsResponse) => {

        });
    }

    handleFetchAddressInformation() {
        makeAddressLookupRequest({
            personalNumber: this.props.data.customer.personalNumber
        }, (isSuccessful: boolean, response: IAddressLookupResponse) => {

        });
    }

    handleCreateOrder() {
        //TODO
    }

    makeRequest(callback: () => void) {
        this.setState({
            isWaitingForResponse: true
        }, callback);
    }

    saveResponse(responseState: any) {
        this.setState({
            ...responseState,
            isWaitingForResponse: false
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