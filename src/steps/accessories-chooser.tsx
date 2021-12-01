import { IAccessory } from "@wayke-se/ecom/dist-types/orders/types";
import React from "react";

import Accessory from "../components/accessory";
import {
    IEcomStore,
    IEcomContext,
    IEcomExternalProps,
    IEcomLifecycle,
} from "../types";

interface IAccessoryProps
    extends IEcomExternalProps,
        IEcomContext,
        IEcomStore,
        IEcomLifecycle {}

export default (props: IAccessoryProps) => {
    return (
        <div data-ecom-page="">
            <section className="page-section">
                <h1 className="h6">Tillbehör</h1>
                <div data-ecom-content="">
                    <p>
                        Vill du utrusta din nya bil med något extra? Nedan
                        listas ett urval av tillbehör som passar till din bil.
                    </p>
                </div>
            </section>
            <section className="page-section page-section-accent">
                {props.orderOptions
                    .getAccessories()
                    .slice(0, 5)
                    .map((accesory: IAccessory) => (
                        <Accessory
                            accessory={accesory}
                            key={accesory.id}
                            {...props}
                        />
                    ))}
            </section>
            <section className="page-section">
                <button
                    data-ecom-button="full-width"
                    onClick={props.onProceedToNextStep}
                >
                    Gå vidare
                </button>
            </section>
            <section className="page-section text-center">
                <button
                    data-ecom-link="action"
                    onClick={props.onProceedToNextStep}
                >
                    <i className="icon-skip m-r-half"></i>
                    Hoppa över detta steg
                </button>
            </section>
        </div>
    );
};
