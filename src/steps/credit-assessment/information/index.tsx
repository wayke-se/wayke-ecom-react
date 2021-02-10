/* eslint-disable no-console */
import React from "react";

import {
    IEcomContext,
    IEcomExternalProps,
    IEcomLifecycle,
    IEcomStore,
} from "../../../types";
import { getScaledLogoOfPaymentOption } from "../utils";

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

import Base from "./base";

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

    return getScaledLogoOfPaymentOption(choosenOption);
};

const CreditAssessmentInformationPresenter = (props: IProps) => {
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

    const [termsApproved, setTermsApproved] = React.useState(false);
    const [privacyApproved, setPrivacyApproved] = React.useState(false);

    const [hasError, setHasError] = React.useState(false);
    const [errorText, setErrorText] = React.useState("");

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

    const [creationTriggered, setCreationTriggered] = React.useState(false);

    React.useEffect(() => {
        if (props.hasCreditAssessmentError) {
            setHasError(true);
            setErrorText("Kunde inte skapa ärende. Kontrollera uppgifter");
        }
    }, [props.hasCreditAssessmentError]);

    React.useEffect(() => {
        const hasCase =
            !!props.creditAssessmentCase && !!props.creditAssessmentCase.caseId;
        if (creationTriggered && hasCase) {
            setCreationTriggered(false);
            props.onProceedToNextStep();
        } else if (hasCase && !creationTriggered) {
            props.declineCreditAssessmentCase(() => {});
        }
    }, [props.creditAssessmentCase]);

    const submit = () => {
        setHasError(false);
        setErrorText("");

        const allFieldsAreValid =
            phoneIsValid &&
            emailIsValid &&
            personalNumberIsValid &&
            incomeIsValid &&
            householdChildrenIsValid &&
            householdIncomeIsValid &&
            householdHousingCostIsValid &&
            householdDebtIsValid;

        if (!allFieldsAreValid) {
            setHasError(true);
            setErrorText("Information saknas eller är inkorrekt.");
            return;
        }

        const hasRequiredApprovals = termsApproved && privacyApproved;

        if (!hasRequiredApprovals) {
            setHasError(true);
            setErrorText(
                "För att gå vidare behöver villkoren och integritetspolicyn godkännas."
            );
            return;
        }

        props.createCreditAssessmentCase();
        setCreationTriggered(true);
    };

    return (
        <Base
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
            termsApproved={termsApproved}
            privacyApproved={privacyApproved}
            hasError={hasError}
            errorText={errorText}
            setTermsApproved={setTermsApproved}
            setPrivacyApproved={setPrivacyApproved}
            creatingCase={props.pendingCreateCreditAssessmentCase}
            submit={submit}
        />
    );
};

export default CreditAssessmentInformationPresenter;
