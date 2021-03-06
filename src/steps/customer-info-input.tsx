import React from "react";

import { ICustomerInformationDetailsProps } from "./customer-information-props";
import StoreAction from "../constants/store-action";
import { validateZip } from "../utils/validation";

const handleInputChange = (
    props: ICustomerInformationDetailsProps,
    e: React.ChangeEvent<HTMLInputElement>
) => {
    props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
        type: "customer",
        name: e.target.name,
        value: e.target.value,
    });
};

const handleBlur = (
    props: ICustomerInformationDetailsProps,
    e: React.FocusEvent<HTMLInputElement>
) => {
    props.dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, {
        type: "customer",
        name: e.target.name,
    });
};

export default (props: ICustomerInformationDetailsProps) => {
    const hasGivenNameError =
        props.data.interact.customer.givenName &&
        !props.data.customer.givenName;
    const hasSurnameError =
        props.data.interact.customer.surname && !props.data.customer.surname;
    const hasAddressError =
        props.data.interact.customer.address && !props.data.customer.street;
    const hasZipError =
        props.data.interact.customer.zip &&
        !validateZip(props.data.customer.zip);
    const hasCityError =
        props.data.interact.customer.city && !props.data.customer.city;

    const onHandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        handleInputChange(props, e);
    const onHandleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
        handleBlur(props, e);

    return (
        <section className="page-section">
            <div data-ecom-form="">
                <div
                    className={`form-group ${
                        hasGivenNameError ? " has-error" : ""
                    }`}
                >
                    <label
                        data-ecom-inputlabel=""
                        htmlFor="information-2-input-given-name"
                    >
                        Förnamn
                    </label>

                    <div data-ecom-inputtext="">
                        <input
                            type="text"
                            id="information-2-input-given-name"
                            name="givenName"
                            placeholder="Förnamn"
                            value={props.data.customer.givenName}
                            onChange={onHandleInputChange}
                            onBlur={onHandleBlur}
                        />
                    </div>

                    <div className="form-alert">Förnamn måste anges</div>
                </div>

                <div
                    className={`form-group ${
                        hasSurnameError ? " has-error" : ""
                    }`}
                >
                    <label
                        data-ecom-inputlabel=""
                        htmlFor="information-2-input-surname"
                    >
                        Efternamn
                    </label>

                    <div data-ecom-inputtext="">
                        <input
                            type="text"
                            id="information-2-input-surname"
                            name="surname"
                            placeholder="Efternamn"
                            value={props.data.customer.surname}
                            onChange={onHandleInputChange}
                            onBlur={onHandleBlur}
                        />
                    </div>

                    <div className="form-alert">Efternamn måste anges</div>
                </div>

                <div
                    className={`form-group ${
                        hasAddressError ? " has-error" : ""
                    }`}
                >
                    <label
                        data-ecom-inputlabel=""
                        htmlFor="information-2-input-street"
                    >
                        Gatuadress
                    </label>

                    <div data-ecom-inputtext="">
                        <input
                            type="text"
                            id="information-2-input-street"
                            name="street"
                            placeholder="Gatuadress"
                            value={props.data.customer.street}
                            onChange={onHandleInputChange}
                            onBlur={onHandleBlur}
                        />
                    </div>

                    <div className="form-alert">Gatuadress måste anges</div>
                </div>

                <div
                    className={`form-group ${hasZipError ? " has-error" : ""}`}
                >
                    <label
                        data-ecom-inputlabel=""
                        htmlFor="information-2-input-zip"
                    >
                        Postnummer
                    </label>

                    <div data-ecom-inputtext="">
                        <input
                            type="text"
                            id="information-2-input-zip"
                            name="zip"
                            placeholder="XXX XX"
                            value={props.data.customer.zip}
                            onChange={onHandleInputChange}
                            onBlur={onHandleBlur}
                        />
                    </div>

                    <div className="form-alert">
                        Ange postnummer i formatet &quot;XXX XX&quot;
                    </div>
                </div>

                <div
                    className={`form-group ${hasCityError ? " has-error" : ""}`}
                >
                    <label
                        data-ecom-inputlabel=""
                        htmlFor="information-2-input-city"
                    >
                        Postort
                    </label>

                    <div data-ecom-inputtext="">
                        <input
                            type="text"
                            id="information-2-input-city"
                            name="city"
                            placeholder="Postort"
                            value={props.data.customer.city}
                            onChange={onHandleInputChange}
                            onBlur={onHandleBlur}
                        />
                    </div>

                    <div className="form-alert">Postort måste anges</div>
                </div>
            </div>
        </section>
    );
};
