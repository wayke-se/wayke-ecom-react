import React from "react";

import { IEcomExternalProps, ILoanSpecification } from "./types";
import EcomStore from './ecom-store';

import createLoanSpecification from './constants/loan-specification';
import { initialize } from './tools/data-validation';

interface IState {
    loanSpecification: ILoanSpecification;
};

class Ecom extends React.Component<IEcomExternalProps, IState> {
    constructor(props: IEcomExternalProps) {
        super(props);

        const loanSpecification = createLoanSpecification(props.vehicle.price);
        initialize(loanSpecification);

        this.state = {
            loanSpecification
        }
    }

    render() {
        return <EcomStore {...this.props} {...this.state} />;
    }
};

export default Ecom;