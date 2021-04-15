/* eslint-disable no-console */
import React from "react";

import {
    IEcomContext,
    IEcomExternalProps,
    IEcomLifecycle,
    IEcomStore,
} from "../../../types";
import { getScaledLogoOfPaymentOption } from "../utils/index";

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
import { getLoanDetails } from "../../../utils/payment";
import { formatPrice } from "../../../utils/helpers";
import { getRetailerInformation } from "../../../utils/retailer";

interface IProps
    extends IEcomContext,
        IEcomStore,
        IEcomLifecycle,
        IEcomExternalProps {}

const getSelectedPaymentOption = (props: IProps) => {
    const paymentType = props.data.payment.paymentType;
    const paymentOptions = props.orderOptions.getPaymentOptions();
    const selectedOption = paymentOptions.find(
        (option) => option.type === paymentType
    );

    return selectedOption;
};

const getFinancialProvider = (props: IProps) => {
    const selectedOption = getSelectedPaymentOption(props);
    return selectedOption.name;
};

const getScaledLogo = (props: IProps) => {
    const selectedOption = getSelectedPaymentOption(props);
    return getScaledLogoOfPaymentOption(selectedOption);
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

    const [hasError, setHasError] = React.useState(false);
    const [errorText, setErrorText] = React.useState("");

    const [creationTriggered, setCreationTriggered] = React.useState(false);

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

    const loanDetails = getLoanDetails(props.orderOptions, props.paymentLookup);

    const formattedCreditAmount = formatPrice(loanDetails.getCreditAmount());
    const financialProvider = getFinancialProvider(props);
    const hasPrivacyPolicy = loanDetails.hasPrivacyPolicy();
    const privacyPolicyUrl = loanDetails.getPrivacyPolicyUrl();

    const retailerName = getRetailerInformation(props.orderOptions).name;

    React.useEffect(() => {
        if (props.hasCreditAssessmentError) {
            setHasError(true);
            const vehicleUnavailable = props.vehicleUnavailable;
            const errorText = vehicleUnavailable
                ? "Bilen är såld"
                : "Kunde inte skapa ärende. Kontrollera uppgifter";
            setErrorText(errorText);
        } else {
            setHasError(false);
            setErrorText("");
        }
    }, [props.hasCreditAssessmentError, props.vehicleUnavailable]);

    React.useEffect(() => {
        const hasCase =
            !!props.creditAssessmentCase && !!props.creditAssessmentCase.caseId;
        if (creationTriggered && hasCase) {
            setCreationTriggered(false);
            props.onProceedToNextStep();
        } else if (hasCase && !creationTriggered) {
            props.declineCreditAssessmentCase();
        }
    }, [props.creditAssessmentCase]);

    const submit = () => {
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
            hasError={hasError}
            errorText={errorText}
            creatingCase={props.pendingCreateCreditAssessmentCase}
            formattedCreditAmount={formattedCreditAmount}
            financialProvider={financialProvider}
            hasPrivacyPolicy={hasPrivacyPolicy}
            privacyPolicyUrl={privacyPolicyUrl}
            retailerName={retailerName}
            submit={submit}
        />
    );
};

export default CreditAssessmentInformationPresenter;
