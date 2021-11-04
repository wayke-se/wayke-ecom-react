import React from "react";

import StoreAction from "../constants/store-action";
import UserEvent from "../constants/user-event";

import { validateEcomData } from "../tools/data-validation";

import Alert from "../components/alert";
import CustomerInformationSummary from "../components/customer-information-summary";
import OrderSummary from "../components/order-summary";
import Spinner from "../components/spinner";
import {
    IEcomStore,
    IEcomContext,
    IEcomExternalProps,
    IEcomLifecycle,
} from "../types";
import { getRetailerInformation } from "../utils/retailer";
import { SOLD_TEXT } from "../constants/error-copy";

interface IFinalSummaryProps
    extends IEcomExternalProps,
        IEcomContext,
        IEcomStore,
        IEcomLifecycle {}

const handleCheckboxChange = (
    props: IFinalSummaryProps,
    e: React.ChangeEvent<HTMLInputElement>
) => {
    props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
        type: "customer",
        name: e.target.name,
        value: e.target.checked,
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

export default (props: IFinalSummaryProps) => {
    const [isConditionsExtended, setIsConditionsExtended] =
        React.useState(false);
    const [isReturnConditionsExtended, setIsReturnConditionsExtended] =
        React.useState(false);
    const [hasError, setHasError] = React.useState(false);
    const [errorText, setErrorText] = React.useState("");

    React.useEffect(() => {
        if (props.vehicleUnavailable) {
            setHasError(true);
            setErrorText(SOLD_TEXT);
        }
    }, [props.vehicleUnavailable]);

    const address = props.getAddress();
    const createOrder = () => {
        setHasError(false);
        setErrorText("");

        const isValidData = validateEcomData(
            props.data,
            props.orderOptions,
            props.paymentLookup,
            address,
            props.creditAssessmentStatus
        );

        if (!isValidData) {
            setHasError(true);
            setErrorText(
                "Något gick fel. Vi ber om ursäkt för det. Vänligen kontrollera uppgifterna i tidigare steg och försök igen."
            );

            return props.dispatchStoreAction(
                StoreAction.INTERACT_SET_ALL_FOR_TYPE,
                "customer"
            );
        }

        props.onCreateOrder((isSuccessful: boolean) => {
            if (props.vehicleUnavailable) {
                setHasError(true);
                setErrorText(SOLD_TEXT);
                return;
            } else if (!isSuccessful) {
                setHasError(true);
                setErrorText(
                    "Order kunde inte skapas. Vi ber om ursäkt för det. Vänligen försök igen eller kontakta handlaren."
                );
                return;
            }

            props.onIncompleteUserEvent(UserEvent.ORDER_CREATED);
            props.onProceedToNextStep();
        });
    };

    const handleCreateOrderClick = () => {
        createOrder();
    };

    const handleShowConditionsClick = () => {
        setIsConditionsExtended(!isConditionsExtended);
    };

    const handleShowReturnConditionsClick = () => {
        setIsReturnConditionsExtended(!isReturnConditionsExtended);
    };

    const conditions = props.orderOptions.getOrderConditions();
    const returnConditions = props.orderOptions.getOrderReturnConditions();
    const conditionsPdfUri = props.orderOptions.getConditionsPdfUri();

    const formattedConditions = formatNewLines(conditions);
    const formattedReturnConditions = formatNewLines(returnConditions);

    const hasConditionsError =
        props.data.interact.customer.hasAcceptedConditions &&
        !props.data.customer.hasAcceptedConditions;
    const hasReturnConditionsError =
        props.data.interact.customer.hasAcceptedReturnConditions &&
        !props.data.customer.hasAcceptedReturnConditions;

    const canProceed =
        props.data.customer.hasAcceptedConditions &&
        (props.data.customer.hasAcceptedReturnConditions || !returnConditions);

    const onHandleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        handleCheckboxChange(props, e);

    const retailerInformation = getRetailerInformation(props.orderOptions);
    const retailerName = !!retailerInformation
        ? retailerInformation.name
        : "Handlaren";

    return (
        <div data-ecom-page="">
            <section className="page-section">
                <h1 className="h6">Sammanställning</h1>
                <div data-ecom-content="">
                    <p>
                        Granska och godkänn din order för att reservera bilen.
                        Efter det kommer {retailerName} att kontakta dig för att
                        slutföra köpet. Köpet blir bindande först när du
                        signerat det definitiva affärsförslaget med{" "}
                        {retailerName}. Det är även då betalningen sker.
                    </p>
                </div>
            </section>

            <section className="page-section page-section-accent">
                <OrderSummary {...props} />
            </section>

            <section className="page-section">
                <h2 className="h6">Kunduppgifter</h2>

                <CustomerInformationSummary {...props} />
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

            {props.isWaitingForResponse && (
                <section className="page-section">
                    <Spinner />
                </section>
            )}

            {!!hasError && (
                <section className="page-section">
                    <Alert message={errorText} />
                </section>
            )}

            {!props.isWaitingForResponse && (
                <section className="page-section page-section-bottom">
                    <div data-ecom-buttonnav="">
                        <div className="button-nav-item">
                            <button
                                data-ecom-button="full-width"
                                disabled={!canProceed}
                                onClick={handleCreateOrderClick}
                            >
                                Genomför köp
                            </button>
                        </div>
                    </div>
                    <div data-ecom-content="" className="m-t m-b">
                        <p className="text-dark-lighten text-center font-size-small">
                            Med reservation för eventuell ändring i tillgången
                            av utbjudna bilar
                        </p>
                    </div>
                </section>
            )}
        </div>
    );
};
