import React from 'react';
import { IEcomLifecycle, IEcomStore } from '../types';

export interface ITradeInConfirmCarProps extends IEcomStore, IEcomLifecycle {
};

const TradeInConfirmCar = (props: ITradeInConfirmCarProps) => {
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
                    <div data-ecom-label="">{props.data.tradeInCar.registrationNumber}</div>
                    <div className="m-t-half">
                        <span className="font-medium">Peugot 308 Sportswagon</span> 1.6 BlueHDI FAP Manual, 120hp, 2015 6-speed
                    </div>
                </div>
            </section>

            <section className="page-section page-section-bottom">
                <div data-ecom-buttonnav="">
                    <div className="button-nav-item" onClick={props.onShowTradeInCarDefinition}>
                        <div data-ecom-button="light full-width">
                            Ändra regnr
                        </div>
                    </div>
                    <div className="button-nav-item" onClick={props.onNextStepClick}>
                        <div data-ecom-button="full-width">
                            Ja
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TradeInConfirmCar;