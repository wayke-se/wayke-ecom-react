import React from "react";

import CustomerInformationSummary from "../components/customer-information-summary";
import OrderSummary from "../components/order-summary";

import { getRetailerInformation } from "../utils/retailer";
import { IEcomStore, IEcomContext, IEcomExternalProps } from "../types";
import shouldUseCreditAssessment from "../utils/credit-assessment/usage-resolver";

interface IFinalConfirmationProps
    extends IEcomExternalProps,
        IEcomContext,
        IEcomStore {}

export default (props: IFinalConfirmationProps) => {
    React.useEffect(() => {
        const usingCreditAssessment = shouldUseCreditAssessment(
            props.data,
            props.orderOptions
        );
        const shouldAcceptCase =
            usingCreditAssessment && !props.creditAssessmentStatus.isAccepted();

        if (shouldAcceptCase) {
            props.acceptCreditAssessmentCase();
        }
    }, []);

    const retailerInformation = getRetailerInformation(props.orderOptions);
    const { name, email, phoneNumber } = retailerInformation;

    return (
        <div data-ecom-page="">
            <section className="page-section">
                <h1 className="h6">Tack för din order!</h1>
                <div data-ecom-content="">
                    <p>
                        En orderbekräftelse kommer att skickas till din
                        e-postadress{" "}
                        <span className="font-medium">
                            {props.data.customer.email}
                        </span>
                        . Vi kontaktar dig sedan inom kort.
                    </p>
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
                        {name && (
                            <React.Fragment>Kontakta {name}</React.Fragment>
                        )}
                        {email && (
                            <React.Fragment>
                                {" "}
                                - <a href={`mailto:${email}`}>{email}</a>
                            </React.Fragment>
                        )}
                        {phoneNumber && (
                            <React.Fragment>
                                {" "}
                                -{" "}
                                <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
                            </React.Fragment>
                        )}
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
};
