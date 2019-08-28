import React from 'react';
import CustomerInformationSummary from '../components/customer-information-summary';
import OrderSummary from '../components/order-summary';
import { IEcomStore } from '../types';

interface IFinalConfirmationProps extends IEcomStore {
};

const FinalConfirmation = (props: IFinalConfirmationProps) => {
    return (
        <div data-ecom-page="">
            <section className="page-section">
                <h1 className="h6">Tack för din order!</h1>
                <div data-ecom-content="">
                    <p>En orderbekräftelse kommer att skickas till din e-postadress <span className="font-medium">jane.doe@email.com</span>.</p>
                    <p>Orderbekräftelsen skickas normalt inom <span className="font-medium">10 minuter</span>, men kan i undantagsfall dröja upp till <span className="font-medium">48 timmar</span>.</p>
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

            <section className="page-section">
                <h2 className="h6">Leveranssätt</h2>
                <div data-ecom-content="">
                    <p>Din beställning är färdig och kan hämtas hos Börjessons bil Ängelholm, <span className="font-medium">Idag 30 maj</span>.</p>
                </div>
            </section>
        </div>
    );
};

export default FinalConfirmation;