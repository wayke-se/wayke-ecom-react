import React from "react";

import {
    IEcomContext,
    IEcomLifecycle,
    IEcomStore,
    IEcomExternalProps,
} from "../types";
import { getRetailerInformation } from "../utils/retailer";

import PaymentMethodItem from "./payment-method-item";

export interface IPaymentMethodChooserProps
    extends IEcomExternalProps,
        IEcomContext,
        IEcomStore,
        IEcomLifecycle {}

export default (props: IPaymentMethodChooserProps) => {
    const items = props.orderOptions
        .getPaymentOptions()
        .map((o, index) => (
            <PaymentMethodItem key={index} paymentOption={o} {...props} />
        ));
    const retailerInformation = getRetailerInformation(props.orderOptions);

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Finansiering</h1>
                <div data-ecom-content="">
                    <p>Hur vill du finansiera din nya bil?</p>
                </div>
            </section>

            <section className="page-section">
                <div data-ecom-optionlist="">
                    <ul className="option-list">{items}</ul>
                </div>
            </section>

            <section className="page-section">
                <div data-ecom-alert="">
                    <div className="alert-icon-section">
                        <div className="alert-icon">
                            <i className="icon-info no-margin" />
                        </div>
                    </div>
                    <div className="alert-content">
                        Köpet är villkorat att eventuell finansiering beviljas
                        och att säljare {retailerInformation.name} och köpare är
                        överens om pris för eventuell inbytesbil.
                    </div>
                </div>
            </section>
        </div>
    );
};
