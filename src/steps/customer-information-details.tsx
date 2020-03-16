import React from "react";

import CustomerInformationInputType from "../constants/customer-information-input-type";
import StoreAction from "../constants/store-action";
import UserEvent from "../constants/user-event";

import { validateEmail, validatePhoneNumber } from "../utils/validation";

import { validateEcomData } from "../tools/data-validation";

import { ICustomerInformationDetailsProps } from "./customer-information-props";

import Alert from "../components/alert";
import Spinner from "../components/spinner";
import OrderSummary from "../components/order-summary";
import FetchCustomerInfo from "./customer-info-fetch";
import InputCustomerInfo from "./customer-info-input";

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

const handleCheckboxChange = (
    props: ICustomerInformationDetailsProps,
    e: React.ChangeEvent<HTMLInputElement>
) => {
    props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
        type: "customer",
        name: e.target.name,
        value: e.target.checked,
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

const formatNewLines = (text: string): any => {
    if (!text) {
        return null;
    }

    const lines = text.split("\n");

    return lines.map((l, index) => {
        const isFirst = index === 0;

        if (isFirst) {
            return <span key={index}>{l}</span>;
        }

        return (
            <span key={index}>
                <br />
                {l}
            </span>
        );
    });
};

export default (props: ICustomerInformationDetailsProps) => {
    const [isConditionsExtended, setIsConditionsExtended] = React.useState(
        false
    );
    const [
        isReturnConditionsExtended,
        setIsReturnConditionsExtended,
    ] = React.useState(false);
    const [hasRequestError, setHasRequestError] = React.useState(false);

    const isAutomatic =
        props.data.customer.inputType ===
        CustomerInformationInputType.AUTOMATIC;

    const handleCreateOrderClick = () => {
        const isValidData = validateEcomData(
            props.data,
            props.addressLookup,
            props.orderOptions,
            props.paymentLookup
        );

        if (!isValidData) {
            return props.dispatchStoreAction(
                StoreAction.INTERACT_SET_ALL_FOR_TYPE,
                "customer"
            );
        }

        setHasRequestError(false);

        props.onCreateOrder((isSuccessful: boolean) => {
            if (!isSuccessful) {
                setHasRequestError(true);
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

            props.onIncompleteUserEvent(UserEvent.ORDER_CREATED);
            props.onProceedToNextStep();
        });
    };

    const handleShowConditionsClick = () => {
        setIsConditionsExtended(!isConditionsExtended);
    };

    const handleShowReturnConditionsClick = () => {
        setIsReturnConditionsExtended(!isReturnConditionsExtended);
    };

    const hasEmailError =
        props.data.interact.customer.email &&
        !validateEmail(props.data.customer.email);
    const hasPhoneError =
        props.data.interact.customer.phone &&
        !validatePhoneNumber(props.data.customer.phone);
    const hasConditionsError =
        props.data.interact.customer.hasAcceptedConditions &&
        !props.data.customer.hasAcceptedConditions;
    const hasReturnConditionsError =
        props.data.interact.customer.hasAcceptedReturnConditions &&
        !props.data.customer.hasAcceptedReturnConditions;

    const conditions = props.orderOptions.getOrderConditions();
    const returnConditions = props.orderOptions.getOrderReturnConditions();
    const conditionsPdfUri = props.orderOptions.getConditionsPdfUri();

    const formattedConditions = formatNewLines(conditions);
    const formattedReturnConditions = formatNewLines(returnConditions);

    const onHandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        handleInputChange(props, e);
    const onHandleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        handleCheckboxChange(props, e);
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
                            hasEmailError ? " has-error" : ""
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
                            hasPhoneError ? " has-error" : ""
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

            <section className="page-section">
                <div data-ecom-form="">
                    <div
                        className={`form-group ${
                            hasConditionsError ? " has-error" : ""
                        }`}
                    >
                        <div data-ecom-inputselection="checkbox">
                            <input
                                type="checkbox"
                                id="checkbox-summary-conditions"
                                name="hasAcceptedConditions"
                                checked={
                                    props.data.customer.hasAcceptedConditions
                                }
                                onChange={onHandleCheckboxChange}
                                onBlur={onHandleBlur}
                            />

                            <label htmlFor="checkbox-summary-conditions">
                                <span className="text">
                                    Jag intygar att de angivna uppgifterna
                                    stämmer, och jag godkänner{" "}
                                    <button
                                        data-ecom-link=""
                                        className="valign-baseline"
                                        onClick={handleShowConditionsClick}
                                    >
                                        köpvillkor
                                    </button>
                                </span>
                            </label>

                            <div className="form-alert">
                                Köpvillkor behöver godkännas för att gå vidare
                            </div>
                        </div>
                    </div>
                </div>

                {isConditionsExtended && (
                    <div data-ecom-scrollbox="" className="m-t">
                        <article data-ecom-content="small-headings">
                            <h1>Köpvillkor</h1>
                            <p>{formattedConditions}</p>
                        </article>
                    </div>
                )}

                {returnConditions && (
                    <>
                        <div data-ecom-form="" className="m-t">
                            <div
                                className={`form-group ${
                                    hasReturnConditionsError ? " has-error" : ""
                                }`}
                            >
                                <div data-ecom-inputselection="checkbox">
                                    <input
                                        type="checkbox"
                                        id="checkbox-summary-return-conditions"
                                        name="hasAcceptedReturnConditions"
                                        checked={
                                            props.data.customer
                                                .hasAcceptedReturnConditions
                                        }
                                        onChange={onHandleCheckboxChange}
                                        onBlur={onHandleBlur}
                                    />

                                    <label htmlFor="checkbox-summary-return-conditions">
                                        <span className="text">
                                            Jag godkänner{" "}
                                            <button
                                                data-ecom-link=""
                                                className="valign-baseline"
                                                onClick={
                                                    handleShowReturnConditionsClick
                                                }
                                            >
                                                villkor för ångerrätt
                                            </button>
                                        </span>
                                    </label>

                                    <div className="form-alert">
                                        Villkor för ångerrätt behöver godkännas
                                        för att gå vidare
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isReturnConditionsExtended && (
                            <div data-ecom-scrollbox="" className="m-t">
                                <article data-ecom-content="small-headings">
                                    <h1>Villkor för ångerrätt</h1>
                                    <p>{formattedReturnConditions}</p>
                                </article>
                            </div>
                        )}
                    </>
                )}

                {conditionsPdfUri && (
                    <div data-ecom-content="" className="m-t">
                        <a
                            href={conditionsPdfUri}
                            data-ecom-link=""
                            title="Ladda ner villkor (PDF)"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Ladda ner villkor (PDF)
                            <i className="icon-link-external m-l-half" />
                        </a>
                    </div>
                )}
            </section>

            {hasRequestError && (
                <section className="page-section">
                    <Alert message="Tyvärr gick någonting fel. Prova gärna igen om en liten stund." />
                </section>
            )}

            {!props.isWaitingForResponse && (
                <section className="page-section page-section-bottom">
                    <div data-ecom-buttonnav="">
                        <div className="button-nav-item">
                            <button
                                data-ecom-button="full-width"
                                onClick={handleCreateOrderClick}
                            >
                                Genomför köp
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {props.isWaitingForResponse && (
                <section className="page-section">
                    <Spinner />
                </section>
            )}

            <section className="page-section page-section-accent">
                <div className="page-section-accent-content">
                    <h2 className="h6">Din order</h2>
                </div>

                <OrderSummary {...props} />
            </section>
        </div>
    );
};
