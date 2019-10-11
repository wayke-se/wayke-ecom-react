import React from 'react';

import { IEcomContext, IEcomLifecycle, IEcomStore, IEcomExternalProps } from '../types';
import StoreAction from '../constants/store-action';

import { PaymentType, IPaymentOption } from '@wayke-se/ecom';

import { formatPrice, formatPercentage } from '../utils/helpers';
import { addSizeQuery } from '../utils/image';
import { getPaymentMethodTitle } from '../utils/payment';
import UserEvent from '../constants/user-event';

export interface IPaymentMethodChooserProps extends IEcomExternalProps, IEcomContext, IEcomStore, IEcomLifecycle {
};

interface IPaymentMethodItemProps extends IEcomExternalProps, IEcomContext, IEcomStore, IEcomLifecycle {
    paymentOption: IPaymentOption;
};

const getUserEventFromPaymentType = (type: PaymentType): UserEvent | null => {
    switch (type) {
        case PaymentType.Cash:
            return UserEvent.PAYMENT_TYPE_CASH_CHOSEN;
        case PaymentType.Lease:
            return UserEvent.PAYMENT_TYPE_LEASING_CHOSEN;
        case PaymentType.Loan:
            //This is sent when the user has gone through the extra loan step.
            return null;
    }

    return null;
}

const PaymentMethodItem = (props: IPaymentMethodItemProps) => {
    const handlePaymentMethodClick = () => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'payment',
            name: 'paymentType',
            value: props.paymentOption.type
        }, () => {
            const userEvent = getUserEventFromPaymentType(props.paymentOption.type);
            const hasUserEvent = userEvent !== null;

            if (hasUserEvent) {
                props.onIncompleteUserEvent(userEvent);
            }
            props.onProceedToNextStep();
        });
    };

    const title = getPaymentMethodTitle(props.paymentOption.type);
    const scaledImage = addSizeQuery(props.paymentOption.logo!, 100, 60);

    const isLoan = props.paymentOption.type === PaymentType.Loan;

    var formattedPrice = null;
    var formattedInterest = null;

    if (isLoan) {
        const loanDetails = props.paymentOption.loanDetails;

        formattedPrice = formatPrice(loanDetails!.getCosts().monthlyCost);
        formattedInterest = formatPercentage(loanDetails!.getInterests().interest);
    } else {
        formattedPrice = formatPrice(props.paymentOption.price);
    }

    return (
        <li className="option-list-item">
            <button className="option-list-action" onClick={() => handlePaymentMethodClick()}>
                <div data-ecom-columnrow="">
                    <div className="column">
                        <div className="option-list-action-title">{title}<i className="icon-arrow-right m-l-half"></i></div>
                        <div className="option-list-action-subtitle">{props.paymentOption.name}</div>
                        <div className="option-list-action-meta">{formattedPrice} {props.paymentOption.unit} {formattedInterest !== null && <span className="text-dark-lighten">Ränta {formattedInterest}%</span>}</div>
                    </div>

                    { props.paymentOption.logo &&
                        <div className="column minimal">
                            <img src={scaledImage!} alt="logotype" className="l-block" />
                        </div>
                    }
                </div>
            </button>
        </li>
    );
}

const PaymentMethodChooser = (props: IPaymentMethodChooserProps) => {
    const items = props.orderOptions.getPaymentOptions().map((o, index) => <PaymentMethodItem key={index} paymentOption={o} {...props} />);

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Betalsätt</h1>
                <div data-ecom-content="">
                    <p>Hur vill du betala för din nya bil?</p>
                </div>
            </section>

            <section className="page-section">
                <div data-ecom-optionlist="">
                    <ul className="option-list">
                        {items}
                    </ul>
                </div>
            </section>

            <section className="page-section">
                <div data-ecom-alert="">
                    <div className="alert-icon-section">
                        <div className="alert-icon">
                            <i className="icon-info no-margin"></i>
                        </div>
                    </div>
                    <div className="alert-content">
                        Avtalsskrivning/betalning sker vid möte med handlaren
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PaymentMethodChooser;