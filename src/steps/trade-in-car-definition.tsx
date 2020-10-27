import React from "react";

import {
    validateRegistrationNumber,
    validateMilage,
} from "../utils/validation";
import { IEcomLifecycle, IEcomStore, IEcomContext } from "../types";
import StoreAction from "../constants/store-action";

import Spinner from "../components/spinner";
import { handleEnterPress } from "../utils/events";
import UserEvent from "../constants/user-event";

export interface ITradeInCarDefinitionProps
    extends IEcomContext,
        IEcomStore,
        IEcomLifecycle {}

export default (props: ITradeInCarDefinitionProps) => {
    const handleInputChange = (e) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "tradeInCar",
            name: e.target.name,
            value: e.target.value,
        });
    };

    const handleBlur = (e) => {
        props.dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, {
            type: "tradeInCar",
            name: e.target.name,
        });
    };

    const handleNextStepClick = () =>
        props.dispatchStoreAction(
            StoreAction.UPDATE_NAMED_VALUE,
            {
                type: "tradeInCar",
                name: "hasProvidedTradeInInfo",
                value: true,
            },
            props.onProceedToNextStep
        );

    const handleSkipClick = () => {
        props.dispatchStoreAction(
            StoreAction.UPDATE_NAMED_VALUE,
            {
                type: "tradeInCar",
                name: "hasProvidedTradeInInfo",
                value: false,
            },
            () => {
                props.onIncompleteUserEvent(UserEvent.TRADE_IN_SKIPPED);
                props.onProceedToNextStep();
            }
        );
    };

    const hasErrorRegistrationNumber =
        props.data.interact.tradeInCar.registrationNumber &&
        !validateRegistrationNumber(props.data.tradeInCar.registrationNumber);
    const hasErrorMilage =
        props.data.interact.tradeInCar.milage &&
        !validateMilage(props.data.tradeInCar.milage);

    const onKeyPress = (e: React.KeyboardEvent) =>
        handleEnterPress(e, props.onProceedToNextStep);

    const isValid =
        validateMilage(props.data.tradeInCar.milage) &&
        validateRegistrationNumber(props.data.tradeInCar.registrationNumber);

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Inbytesbil</h1>
                <div data-ecom-content="">
                    <p>
                        Har du en bil du vill byta in när du köper din nya bil?
                    </p>
                </div>
            </section>

            <section className="page-section">
                <div data-ecom-form="">
                    <div className="form-group-row">
                        <div
                            className={`form-group is-half ${
                                hasErrorRegistrationNumber ? " has-error" : ""
                            }`}
                        >
                            <label
                                data-ecom-inputlabel=""
                                htmlFor="exchange-input-regnr"
                            >
                                Registreringsnummer
                            </label>
                            <div data-ecom-inputtext="">
                                <input
                                    type="text"
                                    id="exchange-input-regnr"
                                    name="registrationNumber"
                                    placeholder="Registreringsnummer"
                                    value={
                                        props.data.tradeInCar.registrationNumber
                                    }
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                            <div className="form-alert">
                                Ett giltigt registreringsnummer behöver anges
                            </div>
                        </div>

                        <div
                            className={`form-group is-half ${
                                hasErrorMilage ? " has-error" : ""
                            }`}
                        >
                            <label
                                data-ecom-inputlabel=""
                                htmlFor="exchange-input-mileage"
                            >
                                Miltal (mil)
                            </label>
                            <div data-ecom-inputtext="">
                                <input
                                    type="text"
                                    id="exchange-input-mileage"
                                    name="milage"
                                    placeholder="Miltal"
                                    value={props.data.tradeInCar.milage}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    onKeyPress={onKeyPress}
                                />
                            </div>
                            <div className="form-alert">
                                Mellan 0 och 80 000 mil
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label
                            data-ecom-inputlabel=""
                            htmlFor="exchange-input-description"
                        >
                            Beskrivning (valfritt)
                        </label>
                        <div data-ecom-inputtext="">
                            <textarea
                                id="exchange-input-description"
                                name="description"
                                placeholder="Är det något mer om din inbytesbil du vill berätta för bilhandlaren, något som kan påverka värdet såsom servicehistorik, extrautrustning, vinterdäck?"
                                value={props.data.tradeInCar.description}
                                onChange={handleInputChange}
                                style={{ height: "100px" }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {!props.isWaitingForResponse && (
                <React.Fragment>
                    <section className="page-section">
                        <div className="repeat-m">
                            <button
                                data-ecom-button="full-width"
                                onClick={handleNextStepClick}
                                disabled={!isValid}
                            >
                                Gå vidare
                            </button>
                        </div>
                        <div className="repeat-m">
                            <button
                                data-ecom-button="full-width light"
                                onClick={handleSkipClick}
                            >
                                Gå vidare utan inbytesbil
                            </button>
                        </div>
                    </section>
                </React.Fragment>
            )}

            {props.isWaitingForResponse && (
                <section className="page-section">
                    <Spinner />
                </section>
            )}
        </div>
    );
};
