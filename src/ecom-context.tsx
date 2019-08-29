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
                });
            });
        }

        this.makeRequest(request);
    }

    handleFetchVehicleInformation() {
        const request = () => {
            makeVehicleLookupRequest({
                registrationNumber: this.props.data.tradeInCar.registrationNumber
            }, (response: IVehicleLookupResponse) => {
                this.saveResponse({
                    vehicleLookup: response
                });
            });
        }

        this.makeRequest(request);
    }

    handleFetchInsuranceOptions() {
        const request = () => {
            makeInsuranceOptionsRequest({
                personalNumber: this.props.data.insurance.personalNumber,
                vehicleId: this.props.vehicle.id,
                paymentType: this.props.data.payment.paymentOption,
                drivingDistance: this.props.data.insurance.expectedDrivingDistance.optionIndex
            }, (response: IInsuranceOptionsResponse) => {
                this.saveResponse({
                    insuranceOptions: response
                });
            });
        }

        this.makeRequest(request);
    }

    handleFetchAddressInformation() {
        const request = () => {
            makeAddressLookupRequest({
                personalNumber: this.props.data.customer.personalNumber
            }, (response: IAddressLookupResponse) => {
                this.saveResponse({
                    addressLookup: response
                });
            });
        }

        this.makeRequest(request);
    }

    handleCreateOrder() {
        const request = () => {
            makeCreateOrderRequest({
                customerAddress: null,
                customerPersonalNumber: null,
                customerEmail: null,
                customerPhone: null,

                paymentType: null,
                paymentLoanDeposit: null,
                paymentLoanDuration: null,
                paymentResidualValue: null,

                insuranceExpectedDrivingDistance: null,
                insuranceAddOns: null,

                tradeInRegistrationNumber: null,
                tradeInMilage: null,
                tradeInCondition: null,
                tradeInComment: null,

                vehicleId: null,
                deliveryType: null
            }, (response: IOrderCreateResponse) => {
                this.saveResponse({
                    orderCreate: response
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