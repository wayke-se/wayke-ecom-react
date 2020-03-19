import React from "react";

import { IEcomExternalProps } from "./types";
import EcomStore from "./ecom-store";

export default (props: IEcomExternalProps) => {
    return <EcomStore {...props} />;
};
