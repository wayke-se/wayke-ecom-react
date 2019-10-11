import React from 'react';
import CustomerInformationSummary from '../components/customer-information-summary';
import OrderSummary from '../components/order-summary';
import { IEcomStore, IEcomContext, IEcomExternalProps } from '../types';

interface IFinalConfirmationProps extends IEcomExternalProps, IEcomContext, IEcomStore {
};

const FinalConfirmation = (props: IFinalConfirmationProps) => {
    const contactInformation = props.orderOptions.getContactInformation();

    var retailerName, retailerEmail, retailerPhone;

    if (contactInformation) {
        retailerName = contactInformation.name;
        retailerEmail = contactInformation.email;
        retailerPhone = contactInformation.phone;
    }

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
                    <p>
                        { retailerName && <React.Fragment>Kontakta {retailerName}</React.Fragment> }
                        { retailerEmail && <React.Fragment> - <a href={`mailto:${retailerEmail}`}>{retailerEmail}</a></React.Fragment> }
                        { retailerPhone && <React.Fragment> - <a href={`tel:${retailerPhone}`}>{retailerPhone}</a></React.Fragment> }
                    </p>
                </div>
            </section>

            <section className="page-section page-section-bottom">
                <button data-ecom-button="full-width" onClick={props.onExit}>
                    Stäng
                </button>
            </section>
        </div>
    );
}

export default FinalConfirmation;