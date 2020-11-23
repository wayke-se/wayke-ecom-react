import React from "react";
import { IEcomStore, IEcomContext } from "../types";
import { createCustomerObject } from "../tools/data-creator";

import { maskText } from "../utils/mask";

interface ICustomerInformationSummaryProps extends IEcomContext, IEcomStore {}

export default (props: ICustomerInformationSummaryProps) => {
    const customerObject = createCustomerObject(
        props.data.customer,
        props.getAddress()
    );

    return (
        <React.Fragment>
            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">Förnamn</div>
                </div>
                <div className="column">
                    {maskText(customerObject.givenName)}
                </div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">Efternamn</div>
                </div>
                <div className="column">{maskText(customerObject.surname)}</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">
                        Gatuadress
                    </div>
                </div>
                <div className="column">{customerObject.street}</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">
                        Postnummer
                    </div>
                </div>
                <div className="column">{customerObject.zip}</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">Postort</div>
                </div>
                <div className="column">{customerObject.city}</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">E-post</div>
                </div>
                <div className="column">{props.data.customer.email}</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">
                        Telefonnummer
                    </div>
                </div>
                <div className="column">{props.data.customer.phone}</div>
            </div>
        </React.Fragment>
    );
};
