import React from "react";

import UserEvent from "../constants/user-event";
import { IEcomContext, IEcomLifecycle, IEcomStore } from "../types";
import { getVehicleDescription, getVehicleTitle } from "../utils/trade-in-car";
import { formatPrice } from "../utils/helpers";

import { VehicleCondition } from "@wayke-se/ecom";
import StoreAction from "../constants/store-action";

const vehicleConditionText = (condition: VehicleCondition) => {
    switch (condition) {
        case VehicleCondition.Ok:
            return "Helt okej skick";
        case VehicleCondition.Good:
            return "Bra skick";
        default:
            return "Mycket bra skick";
    }
};

export interface ITradeInConfirmCarProps
    extends IEcomContext,
        IEcomStore,
        IEcomLifecycle {}

export default (props: ITradeInConfirmCarProps) => {
    const vehicle = props.vehicleLookup.getVehicle();
    const { registrationNumber, milage, condition } = props.data.tradeInCar;

    const vehicleTitle = getVehicleTitle(vehicle);
    const vehicleDecsription = getVehicleDescription(vehicle);

    const valuation = !!vehicle.valuation
        ? formatPrice(Math.round(vehicle.valuation / 100) * 100)
        : null;

    const handleHasTradeInCar = (value: boolean) => {
        props.dispatchStoreAction(
            StoreAction.UPDATE_NAMED_VALUE,
            {
                value,
                type: "tradeInCar",
                name: "hasTradeInCar",
            },
            () => {
                props.onProceedToNextStep();
            }
        );
    };

    const onPreviousStepClick = () => {
        props.onIncompleteUserEvent(UserEvent.BACK_BUTTON_CLICKED);
        props.onPreviousStepClick();
    };

    const onProceed = () => handleHasTradeInCar(true);

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Inbytesbil</h1>
                <div data-ecom-content="">
                    <p>Är detta din inbytesbil?</p>
                </div>
            </section>

            <section className="page-section">
                <div className="repeat-m-half">
                    <div data-ecom-box="">
                        <div
                            data-ecom-columnrow=""
                            className="font-size-small m-b-half"
                        >
                            <div className="column">
                                <div data-ecom-label="">
                                    {registrationNumber}, {milage} mil
                                </div>
                            </div>

                            <div className="column">
                                <button
                                    data-ecom-link="font-inerit"
                                    onClick={props.onShowTradeInCarDefinition}
                                >
                                    Ändra
                                </button>
                            </div>
                        </div>

                        <div className="m-t-half">
                            <span className="font-medium">{vehicleTitle}</span>{" "}
                            {vehicleDecsription}
                        </div>
                    </div>
                </div>
                <div className="repeat-m-half">
                    <div data-ecom-box="light">
                        <div data-ecom-columnrow="">
                            <div className="column">
                                <div className="font-medium">
                                    {vehicleConditionText(condition)}
                                </div>
                            </div>
                            <div className="column">
                                <button
                                    data-ecom-button="light small"
                                    onClick={onPreviousStepClick}
                                >
                                    Ändra
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {valuation && (
                <section className="page-section text-center">
                    <div className="m-b-mini">Ungefärligt värde:</div>
                    <div className="h4 no-margin">{valuation} kr</div>
                </section>
            )}

            <section className="page-section">
                <div data-ecom-alert="">
                    <div className="alert-icon-section">
                        <div className="alert-icon">
                            <i className="icon-info no-margin" />
                        </div>
                    </div>
                    <div className="alert-content">
                        <div className="font-medium">
                            Vi skickar med uppgifter om din inbytesbil till
                            bilhandlaren.
                        </div>{" "}
                        Observera att värderingen som utförs ger ett uppskattat
                        inbytesvärde. Det slutgiltliga värdet avgörs när
                        handlare kan bekräfta bilens skick.
                    </div>
                </div>
            </section>

            <section className="page-section page-section-bottom">
                <div data-ecom-buttonnav="">
                    <div className="button-nav-item" onClick={onProceed}>
                        <button data-ecom-button="full-width">Gå vidare</button>
                    </div>
                </div>
            </section>
        </div>
    );
};
