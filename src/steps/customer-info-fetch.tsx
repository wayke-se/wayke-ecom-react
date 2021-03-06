import React from "react";

import { ICustomerInformationDetailsProps } from "./customer-information-props";

import { maskText } from "../utils/mask";

const mask = (raw: string) => `${raw.substr(0, raw.length - 4)}xxxx`;

export default (props: ICustomerInformationDetailsProps) => {
    const address = props.getAddress();
    const allowPersonalNumberEdit = !props.useBankId;

    return (
        <React.Fragment>
            <section className="page-section page-section-border">
                <div
                    data-ecom-columnrow=""
                    className="font-size-small m-b-half"
                >
                    <div className="column">
                        <div className="font-medium">Personnummer</div>
                    </div>
                    {allowPersonalNumberEdit && (
                        <div className="column">
                            <button
                                data-ecom-link="font-inerit"
                                onClick={props.onShowCustomerInformationInitial}
                            >
                                Ändra
                            </button>
                        </div>
                    )}
                </div>
                <div className="m-t-half">
                    <i className="icon-profile m-r-half" />
                    {mask(props.data.customer.personalNumber)}
                </div>
            </section>

            <section className="page-section page-section-border">
                <div data-ecom-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">
                            Förnamn
                        </div>
                    </div>
                    <div className="column">{maskText(address.givenName)}</div>
                </div>

                <div data-ecom-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">
                            Efternamn
                        </div>
                    </div>
                    <div className="column">{maskText(address.surname)}</div>
                </div>

                <div data-ecom-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">
                            Gatuadress
                        </div>
                    </div>
                    <div className="column">{address.street}</div>
                </div>

                <div data-ecom-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">
                            Postnummer
                        </div>
                    </div>
                    <div className="column">{address.postalCode}</div>
                </div>

                <div data-ecom-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">
                            Postort
                        </div>
                    </div>
                    <div className="column">{address.city}</div>
                </div>
            </section>
        </React.Fragment>
    );
};
