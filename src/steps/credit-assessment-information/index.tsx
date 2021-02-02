import React from "react";

import {
    IEcomContext,
    IEcomExternalProps,
    IEcomLifecycle,
    IEcomStore,
} from "../../types";
import { addSizeQuery } from "../../utils/image";

import View from "./view";

interface IProps
    extends IEcomContext,
        IEcomStore,
        IEcomLifecycle,
        IEcomExternalProps {}

const getScaledLogo = (props: IProps) => {
    const paymentType = props.data.payment.paymentType;
    const paymentOptions = props.orderOptions.getPaymentOptions();
    const choosenOption = paymentOptions.find(
        (option) => option.type === paymentType
    );

    const logo = choosenOption.logo;
    const scaledLogo = addSizeQuery(logo, 100, 60);
    return scaledLogo;
};

const Presenter = (props: IProps) => {
    const scaledLogo = getScaledLogo(props);

    return <View logoSrc={scaledLogo} />;
};

export default Presenter;
