import React from "react";

import { IVehicle } from "./types";
import EcomStore from './ecom-store';
import { getInitialData } from "./sdk/ecom-sdk-actions";

export interface IEcomProps {
    vehicle: IVehicle;
}

interface IState {
    options: {
        isTradeInAllowed: boolean;
    };
};

class Ecom extends React.Component<IEcomProps, IState> {
    constructor(props: IEcomProps) {
        super(props);

        this.state = {
            options: null
        };
    }

    componentDidMount() {
        getInitialData(this.props.vehicle.id, (response) => {
            this.setState({
                options: {
                    isTradeInAllowed: !response.allowsTradeIn()
                }
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