/* eslint-disable no-console */
import React from "react";

import {
    IEcomContext,
    IEcomExternalProps,
    IEcomLifecycle,
    IEcomStore,
} from "../../types";
import { addSizeQuery } from "../../utils/image";

import createEmploymentField from "./fields/employment";
import createEmailField from "./fields/email";
import createMaritalStatusField from "./fields/maritalStatus";
import createPersonalNumberField from "./fields/personalNumber";
import createPhoneField from "./fields/phone";
import createIncomeField from "./fields/income";
import createHouseholdChildrenField from "./fields/householdChildren";
import createHouseholdIncomeField from "./fields/householdIncome";
import createHouseholdHousingCostField from "./fields/householdHousingCost";
import createHouseholdDebtField from "./fields/householdDebt";

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

    const phone = createPhoneField(props, phoneIsValid, setPhoneIsValid);
    const email = createEmailField(props, emailIsValid, setEmailIsValid);
    const personalNumber = createPersonalNumberField(
        props,
        personalNumberIsValid,
        setPersonalNumberIsValid
    );
    const maritalStatus = createMaritalStatusField(props);
    const employment = createEmploymentField(props);
    const income = createIncomeField(props, incomeIsValid, setIncomeIsValid);
    const householdChildren = createHouseholdChildrenField(
        props,
        householdChildrenIsValid,
        setHouseholdChildrenIsValid
    );
    const householdIncome = createHouseholdIncomeField(
        props,
        householdIncomeIsValid,
        setHouseholdIncomeIsValid
    );
    const householdHousingCost = createHouseholdHousingCostField(
        props,
        householdHousingCostIsValid,
        setHouseholdHousingCostIsValid
    );
    const householdDebt = createHouseholdDebtField(
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
