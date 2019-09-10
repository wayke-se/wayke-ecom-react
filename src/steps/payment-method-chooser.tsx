import React from 'react';

import { IEcomContext, IEcomLifecycle, IEcomStore, IEcomExternalProps } from '../types';
import StoreAction from '../constants/store-action';

import { PaymentType, IPaymentOption } from '@wayke-se/ecom';

import { formatPrice, formatPercentage } from '../utils/helpers';
import { addSizeQuery } from '../utils/image';
import { getPaymentMethodTitle } from '../utils/payment';

export interface IPaymentMethodChooserProps extends IEcomExternalProps, IEcomContext, IEcomStore, IEcomLifecycle {
};

interface IPaymentMethodItemProps extends IEcomExternalProps, IEcomContext, IEcomStore, IEcomLifecycle {
    paymentOption: IPaymentOption;
};

const PaymentMethodItem = (props: IPaymentMethodItemProps) => {
    const handlePaymentMethodClick = () => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'payment',
            name: 'paymentType',
            value: props.paymentOption.type
        }, () => {
            props.onProceedToNextStep();
        });
    };

    const title = getPaymentMethodTitle(props.paymentOption.type);
    const scaledImage = addSizeQuery(props.paymentOption.logo!, 100, 60);

    const isLoan = props.paymentOption.type === PaymentType.Loan;

    var formattedPrice: string | number | null | undefined = null;
    var formattedInterest: number | null = null;

    if (isLoan) {
        const loanDetails = props.paymentOption.loanDetails;

        formattedPrice = formatPrice(loanDetails!.getCosts().monthlyCost);
        formattedInterest = formatPercentage(loanDetails!.getInterests().interest);
    } else {
        formattedPrice = props.paymentOption.price;
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
                        <div className="column valign-top minimal">
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
                    <p>Hur vill du betala för din {props.vehicle.title}?</p>
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