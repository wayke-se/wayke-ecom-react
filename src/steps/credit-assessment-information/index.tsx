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
    validateStringNumberInRange,
} from "../../utils/validation";
import createEmailField from "./fields/email";
import createPersonalNumberField from "./fields/personalNumber";
import createPhoneField from "./fields/phone";

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

const createHousholdHousingCostField = (
    props: IProps,
    isValid: boolean,
    setIsValid: (value: boolean) => void
) => {
    const update = (value: string) =>
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "householdEconomy",
            name: "householdHousingCost",
            value,
        });
    const validate = () => {
        const isValid = validateStringNumberInRange(
            props.data.householdEconomy.householdHousingCost,
            -999999999,
            999999999
        );
        setIsValid(isValid);
    };
    const householdHousingCost = {
        value: props.data.householdEconomy.householdHousingCost,
        displayError: !isValid,
        onChange: update,
        onFinish: validate,
    };
    return householdHousingCost;
};

const createHousholdDebtField = (
    props: IProps,
    isValid: boolean,
    setIsValid: (value: boolean) => void
) => {
    const update = (value: string) =>
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "householdEconomy",
            name: "householdDebt",
            value,
        });
    const validate = () => {
        const isValid = validateStringNumberInRange(
            props.data.householdEconomy.householdDebt,
            -999999999,
            999999999
        );
        setIsValid(isValid);
    };
    const field = {
        value: props.data.householdEconomy.householdDebt,
        displayError: !isValid,
        onChange: update,
        onFinish: validate,
    };
    return field;
};

const Presenter = (props: IProps) => {
    const [phoneIsValid, setPhoneIsValid] = React.useState(true);
    const [emailIsValid, setEmailIsValid] = React.useState(true);
    const [personalNumberIsValid, setPersonalNumberIsValid] = React.useState(
        true
    );
    const [incomeIsValid, setIncomeIsValid] = React.useState(true);
    const [
        householdChildrenIsValid,
        setHouseholdChildrenIsValid,
    ] = React.useState(true);
    const [householdIncomeIsValid, setHouseholdIncomeIsValid] = React.useState(
        true
    );
    const [
        householdHousingCostIsValid,
        setHouseholdHousingCostIsValid,
    ] = React.useState(true);
    const [householdDebtIsValid, setHouseholdDebtIsValid] = React.useState(
        true
    );

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

    const phone = createPhoneField(props, phoneIsValid, setPhoneIsValid);
    const email = createEmailField(props, emailIsValid, setEmailIsValid);
    const personalNumber = createPersonalNumberField(
        props,
        personalNumberIsValid,
        setPersonalNumberIsValid
    );

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

    const updateEmployment = (value: string) =>
        updateHouseholdEconomyField("employment", value);
    const employment = {
        value: props.data.householdEconomy.employment,
        onChange: updateEmployment,
    };

    const updateHouseholdChildren = (value: string) =>
        updateHouseholdEconomyField("householdChildren", value);
    const validateHouseholdChildrenValue = () => {
        const isValid = validateStringNumberInRange(
            props.data.householdEconomy.householdChildren,
            0,
            999
        );
        setHouseholdChildrenIsValid(isValid);
    };
    const householdChildren = {
        value: props.data.householdEconomy.householdChildren,
        displayError: !householdChildrenIsValid,
        onChange: updateHouseholdChildren,
        onFinish: validateHouseholdChildrenValue,
    };

    const updateHouseholdIncome = (value: string) =>
        updateHouseholdEconomyField("householdIncome", value);
    const validateHouseholdIncomeValue = () => {
        const isValid = validateStringNumberInRange(
            props.data.householdEconomy.householdIncome,
            -999999999,
            999999999
        );
        setHouseholdIncomeIsValid(isValid);
    };
    const householdIncome = {
        value: props.data.householdEconomy.householdIncome,
        displayError: !householdIncomeIsValid,
        onChange: updateHouseholdIncome,
        onFinish: validateHouseholdIncomeValue,
    };

    const householdHousingCost = createHousholdHousingCostField(
        props,
        householdHousingCostIsValid,
        setHouseholdHousingCostIsValid
    );
    const householdDebt = createHousholdDebtField(
        props,
        householdDebtIsValid,
        setHouseholdDebtIsValid
    );

    const submit = () => {
        const allFieldsAreValid = phoneIsValid && emailIsValid;

        if (allFieldsAreValid) {
            console.log("All fields are valid. Create case...");
        } else {
            console.log("There are invalid fields");
        }
    };

    return (
        <View
            logoSrc={scaledLogo}
            phone={phone}
            email={email}
            personalNumber={personalNumber}
            maritalStatus={maritalStatus}
            employment={employment}
            income={income}
            householdChildren={householdChildren}
            householdIncome={householdIncome}
            householdHousingCost={householdHousingCost}
            householdDebt={householdDebt}
            submit={submit}
        />
    );
};

export default Presenter;
