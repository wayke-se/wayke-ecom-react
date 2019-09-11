import React from 'react';

import { IEcomLifecycle, IEcomStore, IEcomContext } from '../types';
import { getVehicleTitle, getVehicleDescription } from '../utils/trade-in-car';

import StoreAction from '../constants/store-action';

export interface ITradeInConfirmCarProps extends IEcomContext, IEcomStore, IEcomLifecycle {
};

const TradeInConfirmCar = (props: ITradeInConfirmCarProps) => {
    const vehicle = props.vehicleLookup.getVehicle();
    const registrationNumber = props.data.tradeInCar.registrationNumber;
    const milage = props.data.tradeInCar.milage;

    const vehicleTitle = getVehicleTitle(vehicle);
    const vehicleDecsription = getVehicleDescription(vehicle);

    const handleHasTradeInCar = (value: boolean) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'tradeInCar',
            name: 'hasTradeInCar',
            value
        }, () => {
            props.onProceedToNextStep();
        });
    };

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Inbytesbil</h1>
                <div data-ecom-content="">
                    <p>Är detta din inbytesbil?</p>
                </div>
            </section>

            <section className="page-section">
                <div data-ecom-box="">
                    <div data-ecom-label="">{registrationNumber}, {milage} mil</div>
                    <div className="m-t-half">
                        <span className="font-medium">{vehicleTitle}</span> {vehicleDecsription}
                    </div>
                </div>
            </section>

            <section className="page-section page-section-bottom">
                <div data-ecom-buttonnav="">
                    <div className="button-nav-item" onClick={props.onShowTradeInCarDefinition}>
                        <button data-ecom-button="light full-width">
                            Ändra
                        </button>
                    </div>
                    <div className="button-nav-item" onClick={() => handleHasTradeInCar(true)}>
                        <button data-ecom-button="full-width">
                            Gå vidare
                        </button>
                    </div>
                </div>
            </section>

            <section className="page-section page-section-bottom">
                <div data-ecom-buttonnav="">
                    <div className="button-nav-item" onClick={() => handleHasTradeInCar(false)}>
                        <button data-ecom-button="full-width">
                            Hoppa över
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TradeInConfirmCar;