/* eslint-disable react/jsx-no-target-blank */
import React from "react";

import StoreAction from "../constants/store-action";
import UserEvent from "../constants/user-event";

import {
    validateEmail,
    validatePhoneNumber,
    validateZip,
} from "../utils/validation";

import { ICustomerInformationDetailsProps } from "./customer-information-props";

import OrderSummary from "../components/order-summary";
import FetchCustomerInfo from "./customer-info-fetch";
import InputCustomerInfo from "./customer-info-input";
import CustomerInformationInputType from "../constants/customer-information-input-type";

const baseFields = ["email", "phone"];
const allManualFields = [
    ...baseFields,
    ...["givenName", "surname", "address", "zip", "city", "zip"],
];

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
    const isAutomatic =
        props.data.customer.inputType ===
        CustomerInformationInputType.AUTOMATIC;

    const hasEmailError = !validateEmail(props.data.customer.email);
    const hasPhoneError =
        props.data.interact.customer.phone &&
        !validatePhoneNumber(props.data.customer.phone);
    const hasGivenNameError = !props.data.customer.givenName;
    const hasSurnameError = !props.data.customer.surname;
    const hasAddressError = !props.data.customer.street;
    const hasZipError = !validateZip(props.data.customer.zip);
    const hasCityError = !props.data.customer.city;

    const hasInteractEmail = props.data.interact.customer.email;
    const hasInteractPhone = props.data.interact.customer.phone;
    const hasInteractGivenName = props.data.interact.customer.givenName;
    const hasInteractSurname = props.data.interact.customer.surname;
    const hasInteractAddress = props.data.interact.customer.address;
    const hasInteractZip = props.data.interact.customer.zip;
    const hasInteractCity = props.data.interact.customer.city;

    const allFieldsAreValid = !(
        hasEmailError ||
        hasPhoneError ||
        (isAutomatic
            ? false
            : hasGivenNameError ||
              hasSurnameError ||
              hasAddressError ||
              hasZipError ||
              hasCityError)
    );

    const allFieldsAreInteracted =
        hasInteractEmail &&
        hasInteractPhone &&
        (isAutomatic
            ? true
            : hasInteractGivenName &&
              hasInteractSurname &&
              hasInteractAddress &&
              hasInteractZip &&
              hasInteractCity);

    const handleContinueClick = () => {
        if (!allFieldsAreValid) {
            if (allFieldsAreInteracted) return;
            props.dispatchStoreAction(StoreAction.INTERACT_SET_ALL_FROM_LIST, {
                type: "customer",
                value: isAutomatic ? baseFields : allManualFields,
            });
            return;
        }

        if (isAutomatic) {
            props.onIncompleteUserEvent(
                UserEvent.CUSTOMER_DETAILS_AUTOMATIC_CHOSEN
            );
        } else {
            props.onIncompleteUserEvent(
                UserEvent.CUSTOMER_DETAILS_MANUAL_CHOSEN
            );
        }

        props.onProceedToNextStep();
    };

    const displayEmailError = hasInteractEmail && hasEmailError;
    const displayPhoneError = hasInteractPhone && hasPhoneError;

    const onHandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        handleInputChange(props, e);
    const onHandleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
        handleBlur(props, e);

    return (
        <div data-ecom-page="">
            <section className="page-section">
                <h1 className="h6">Kunduppgifter</h1>
            </section>

            {isAutomatic && <FetchCustomerInfo {...props} />}

            {!isAutomatic && <InputCustomerInfo {...props} />}

            <section className="page-section">
                <div data-ecom-form="">
                    <div
                        className={`form-group ${
                            displayEmailError ? " has-error" : ""
                        }`}
                    >
                        <label
                            data-ecom-inputlabel=""
                            htmlFor="information-2-input-email"
                        >
                            E-post
                        </label>

                        <div data-ecom-inputtext="">
                            <input
                                type="text"
                                id="information-2-input-email"
                                name="email"
                                placeholder="E-postadress"
                                value={props.data.customer.email}
                                onChange={onHandleInputChange}
                                onBlur={onHandleBlur}
                            />
                        </div>

                        <div className="form-alert">
                            En giltig e-postadress måste anges
                        </div>
                    </div>

                    <div
                        className={`form-group ${
                            displayPhoneError ? " has-error" : ""
                        }`}
                    >
                        <label
                            data-ecom-inputlabel=""
                            htmlFor="information-2-input-phone"
                        >
                            Telefonnummer
                        </label>

                        <div data-ecom-inputtext="">
                            <input
                                type="text"
                                id="information-2-input-phone"
                                name="phone"
                                placeholder="07X-XXXXXXX"
                                value={props.data.customer.phone}
                                onChange={onHandleInputChange}
                                onBlur={onHandleBlur}
                            />
                        </div>

                        <div className="form-alert">
                            Ange ditt telefonnummer
                        </div>
                    </div>
                </div>
            </section>

            {!props.isWaitingForResponse && (
                <section className="page-section page-section-bottom">
                    <div data-ecom-buttonnav="">
                        <div className="button-nav-item">
                            <button
                                data-ecom-button="full-width"
                                onClick={handleContinueClick}
                            >
                                Gå vidare
                            </button>
                        </div>
                    </div>

                    <div data-ecom-content="" className="m-t m-b">
                        <p className="text-center font-size-small">
                            Dina uppgifter lagras och sparas säkert.
                            <br /> Läs mer i vår{" "}
                            <a
                                href="https://www.wayke.se/personuppgiftspolicy-wayke"
                                target="_blank"
                            >
                                personsuppgiftspolicy
                            </a>
                            .
                        </p>
                    </div>
                </section>
            )}
            <section className="page-section page-section-accent last-child-pushdown">
                <div className="page-section-accent-content">
                    <h2 className="h6">Din order</h2>
                </div>

                <OrderSummary {...props} />
            </section>
        </div>
    );
};
