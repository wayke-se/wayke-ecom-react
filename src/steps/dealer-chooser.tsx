import { IDealerOption } from "@wayke-se/ecom/dist-types/orders/types";
import React from "react";
import StoreAction from "../constants/store-action";

import { IEcomContext, IEcomLifecycle, IEcomStore } from "../types";

export interface IDealerChooserProps
    extends IEcomContext,
        IEcomStore,
        IEcomLifecycle {}

export default (props: IDealerChooserProps) => {
    const handleDealerSelection = (value: IDealerOption) => {
        props.onHandleDealerSelection(value);

        props.dispatchStoreAction(
            StoreAction.UPDATE_NAMED_VALUE,
            {
                value: value.id,
                type: "dealerChooser",
                name: "dealer",
            },
            () => {
                props.onProceedToNextStep();
            }
        );
    };

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Vilken handlare vill du köpa från?</h1>
                <div data-ecom-content="">
                    <p>
                        Detta fordon finns tillgängligt hos flera handlare. Välj
                        den du vill handla från!
                    </p>
                </div>
            </section>

            <section className="page-section">
                <div data-ecom-optionlist="">
                    <ul className="option-list">
                        {props.orderOptions.getDealerSites().map((dealer) => (
                            <li key={dealer.id} className="option-list-item">
                                <button
                                    className="option-list-action"
                                    onClick={() =>
                                        handleDealerSelection(dealer)
                                    }
                                >
                                    <div className="option-list-action-title">
                                        {dealer.name}
                                        <i className="icon-arrow-right m-l-half" />
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
};
