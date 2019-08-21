import React from 'react';

import DeliveryType from '../enums/delivery-type';

export interface IDeliveryTypeChooserProps {
    onDeliveryTypeChange: (type: DeliveryType) => void;
};

const DeliveryTypeChooser = (props: IDeliveryTypeChooserProps) => {
    return (
        <div data-am-page="">
            <section className="page-section">
                <h1 className="h6">Leverans</h1>
                <div data-am-content="">
                    <p>Hur vill du ha din nya bil levererad?</p>
                </div>
            </section>

            <section className="page-section">
                <div data-am-optionlist="">
                    <ul className="option-list">
                        <li className="option-list-item">
                            <button className="option-list-action" onClick={() => props.onDeliveryTypeChange(DeliveryType.HOME_DELIVERY)}>
                                <div className="option-list-action-title">Hemleverans</div>
                                <div className="option-list-action-meta">5 - 6 dagar</div>
                            </button>
                        </li>

                        <li className="option-list-item">
                            <button className="option-list-action" onClick={() => props.onDeliveryTypeChange(DeliveryType.SELF_PICKUP)}>
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