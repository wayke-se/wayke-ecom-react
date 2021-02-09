import React from "react";
import { IEcomContext, IEcomLifecycle, IEcomStore } from "../../../types";
import { formatPercentage, formatPrice } from "../../../utils/helpers";
import { getLoanDetails } from "../../../utils/payment";
import { getScaledLogoOfPaymentOption } from "../utils";

import Base from "./base";

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

    const loanDetails = getLoanDetails(orderOptions, paymentLookup);

    const paymentOption = getPaymentOption(props);
    const logoSrc = getScaledLogoOfPaymentOption(paymentOption);

    const formattedDownPayment = formatPrice(
        loanDetails.getDownPaymentSpec().current
    );
    const formattedMonthlyCost = formatPrice(
        loanDetails.getCosts().monthlyCost
    );
    const formattedInterest = formatPercentage(
        loanDetails.getInterests().interest
    );
    const formattedEffectiveInterest = formatPercentage(
        loanDetails.getInterests().effectiveInterest
    );
    // Add duration.

    return (
        <Base
            financialInstitutionName={paymentOption.name}
            logoSrc={logoSrc}
            downPayment={formattedDownPayment}
            monthlyCost={formattedMonthlyCost}
            interest={formattedInterest}
            effectiveInterest={formattedEffectiveInterest}
            decision={creditAssessmentStatus.getDecision()}
            onProceed={onProceedToNextStep}
        />
    );
};

export default CreditAssessedPresenter;
