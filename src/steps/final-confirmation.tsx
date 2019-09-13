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
                    <p>En orderbekräftelse kommer att skickas till din e-postadress <span className="font-medium">{props.data.customer.email}</span>. Vi kontaktar dig sedan inom kort.</p>
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
                <h1 className="h6">Har du frågor?</h1>
                <div data-ecom-content="">
                    <p>Kontakta {props.vehicle.retailerName} - <a href={`mailto:${props.vehicle.retailerEmail}`}>{props.vehicle.retailerEmail}</a> - <a href={`tel:${props.vehicle.retailerPhoneNumber}`}>{props.vehicle.retailerPhoneNumber}</a></p>
                </div>
            </section>

            <section className="page-section page-section-bottom">
                <div data-ecom-buttonnav="">
                    <div className="button-nav-item">
                        <button data-ecom-button="full-width" onClick={props.onExit}>
                            Stäng
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default FinalConfirmation;