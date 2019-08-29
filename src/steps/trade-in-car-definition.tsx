import React from 'react';

import { validateRegistrationNumber, validateMilage } from '../utils/validation';
import { IEcomLifecycle, IEcomStore } from '../types';
import StoreAction from '../constants/store-action';

export interface ITradeInCarDefinitionProps extends IEcomStore, IEcomLifecycle {
};

const TradeInCarDefinition = (props: ITradeInCarDefinitionProps) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'tradeInCar',
            name: e.target.name,
            value: e.target.value
        });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        props.dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, { type: 'tradeInCar', name: e.target.name });
    };

    const hasErrorRegistrationNumber = props.data.interact.tradeInCar.registrationNumber && !validateRegistrationNumber(props.data.tradeInCar.registrationNumber);
    const hasErrorMilage = props.data.interact.tradeInCar.milage && !validateMilage(props.data.tradeInCar.milage);

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Inbytesbil</h1>
                <div data-ecom-content="">
                    <p>Har du en bil du vill byta in när du köper din nya bil?</p>
                </div>
            </section>

            <section className="page-section">
                <div data-ecom-form="">
                    <div className={`form-group ${hasErrorRegistrationNumber ? ' has-error' : ''}`}>
                        <label data-ecom-inputlabel="" htmlFor="exchange-input-regnr">Registreringsnummer</label>
                        <div data-ecom-inputtext="">
                            <input type="text"
                                    id="exchange-input-regnr"
                                    name="registrationNumber"
                                    placeholder="Registreringsnummer"
                                    value={props.data.tradeInCar.registrationNumber}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur} />
                        </div>
                        <div className="form-alert">Fel format.</div>
                    </div>

                    <div className={`form-group ${hasErrorMilage ? ' has-error' : ''}`}>
                        <label data-ecom-inputlabel="" htmlFor="exchange-input-mileage">Miltal (mil)</label>
                        <div data-ecom-inputtext="">
                            <input type="text"
                                    id="exchange-input-mileage"
                                    name="milage"
                                    placeholder="Miltal"
                                    value={props.data.tradeInCar.milage}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur} />
                        </div>
                        <div className="form-alert">Mellan 0 och 80 000 mil.</div>
                    </div>
                </div>
            </section>

            <section className="page-section page-section-bottom">
                <div data-ecom-buttonnav="">
                    <div className="button-nav-item" onClick={props.onNextStepClick}>
                        <div data-ecom-button="full-width">
                            Gå vidare
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TradeInCarDefinition;