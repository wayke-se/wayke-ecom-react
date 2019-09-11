import React from 'react';

import { IEcomStore, IEcomLifecycle } from '../types';
import StoreAction from '../constants/store-action';

export interface ITradeInExistsChooserProps extends IEcomStore, IEcomLifecycle {
}

const TradeInExistsChooser = (props: ITradeInExistsChooserProps) => {
    const handleWantsToDefineTradeInClick = (value: boolean) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'tradeInCar',
            name: 'wantsToDefineTradeIn',
            value
        }, () => {
            props.onProceedToNextStep();
        });
    };

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Har du inbytesbil?</h1>
                <div data-ecom-content="">
                    <p>Har du en bil du vill byta in när du köper din nya bil?</p>
                </div>
            </section>

            <section className="page-section">
                <div data-ecom-optionlist="">
                    <ul className="option-list">
                        <li className="option-list-item">
                            <button className="option-list-action" onClick={() => handleWantsToDefineTradeInClick(true)}>
                                <div className="option-list-action-title">Jag har inbytesbil<i className="icon-arrow-right m-l-half"></i></div>
                            </button>
                        </li>
                    </ul>
                </div>
            </section>

            <section className="page-section text-center" onClick={() => handleWantsToDefineTradeInClick(false)}>
                <button data-ecom-link="action"><i className="icon-skip m-r-half"></i>Hoppa över detta steg</button>
            </section>
        </div>
    );
};

export default TradeInExistsChooser;