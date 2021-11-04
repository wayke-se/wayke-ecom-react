enum EcomStep {
    DEALER_CHOOSER,

    TRADE_IN_EXISTS_CHOOSER,
    TRADE_IN_CAR_DEFINITION,
    TRADE_IN_CAR_CONDITION,
    TRADE_IN_CONFIRM_CAR,

    PAYMENT_METHOD_CHOOSER,
    PAYMENT_FINANCING_DETAILS,

    BANKID_AUTHENTICATION,
    CUSTOMER_INFORMATION_INITIAL,
    CUSTOMER_INFORMATION_DETAILS,
    CREDIT_ASSESSMENT_INFORMATION,
    CREDIT_ASSESSMENT_SIGNING,
    CREDIT_ASSESSED,

    INSURANCE_INFORMATION_DEFINITION,
    INSURANCE_ALTERNATIVE_CHOOSER,

    DELIVERY_METHOD,

    ACCESSORIES,

    FINAL_SUMMARY,
    FINAL_CONFIRMATION,
}

export default EcomStep;
