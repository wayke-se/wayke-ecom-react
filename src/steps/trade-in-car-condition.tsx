import React, { useState } from "react";

import StoreAction from "../constants/store-action";
import { validateTradeIn } from "../tools/data-validation";
import { IEcomContext, IEcomLifecycle, IEcomStore } from "../types";

import { VehicleCondition } from "@wayke-se/ecom";
import Alert from "../components/alert";
import Spinner from "../components/spinner";
import UserEvent from "../constants/user-event";

export interface ITradeInCarConditionProps
    extends IEcomContext,
        IEcomStore,
        IEcomLifecycle {}

export default (props: ITradeInCarConditionProps) => {
    const [hasRequestError, setHasRequestError] = useState(false);

    const pickConditionVeryGood = () =>
        handlePickConditionClick(VehicleCondition.VeryGood);
    const pickConditionGood = () =>
        handlePickConditionClick(VehicleCondition.Good);
    const pickConditionOk = () => handlePickConditionClick(VehicleCondition.Ok);

    const handlePickConditionClick = (condition: VehicleCondition) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "tradeInCar",
            name: "condition",
            value: condition,
        });

        onNextStep();
    };

    const onNextStep = () => {
        const isValidData = validateTradeIn(props.data.tradeInCar);

        if (!isValidData) {
            return props.dispatchStoreAction(
                StoreAction.INTERACT_SET_ALL_FOR_TYPE,
                "tradeInCar"
            );
        }

        setHasRequestError(false);

        props.onFetchVehicleInformation((isSuccessful: boolean) => {
            if (isSuccessful) {
                props.dispatchStoreAction(
                    StoreAction.UPDATE_NAMED_VALUE,
                    {
                        type: "tradeInCar",
                        name: "hasProvidedTradeInCondition",
                        value: true,
                    },
                    () => {
                        props.onIncompleteUserEvent(UserEvent.TRADE_IN_DEFINED);
                        props.onProceedToNextStep();
                    }
                );
            } else {
                setHasRequestError(true);
            }
        });
    };

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Skick</h1>
                <div data-ecom-content="">
                    <p>Välj det alternativ som passar bilens skick bäst.</p>
                </div>
            </section>

            {!props.isWaitingForResponse && !hasRequestError && (
                <section className="page-section page-section-accent">
                    <div className="repeat-m-half">
                        <div data-ecom-box="light">
                            <h2 className="h6">Mycket bra skick</h2>
                            <div data-ecom-content="">
                                <ul>
                                    <li>Inga repor eller skador</li>
                                    <li>
                                        Servad vid varje tillfälle med stämplar
                                        i serviceboken
                                    </li>
                                    <li>
                                        Däck med väldigt bra mönsterdjup (5-8
                                        mm)
                                    </li>
                                </ul>
                            </div>
                            <div className="box-footer box-footer-right">
                                <button
                                    data-ecom-button="small"
                                    onClick={pickConditionVeryGood}
                                >
                                    Välj
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="repeat-m-half">
                        <div data-ecom-box="light">
                            <h2 className="h6">Bra skick</h2>
                            <div data-ecom-content="">
                                <ul>
                                    <li>Några mindre repor och/eller skador</li>
                                    <li>
                                        Servad vid varje tillfälle med stämplar
                                        i serviceboken
                                    </li>
                                    <li>
                                        Däck som inte behöver bytas (mönsterdjup
                                        om 3-5 mm)
                                    </li>
                                </ul>
                            </div>
                            <div className="box-footer box-footer-right">
                                <button
                                    data-ecom-button="small"
                                    onClick={pickConditionGood}
                                >
                                    Välj
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="repeat-m-half">
                        <div data-ecom-box="light">
                            <h2 className="h6">Helt okej skick</h2>
                            <div data-ecom-content="">
                                <ul>
                                    <li>Finns en del repor och skador</li>
                                    <li>Inte servad vid varje tillfälle</li>
                                    <li>
                                        Däck som behöver bytas (mönsterdjup
                                        under 3 mm)
                                    </li>
                                </ul>
                            </div>
                            <div className="box-footer box-footer-right">
                                <button
                                    data-ecom-button="small"
                                    onClick={pickConditionOk}
                                >
                                    Välj
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {hasRequestError && (
                <section className="page-section">
                    <Alert
                        message={`Tyvärr fick vi ingen träff på registreringsnumret ${props.data.tradeInCar.registrationNumber}. Kontrollera registreringsnumret igen eller gå vidare utan inbytesbil (kan kompletteras vid senare kontakt med handlaren).`}
                    />
                </section>
            )}

            {props.isWaitingForResponse && (
                <section className="page-section">
                    <Spinner />
                </section>
            )}
        </div>
    );
};
