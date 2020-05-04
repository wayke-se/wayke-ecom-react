import React from "react";

import { ICustomerInformationDetailsProps } from "./customer-information-props";

export default (props: ICustomerInformationDetailsProps) => {
    const personalNumber = props.bankIdCollect.getPersonalNumber();
    const address = props.bankIdCollect.getAddress();
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
                    {personalNumber}
                </div>
            </section>

            <section className="page-section page-section-border">
                <div data-ecom-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">
                            För- och efternamn
                        </div>
                    </div>
                    <div className="column">{address.name}</div>
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
