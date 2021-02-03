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
    validateStringNumberInRange,
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
    const [incomeIsValid, setIncomeIsValid] = React.useState(true);

    const scaledLogo = getScaledLogo(props);

    const updateCustomerField = (name: string, value: string) =>
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "customer",
            name,
            value,
        });
    const updateHouseholdEconomyField = (name: string, value: string) =>
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "householdEconomy",
            name,
            value,
        });

    const updatePhone = (value: string) => updateCustomerField("phone", value);
    const validatePhoneValue = () => {
        const isValid = validatePhoneNumber(props.data.customer.phone);
        setPhoneIsValid(isValid);
    };
    const phone = {
        value: props.data.customer.phone,
        displayError: !phoneIsValid,
        onChange: updatePhone,
        onFinish: validatePhoneValue,
    };

    const updateEmail = (value: string) => updateCustomerField("email", value);
    const validateEmailValue = () => {
        const isValid = validateEmail(props.data.customer.phone);
        setEmailIsValid(isValid);
    };
    const email = {
        value: props.data.customer.email,
        displayError: !emailIsValid,
        onChange: updateEmail,
        onFinish: validateEmailValue,
    };

    const updatePersonalNumber = (value: string) =>
        updateCustomerField("personalNumber", value);
    const validatePersonalNumberValue = () => {
        const isValid = validatePersonalNumber(props.data.customer.phone);
        setPersonalNumberIsValid(isValid);
    };
    const personalNumber = {
        value: props.data.customer.personalNumber,
        displayError: !personalNumberIsValid,
        onChange: updatePersonalNumber,
        onFinish: validatePersonalNumberValue,
    };

    const updateMaritalStatus = (value: string) =>
        updateHouseholdEconomyField("maritalStatus", value);
    const maritalStatus = {
        value: props.data.householdEconomy.maritalStatus,
        onChange: updateMaritalStatus,
    };

    const updateIncome = (value: string) =>
        updateHouseholdEconomyField("income", value);
    const validateIncomeValue = () => {
        const isValid = validateStringNumberInRange(
            props.data.householdEconomy.income,
            -999999999,
            999999999
        );
        setIncomeIsValid(isValid);
    };
    const income = {
        value: props.data.householdEconomy.income,
        displayError: !incomeIsValid,
        onChange: updateIncome,
        onFinish: validateIncomeValue,
    };

    const submit = () => {
        const allFieldsAreValid = phoneIsValid && emailIsValid;

        if (allFieldsAreValid) {
            console.log("All fields are valid. Create case...");
        } else {
            console.log("There are invalid fields");
        }
    };

    console.log(maritalStatus);
    return (
        <View
            logoSrc={scaledLogo}
            phone={phone}
            email={email}
            personalNumber={personalNumber}
            maritalStatus={maritalStatus}
            income={income}
            submit={submit}
        />
    );
};

export default Presenter;
