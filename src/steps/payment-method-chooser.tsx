import React from 'react';

import { IEcomLifecycle, IEcomStore } from '../types';
import StoreAction from '../enums/store-action';
import { IOrderOptionsResponse, PaymentType } from 'wayke-ecom';
import { IPaymentOption } from 'wayke-ecom/dist-types/orders/types';
import { numberSeparator } from '../utils/helpers';

export interface IPaymentMethodChooserProps extends IEcomStore, IEcomLifecycle {
    options: IOrderOptionsResponse;
};

interface IPaymentMethodItemProps extends IEcomStore, IEcomLifecycle {
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
    const interest = props.paymentOption.loanDetails ? props.paymentOption.loanDetails.interest : null;

    const price = numberSeparator(props.paymentOption.price);

    return (
        <li className="option-list-item">
            <button className="option-list-action" onClick={() => handlePaymentMethodClick()}>
                <div data-am-columnrow="">
                    <div className="column">
                        <div className="option-list-action-title">{title}</div>
                        <div className="option-list-action-subtitle">{props.paymentOption.name}</div>
                        <div className="option-list-action-meta">{price} {props.paymentOption.unit} {interest !== null && <span className="text-dark-lighten">Ränta {interest} %</span>}</div>
                    </div>

                    { props.paymentOption.logo &&
                        <div className="column valign-top minimal">
                            <img src={props.paymentOption.logo} alt="Audi logotype" className="l-block" />
                        </div>
                    }
                </div>
            </button>
        </li>
    );
}

const PaymentMethodChooser = (props: IPaymentMethodChooserProps) => {
    const items = props.options.getPaymentOptions().map((o, index) => <PaymentMethodItem key={index} paymentOption={o} {...props} />);

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Betalsätt</h1>
                <div data-am-content="">
                    <p>Hur vill du betala för din Audi A6 AVANT?</p>
                </div>
            </section>

            <section className="page-section">
                <div data-am-optionlist="">
                    <ul className="option-list">
                        {items}
                    </ul>
                </div>
            </section>

            <section className="page-section">
                <div data-am-alert="">
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