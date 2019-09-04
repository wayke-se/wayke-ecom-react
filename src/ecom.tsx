import React from "react";

import { IEcomExternalProps } from "./types";
import EcomStore from './ecom-store';

const Ecom = (props: IEcomExternalProps) => {
    return <EcomStore {...props} />;
}

export default Ecom;