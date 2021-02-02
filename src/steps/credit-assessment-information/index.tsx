import React from "react";
import StoreAction from "../../constants/store-action";

import {
    IEcomContext,
    IEcomExternalProps,
    IEcomLifecycle,
    IEcomStore,
} from "../../types";
import { addSizeQuery } from "../../utils/image";
import { validatePhoneNumber } from "../../utils/validation";

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
    const [phoneIsValid, setPhoneIsValid] = React.useState(true);

    const scaledLogo = getScaledLogo(props);

    const updatePhone = (value: string) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "customer",
            name: "phone",
            value,
        });
    };
    const deselectPhoneInput = () => {
        const isValid = validatePhoneNumber(props.data.customer.phone);
        setPhoneIsValid(isValid);
    };
    const phone = {
        value: props.data.customer.phone,
        displayError: !phoneIsValid,
        onChange: updatePhone,
        deselect: deselectPhoneInput,
    };

    return <View logoSrc={scaledLogo} phone={phone} />;
};

export default Presenter;
