import React from "react";

import { IVehicle } from "./types";
import EcomStore from './ecom-store';
import { getInitialData, getInsuranceAlternatives } from "./sdk/ecom-sdk-actions";
import { IOrderOptionsResponse, IInsuranceOptionsResponse } from "wayke-ecom";
import { IPaymentOption } from "wayke-ecom/dist-types/orders/types";

export interface IEcomProps {
    vehicle: IVehicle;
}

interface IState {
    orderOptions: IOrderOptionsResponse;
    insuranceOptions: IInsuranceOptionsResponse;
};

class Ecom extends React.Component<IEcomProps, IState> {
    constructor(props: IEcomProps) {
        super(props);

        this.handleFetchInsuranceAlternatives = this.handleFetchInsuranceAlternatives.bind(this);

        this.state = {
            orderOptions: null,
            insuranceOptions: null
        };
    }

    componentDidMount() {
        getInitialData(this.props.vehicle.id, (response: IOrderOptionsResponse) => {
            this.setState({
                orderOptions: response
            });
        });
    }

    handleFetchInsuranceAlternatives(
            personalNumber: string,
            vehicleId: string,
            paymentOption: IPaymentOption,
            drivingDistance: number,
            callback: () => void
    ) {
        getInsuranceAlternatives(
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

    render() {
        return (
            <EcomStore onFetchInsuranceAlternatives={this.handleFetchInsuranceAlternatives} {...this.state} {...this.props} />
        );
    }
};

export default Ecom;