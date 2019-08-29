import React from 'react';
import CustomerInformationSummary from '../components/customer-information-summary';
import OrderSummary from '../components/order-summary';
import { IEcomStore, IEcomContext, IEcomExternalProps } from '../types';

import Alert from '../components/alert';
import Spinner from '../components/spinner';

interface IFinalConfirmationProps extends IEcomExternalProps, IEcomContext, IEcomStore {
};

class FinalConfirmation extends React.Component<IFinalConfirmationProps> {
    constructor(props: IFinalConfirmationProps) {
        super(props);
    }

    componentDidMount() {
        this.props.onCreateOrder();
    }

    render() {
        if (this.props.orderCreateError) {
            return <Alert message="Tyvärr kunde vi inte lägga beställningen." />;
        }

        if (!this.props.orderCreate) {
            return <Spinner />;
        }

        return (
            <div data-ecom-page="">
                <section className="page-section">
                    <h1 className="h6">Tack för din order!</h1>
                    <div data-ecom-content="">
                        <p>En orderbekräftelse kommer att skickas till din e-postadress <span className="font-medium">{this.props.data.customer.email}</span>.</p>
                        <p>Orderbekräftelsen skickas normalt inom <span className="font-medium">10 minuter</span>, men kan i undantagsfall dröja upp till <span className="font-medium">48 timmar</span>.</p>
                    </div>
                </section>

                <section className="page-section page-section-accent">
                    <div className="page-section-accent-content">
                        <h2 className="h6">Din order</h2>
                    </div>

                    <OrderSummary {...this.props} />
                </section>

                <section className="page-section">
                    <h2 className="h6">Kunduppgifter</h2>

                    <CustomerInformationSummary {...this.props} />
                </section>
            </div>
        );
    }
}

export default FinalConfirmation;