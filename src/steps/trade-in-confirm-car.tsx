import React from 'react';
import { ITradeInCarData, IEcomLifecycle } from '../types';

export interface ITradeInConfirmCarProps extends IEcomLifecycle {
    tradeInCar: ITradeInCarData;
    onShowTradeInCarDefinition: () => void;
};

const TradeInConfirmCar = (props: ITradeInConfirmCarProps) => {
    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Inbytesbil</h1>
                <div data-am-content="">
                    <p>Är detta din inbytesbil?</p>
                </div>
            </section>

            <section className="page-section">
                <div data-am-box="">
                    <div data-am-label="">{props.tradeInCar.registrationNumber}</div>
                    <div className="m-t-half">
                        <span className="font-medium">Peugot 308 Sportswagon</span> 1.6 BlueHDI FAP Manual, 120hp, 2015 6-speed
                    </div>
                </div>
            </section>

            <section className="page-section page-section-bottom">
                <div data-am-buttonnav="">
                    <div className="button-nav-item" onClick={props.onShowTradeInCarDefinition}>
                        <div data-am-button="light full-width">
                            Ändra regnr
                        </div>
                    </div>
                    <div className="button-nav-item" onClick={props.onNextStepClick}>
                        <div data-am-button="full-width">
                            Ja
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TradeInConfirmCar;