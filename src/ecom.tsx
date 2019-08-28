import React from "react";

import { IVehicle } from "./types";
import EcomStore from './ecom-store';
import { getInitialData, getInsuranceOptions, getVehicleLookup } from "./sdk/ecom-sdk-actions";
import { IOrderOptionsResponse, IInsuranceOptionsResponse, IVehicleLookupResponse } from "wayke-ecom";
import { IPaymentOption } from "wayke-ecom/dist-types/orders/types";

export interface IEcomProps {
    vehicle: IVehicle;
}

interface IState {
    orderOptions: IOrderOptionsResponse;
    insuranceOptions: IInsuranceOptionsResponse;
    vehicleLookup: IVehicleLookupResponse;
};

class Ecom extends React.Component<IEcomProps, IState> {
    constructor(props: IEcomProps) {
        super(props);

        this.handleFetchInsuranceOptions = this.handleFetchInsuranceOptions.bind(this);

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

    handleFetchInsuranceOptions(
            personalNumber: string,
            vehicleId: string,
            paymentOption: IPaymentOption,
            drivingDistance: number,
            callback: () => void
    ) {
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

    handleFetchVehicleInformation(registrationNumber: string, callback: () => void) {
        getVehicleLookup(registrationNumber, (response: IVehicleLookupResponse) => {
            this.setState({
                vehicleLookup: response,
            }, callback);
        });
    }

    render() {
        return (
            <EcomStore onFetchInsuranceOptions={this.handleFetchInsuranceOptions} {...this.state} {...this.props} />
        );
    }
};

export default Ecom;