import React from 'react';

import { IEcomContext, IEcomLifecycle, IEcomStore } from '../types';
import StoreAction from '../enums/store-action';

import { PaymentType } from 'wayke-ecom';
import { IPaymentOption } from 'wayke-ecom/dist-types/orders/types';

import { formatPrice } from '../utils/helpers';
import { addSizeQuery } from '../utils/image';
import { getLoanInformation, getDefaultDuration, getDefaultDeposit } from '../utils/loan';

export interface IPaymentMethodChooserProps extends IEcomContext, IEcomStore, IEcomLifecycle {
};

interface IPaymentMethodItemProps extends IEcomContext, IEcomStore, IEcomLifecycle {
    paymentOption: IPaymentOption;
};

const getPaymentMethodTitle = (type: PaymentType) => {
    switch(type) {
        case PaymentType.Lease:
            return 'Privatleasing';
        case PaymentType.Loan:
            return 'Financiering';
        case PaymentType.Cash:
            return 'Kontant';
        default:
            return '';
    }
}

const PaymentMethodItem = (props: IPaymentMethodItemProps) => {
    const handlePaymentMethodClick = () => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'payment',
            name: 'paymentOption',
            value: props.paymentOption
        }, () => {
            props.onNextStepClick();
        });
    };

    const title = getPaymentMethodTitle(props.paymentOption.type);
    const scaledImage = addSizeQuery(props.paymentOption.logo, 100, 60);

    const isLoan = props.paymentOption.type === PaymentType.Loan;

    var formattedPrice = null;
    var formattedInterest = null;

    if (isLoan) {
        const duration = getDefaultDuration();
        const deposit = getDefaultDeposit(props.vehicle.price);

        const loanDetails = props.paymentOption.loanDetails;
        const loanInformation = getLoanInformation(props.vehicle.price, duration, deposit, loanDetails.interest, loanDetails.administrationFee, loanDetails.setupFee);

        formattedPrice = formatPrice(loanInformation.monthlyCost);
        formattedInterest = formatPrice(loanInformation.interest);
    } else {
        formattedPrice = props.paymentOption.price;
    }

    return (
        <li className="option-list-item">
            <button className="option-list-action" onClick={() => handlePaymentMethodClick()}>
                <div data-ecom-columnrow="">
                    <div className="column">
                        <div className="option-list-action-title">{title}</div>
                        <div className="option-list-action-subtitle">{props.paymentOption.name}</div>
                        <div className="option-list-action-meta">{formattedPrice} {props.paymentOption.unit} {formattedInterest !== null && <span className="text-dark-lighten">Ränta {formattedInterest}%</span>}</div>
                    </div>

                    { props.paymentOption.logo &&
                        <div className="column valign-top minimal">
                            <img src={scaledImage} alt="logotype" className="l-block" />
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
                    <p>Hur vill du betala för din Audi A6 AVANT?</p>
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