import React from "react";

import { IVehicle } from "./types";
import EcomStore from './ecom-store';
import { getInitialData } from "./sdk/ecom-sdk-actions";
import { IOrderOptionsResponse } from "wayke-ecom";

export interface IEcomProps {
    vehicle: IVehicle;
}

interface IState {
    options: IOrderOptionsResponse | undefined;
};

class Ecom extends React.Component<IEcomProps, IState> {
    constructor(props: IEcomProps) {
        super(props);

        this.state = {
            options: undefined
        };
    }

    componentDidMount() {
        getInitialData(this.props.vehicle.id, (response: IOrderOptionsResponse) => {
            this.setState({
                options: response
            });
        });
    }

    render() {
        return (
            <EcomStore {...this.state} {...this.props} />
        );
    }
};

export default Ecom;