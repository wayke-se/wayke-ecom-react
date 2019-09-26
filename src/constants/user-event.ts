enum UserEvent {
    TRADE_IN_DEFINED,
    TRADE_IN_SKIPPED,

    PAYMENT_TYPE_CASH_CHOSEN,
    PAYMENT_TYPE_LEASING_CHOSEN,
    PAYMENT_TYPE_LOAN_CHOSEN,

    INSURANCE_ADDED,
    INSURANCE_SKIPPED,

    CUSTOMER_DETAILS_AUTOMATIC_CHOSEN,
    CUSTOMER_DETAILS_MANUAL_CHOSEN,

    ORDER_CREATED,
    ORDER_CANCELLED,

    BACK_BUTTON_CLICKED,
};

export default UserEvent;