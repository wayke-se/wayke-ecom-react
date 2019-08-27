import React from 'react';

import PaymentMethod from '../enums/payment-method';
import { IEcomLifecycle, IEcomStore } from '../types';
import StoreAction from '../enums/store-action';

export interface IPaymentMethodChooserProps extends IEcomStore, IEcomLifecycle {
};

const PaymentMethodChooser = (props: IPaymentMethodChooserProps) => {
    const handlePaymentMethodClick = (method: PaymentMethod) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'payment',
            name: 'method',
            value: method
        }, () => {
            props.onNextStepClick();
        });
    };

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
                        <li className="option-list-item">
                            <button className="option-list-action" onClick={() => handlePaymentMethodClick(PaymentMethod.CASH)}>
                                <div className="option-list-action-title">Kontant</div>
                                <div className="option-list-action-meta">229 000 kr</div>
                            </button>
                        </li>
                        <li className="option-list-item">
                            <button className="option-list-action" onClick={() => handlePaymentMethodClick(PaymentMethod.FINANCING)}>
                                <div data-ecom-columnrow="">
                                    <div className="column">
                                        <div className="option-list-action-title">Finansiering</div>
                                        <div className="option-list-action-subtitle">Audi financial services</div>
                                        <div className="option-list-action-meta">5 700 kr/mån <span className="text-dark-lighten">(Ränta 4,9 %)</span></div>
                                    </div>

                                    <div className="column valign-top minimal">
                                        <img src="images/audi-logo.png" alt="Audi logotype" className="l-block" />
                                    </div>
                                </div>
                            </button>
                        </li>
                        <li className="option-list-item">
                            <button className="option-list-action" onClick={() => handlePaymentMethodClick(PaymentMethod.LEASING)}>
                                <div className="option-list-action-title">Privatleasing</div>
                                <div className="option-list-action-meta">4 700 kr/mån</div>
                            </button>
                        </li>
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