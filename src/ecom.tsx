import React from "react";

import { IVehicle } from "./types";
import EcomStore from './ecom-store';

export interface IEcomProps {
    vehicle: IVehicle;
}

const Ecom = (props: IEcomProps) => {
    return (
        <EcomStore {...props} />
    );
};

export default Ecom;