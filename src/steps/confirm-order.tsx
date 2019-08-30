import React from 'react';

import { IEcomLifecycle, IEcomStore, IEcomContext, IEcomExternalProps } from '../types';
import OrderSummary from '../components/order-summary';
import CustomerInformationSummary from '../components/customer-information-summary';

interface IConfirmOrderProps extends IEcomExternalProps, IEcomContext, IEcomStore, IEcomLifecycle {
}

const ConfirmOrder = (props: IConfirmOrderProps) => {
    const handleCreateOrderClick = () => {
        props.onProceedToNextStep();
    }

    return (
        <div data-ecom-page="">
            <section className="page-section">
                <h1 className="h6">Godkänn ditt köp</h1>
                <div data-ecom-content="">
                    <p>Titta igenom all information så att det stämmer innan du genomför köpet.</p>
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

                <CustomerInformationSummary {...props} />
            </section>

            <section className="page-section page-section-bottom">
                <div data-ecom-buttonnav="">
                    <div className="button-nav-item">
                        <div data-ecom-button="full-width" onClick={handleCreateOrderClick}>
                            Genomför köp
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ConfirmOrder;