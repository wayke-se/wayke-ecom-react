import React from 'react';

import { IEcomLifecycle, IEcomStore } from '../types';
import OrderSummary from '../components/order-summary';
import CustomerInformationSummary from '../components/customer-information-summary';

interface IConfirmOrderProps extends IEcomStore, IEcomLifecycle {
}

const ConfirmOrder = (props: IConfirmOrderProps) => {
    return (
        <div data-ecom-page="">
            <section className="page-section">
                <h1 className="h6">Godkänn ditt köp</h1>
                <div data-ecom-content="">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
            </section>

            <section className="page-section page-section-accent">
                <div className="page-section-accent-content">
                    <h2 className="h6">Din order</h2>
                </div>

                <OrderSummary {...props} />
            </section>

            <section className="page-section">
                <h2 className="h6">Kunduppgifter</h2>

                <CustomerInformationSummary {...props} />;
            </section>

            <section className="page-section">
                <h2 className="h6">Lorem ipsum?</h2>
                <div data-ecom-content="">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                </div>
            </section>

            <section className="page-section page-section-bottom">
                <div data-ecom-buttonnav="">
                    <div className="button-nav-item">
                        <div data-ecom-button="full-width" onClick={props.onNextStepClick}>
                            Genomför köp
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ConfirmOrder;