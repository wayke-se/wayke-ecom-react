import React from "react";

import { IEcomExternalProps, IEcomStore } from "./types";
import { IOrderOptionsResponse, IInsuranceOptionsResponse, IVehicleLookupResponse, IAddressLookupResponse, IOrderCreateResponse } from "wayke-ecom";

import EcomLifecycle from './ecom-lifecycle';
import { makeOrderOptionsRequest, makeVehicleLookupRequest, makeInsuranceOptionsRequest, makeAddressLookupRequest, makeCreateOrderRequest } from './tools/request-service';

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
        const request = () => {
            makeOrderOptionsRequest({
                vehicleId: this.props.vehicle.id
            }, (response: IOrderOptionsResponse) => {
                this.saveResponse({
                    orderOptions: response
                }, () => {});
            });
        }

        this.makeRequest(request);
    }

    handleFetchVehicleInformation(callback: (isSuccessful: boolean) => void) {
        const request = () => {
            makeVehicleLookupRequest({
                ecomData: this.props.data.tradeInCar
            }, (response: IVehicleLookupResponse) => {
                this.saveResponse({
                    vehicleLookup: response
                }, () => {
                    callback(!!response);
                });
            });
        }

        this.makeRequest(request);
    }

    handleFetchInsuranceOptions(callback: (isSuccessful: boolean) => void) {
        const request = () => {
            makeInsuranceOptionsRequest({
                ecomData: this.props.data.insurance,
                vehicleId: this.props.vehicle.id,
                paymentType: this.props.data.payment.paymentType
            }, (response: IInsuranceOptionsResponse) => {
                this.saveResponse({
                    insuranceOptions: response
                }, () => {
                    callback(!!response);
                });
            });
        }

        this.makeRequest(request);
    }

    handleFetchAddressInformation(callback: (isSuccessful: boolean) => void) {
        const request = () => {
            makeAddressLookupRequest({
                ecomData: this.props.data.customer
            }, (response: IAddressLookupResponse) => {
                this.saveResponse({
                    addressLookup: response
                }, () => {
                    callback(!!response);
                });
            });
        }

        this.makeRequest(request);
    }

    handleCreateOrder(callback: (isSuccessful: boolean) => void) {
        const request = () => {
            makeCreateOrderRequest({
                ecomData: this.props.data,
                addressLookup: this.state.addressLookup,
                vehicleId: this.props.vehicle.id
            }, (response: IOrderCreateResponse) => {
                this.saveResponse({
                    orderCreate: response
                }, () => {
                    callback(!!response);
                });
            });
        }

        this.makeRequest(request);
    }

    makeRequest(callback: () => void) {
        this.setState({
            isWaitingForResponse: true
        }, callback);
    }

    saveResponse(responseState: any, callback: () => void) {
        this.setState({
            ...responseState,
            isWaitingForResponse: false
        }, callback);
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