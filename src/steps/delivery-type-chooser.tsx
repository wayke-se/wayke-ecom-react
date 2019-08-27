import React from 'react';

import DeliveryType from '../enums/delivery-type';
import { IEcomStore, IEcomLifecycle } from '../types';
import StoreAction from '../enums/store-action';

export interface IDeliveryTypeChooserProps extends IEcomStore, IEcomLifecycle {
};

const DeliveryTypeChooser = (props: IDeliveryTypeChooserProps) => {
    const handleDeliveryTypeClick = (type: DeliveryType) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'delivery',
            name: 'type',
            value: type
        }, () => {
            props.onNextStepClick();
        });
    };

    return (
        <div data-ecom-page="">
            <section className="page-section">
                <h1 className="h6">Leverans</h1>
                <div data-ecom-content="">
                    <p>Hur vill du ha din nya bil levererad?</p>
                </div>
            </section>

            <section className="page-section">
                <div data-ecom-optionlist="">
                    <ul className="option-list">
                        <li className="option-list-item">
                            <button className="option-list-action" onClick={() => handleDeliveryTypeClick(DeliveryType.HOME_DELIVERY)}>
                                <div className="option-list-action-title">Hemleverans</div>
                                <div className="option-list-action-meta">5 - 6 dagar</div>
                            </button>
                        </li>

                        <li className="option-list-item">
                            <button className="option-list-action" onClick={() => handleDeliveryTypeClick(DeliveryType.SELF_PICKUP)}>
                                <div className="option-list-action-title">Hämta hos oss</div>
                                <div className="option-list-action-meta">Idag</div>
                            </button>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default DeliveryTypeChooser;