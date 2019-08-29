import React from 'react';

import { IEcomStore, IEcomLifecycle } from '../types';
import StoreAction from '../constants/store-action';

export interface ITradeInExistsChooserProps extends IEcomStore, IEcomLifecycle {
}

const TradeInExistsChooser = (props: ITradeInExistsChooserProps) => {
    const handleHasTradeInCarClick = (value: boolean) => {
        props.dispatchStoreAction(StoreAction.TRADE_IN_CAR_UPDATE_HAS_TRADE_IN_CAR, value, () => {
            props.onNextStepClick();
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
                            <button className="option-list-action" onClick={() => handleHasTradeInCarClick(true)}>
                                <div className="option-list-action-title">Jag har inbytesbil</div>
                            </button>
                        </li>

                        <li className="option-list-item">
                            <button className="option-list-action" onClick={() => handleHasTradeInCarClick(false)}>
                                <div className="option-list-action-title">Jag har ingen inbytesbil</div>
                            </button>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default TradeInExistsChooser;