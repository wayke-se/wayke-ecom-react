/* eslint-disable no-console */
import React from "react";
import StoreAction from "../../constants/store-action";

import {
    IEcomContext,
    IEcomExternalProps,
    IEcomLifecycle,
    IEcomStore,
} from "../../types";
import { addSizeQuery } from "../../utils/image";
import {
    validatePhoneNumber,
    validateEmail,
    validatePersonalNumber,
} from "../../utils/validation";

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
    const [emailIsValid, setEmailIsValid] = React.useState(true);
    const [personalNumberIsValid, setPersonalNumberIsValid] = React.useState(
        true
    );

    const scaledLogo = getScaledLogo(props);

    const updateField = (name: string, value: string) =>
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "customer",
            name,
            value,
        });

    const updatePhone = (value: string) => updateField("phone", value);
    const validatePhoneValue = () => {
        const isValid = validatePhoneNumber(props.data.customer.phone);
        setPhoneIsValid(isValid);
    };
    const phone = {
        value: props.data.customer.phone,
        displayError: !phoneIsValid,
        onChange: updatePhone,
        deselect: validatePhoneValue,
    };

    const updateEmail = (value: string) => updateField("email", value);
    const validateEmailValue = () => {
        const isValid = validateEmail(props.data.customer.phone);
        setEmailIsValid(isValid);
    };
    const email = {
        value: props.data.customer.email,
        displayError: !emailIsValid,
        onChange: updateEmail,
        deselect: validateEmailValue,
    };

    const updatePersonalNumber = (value: string) =>
        updateField("personalNumber", value);
    const validatePersonalNumberValue = () => {
        const isValid = validatePersonalNumber(props.data.customer.phone);
        setPersonalNumberIsValid(isValid);
    };
    const personalNumber = {
        value: props.data.customer.personalNumber,
        displayError: !personalNumberIsValid,
        onChange: updatePersonalNumber,
        deselect: validatePersonalNumberValue,
    };

    const updateCivilStatus = (value: string) =>
        updateField("civilStatus", value);
    const civilStatus = {
        value: props.data.customer.civilStatus,
        onChange: updateCivilStatus,
    };

    const submit = () => {
        const allFieldsAreValid = phoneIsValid && emailIsValid;

        if (allFieldsAreValid) {
            console.log("All fields are valid. Create case...");
        } else {
            console.log("There are invalid fields");
        }
    };

    console.log(civilStatus);
    return (
        <View
            logoSrc={scaledLogo}
            phone={phone}
            email={email}
            personalNumber={personalNumber}
            civilStatus={civilStatus}
            submit={submit}
        />
    );
};

export default Presenter;
