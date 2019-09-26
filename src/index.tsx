import React from "react";

import { IEcomExternalProps } from "./types";
import EcomStore from './ecom-store';

import '../styles/default.css';

const Ecom = (props: IEcomExternalProps) => {
    return <EcomStore {...props} />;
}

export default Ecom;