import React from 'react';
import CustomerInformationSummary from '../components/customer-information-summary';
import OrderSummary from '../components/order-summary';
import { IEcomStore, IEcomContext, IEcomExternalProps } from '../types';

interface IFinalConfirmationProps extends IEcomExternalProps, IEcomContext, IEcomStore {
};

const FinalConfirmation = (props: IFinalConfirmationProps) => {
    return (
        <div data-ecom-page="">
            <section className="page-section">
                <h1 className="h6">Tack för din order!</h1>
                <div data-ecom-content="">
                    <p>En orderbekräftelse kommer att skickas till din e-postadress <span className="font-medium">{props.data.customer.email}</span>.</p>
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
        </div>
    );
}

export default FinalConfirmation;