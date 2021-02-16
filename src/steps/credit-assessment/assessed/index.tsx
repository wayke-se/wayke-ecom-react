import React from "react";
import { IEcomContext, IEcomLifecycle, IEcomStore } from "../../../types";
import Formatter from "./formatter";
import { getLoanDetails } from "../../../utils/payment";
import { getScaledLogoOfPaymentOption } from "../utils";

import Base from "./base";
import { CreditAssessmentResult } from "./types";
import resolveResult from "./result-resolver";

interface IProps extends IEcomLifecycle, IEcomContext, IEcomStore {}

const getPaymentOption = (props: IProps) => {
    const paymentType = props.data.payment.paymentType;
    const paymentOptions = props.orderOptions.getPaymentOptions();
    const choosenOption = paymentOptions.find(
        (option) => option.type === paymentType
    );

    return choosenOption;
};

const CreditAssessedPresenter = (props: IProps) => {
    const {
        orderOptions,
        paymentLookup,
        creditAssessmentStatus,
        onProceedToNextStep,
    } = props;

    const paymentOption = getPaymentOption(props);
    const logoSrc =
        !!paymentOption && getScaledLogoOfPaymentOption(paymentOption);

    const loanDetails = getLoanDetails(orderOptions, paymentLookup);
    const formatter = new Formatter(loanDetails);

    const downPayment = formatter.getDownPayment();
    const monthlyCost = formatter.getMonthlyCost();
    const interest = formatter.getInterest();
    const effectiveInterest = formatter.getEffectiveInterest();
    const duration = formatter.getDuration();

    const result = resolveResult(
        creditAssessmentStatus.getDecision(),
        creditAssessmentStatus.getRecommendation()
    );
    let buttonLabel = "Gå vidare";
    let onButtonClick = onProceedToNextStep;
    if (result === CreditAssessmentResult.Reject) {
        buttonLabel = "Byt betalsätt";
        onButtonClick = () => {};
    }

    return (
        <Base
            financialInstitutionName={paymentOption.name}
            logoSrc={logoSrc}
            downPayment={downPayment}
            monthlyCost={monthlyCost}
            duration={duration}
            interest={interest}
            effectiveInterest={effectiveInterest}
            result={result}
            buttonLabel={buttonLabel}
            onButtonClick={onButtonClick}
        />
    );
};

export default CreditAssessedPresenter;
