import React from "react";

import {
    IEcomContext,
    IEcomLifecycle,
    IEcomStore,
    IEcomExternalProps,
} from "../types";
import StoreAction from "../constants/store-action";

import { PaymentType, IPaymentOption } from "@wayke-se/ecom";

import UserEvent from "../constants/user-event";

import { formatPrice, formatPercentage } from "../utils/helpers";
import { addSizeQuery } from "../utils/image";
import { getPaymentMethodTitle } from "../utils/payment";
import { PaymentLookupResponse } from "@wayke-se/ecom/dist-types/payments/payment-lookup-response";

interface IPaymentMethodItemProps
    extends IEcomExternalProps,
        IEcomContext,
        IEcomStore,
        IEcomLifecycle {
    paymentOption: IPaymentOption;
}

const getUserEventFromPaymentType = (type: PaymentType): UserEvent | null => {
    switch (type) {
        case PaymentType.Cash:
            return UserEvent.PAYMENT_TYPE_CASH_CHOSEN;
        case PaymentType.Lease:
            return UserEvent.PAYMENT_TYPE_LEASING_CHOSEN;
        case PaymentType.Loan:
            // This is sent when the user has gone through the extra loan step.
            return null;
    }
};

const createLoanExplanation = (loanDetails: PaymentLookupResponse) => {
    const formattedInterest = formatPercentage(
        loanDetails!.getInterests().interest
    );
    const formattedLoanAmount = formatPrice(loanDetails!.getCreditAmount());
    const duration = loanDetails.getDurationSpec().current;
    const loanExplanation = `* Beräknat på ${formattedLoanAmount} kr, ${duration} mån, ${formattedInterest}%.`;
    return loanExplanation;
};

export default (props: IPaymentMethodItemProps) => {
    const handlePaymentMethodClick = () => {
        props.dispatchStoreAction(
            StoreAction.UPDATE_NAMED_VALUE,
            {
                type: "payment",
                name: "externalId",
                value: props.paymentOption.externalId,
            },
            () => {
                const financialProductCode =
                    props.paymentOption.type === PaymentType.Loan
                        ? props.paymentOption.loanDetails.getFinancialProductCode()
                        : "";
                props.dispatchStoreAction(
                    StoreAction.UPDATE_NAMED_VALUE,
                    {
                        type: "payment",
                        name: "financialProductCode",
                        value: financialProductCode,
                    },
                    () => {
                        props.dispatchStoreAction(
                            StoreAction.UPDATE_NAMED_VALUE,
                            {
                                type: "payment",
                                name: "paymentType",
                                value: props.paymentOption.type,
                            },
                            () => {
                                const userEvent = getUserEventFromPaymentType(
                                    props.paymentOption.type
                                );
                                const hasUserEvent = userEvent !== null;

                                if (hasUserEvent) {
                                    props.onIncompleteUserEvent(userEvent);
                                }
                                props.onProceedToNextStep();
                            }
                        );
                    }
                );
            }
        );
    };

    const title = getPaymentMethodTitle(props.paymentOption.type);
    const scaledImage = addSizeQuery(props.paymentOption.logo!, 100, 60);

    const isLoan = props.paymentOption.type === PaymentType.Loan;

    let formattedPrice = null;
    let loanExplanation = null;

    if (isLoan) {
        const loanDetails = props.paymentOption.loanDetails;
        formattedPrice = formatPrice(loanDetails!.getCosts().monthlyCost);
        loanExplanation = createLoanExplanation(loanDetails);
    } else {
        formattedPrice = formatPrice(props.paymentOption.price);
    }

    return (
        <li className="option-list-item">
            <button
                className="option-list-action"
                onClick={handlePaymentMethodClick}
            >
                <div data-ecom-columnrow="">
                    <div className="column">
                        <div className="option-list-action-title">
                            {title}
                            <i className="icon-arrow-right m-l-half" />
                        </div>
                        <div className="option-list-action-subtitle">
                            {props.paymentOption.name}
                        </div>
                        <div className="option-list-action-meta">
                            {formattedPrice} {props.paymentOption.unit}{" "}
                        </div>
                        {!!loanExplanation && (
                            <div className="option-list-action-meta">
                                <span className="text-dark-lighten">
                                    {loanExplanation}
                                </span>
                            </div>
                        )}
                    </div>

                    {props.paymentOption.logo && (
                        <div className="column minimal">
                            <img
                                src={scaledImage!}
                                alt="logotype"
                                className="l-block"
                                style={{ maxWidth: "100px", maxHeight: "60px" }}
                            />
                        </div>
                    )}
                </div>
            </button>
        </li>
    );
};
