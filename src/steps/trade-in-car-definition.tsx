import React from 'react';

import { validateRegistrationNumber, validateMilage } from '../utils/validation';
import { IEcomLifecycle, IInteractData, ITradeInCarData } from '../types';

export interface ITradeInCarDefinitionProps extends IEcomLifecycle {
    tradeInCar: ITradeInCarData;
    interact: IInteractData;
};

const TradeInCarDefinition = (props: ITradeInCarDefinitionProps) => {
    const hasErrorRegistrationNumber = props.interact.tradeInCar.registrationNumber && !validateRegistrationNumber(props.tradeInCar.registrationNumber);
    const hasErrorMilage = props.interact.tradeInCar.milage && !validateMilage(props.tradeInCar.milage);

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Inbytesbil</h1>
                <div data-am-content="">
                    <p>Har du en bil du vill byta in när du köper din nya bil?</p>
                </div>
            </section>

            <section className="page-section">
                <div data-am-form="">
                    <div className={`form-group ${hasErrorRegistrationNumber ? ' has-error' : ''}`}>
                        <label data-am-inputlabel="" htmlFor="exchange-input-regnr">Registreringsnummer</label>
                        <div data-am-inputtext="">
                            <input type="text"
                                    id="exchange-input-regnr"
                                    name="registrationNumber"
                                    placeholder="Registreringsnummer"
                                    value={props.tradeInCar.registrationNumber}
                                    onChange={props.onInputChange}
                                    onBlur={props.onInputBlur} />
                        </div>
                        <div className="alert">Fel format.</div>
                    </div>

                    <div className={`form-group ${hasErrorMilage ? ' has-error' : ''}`}>
                        <label data-am-inputlabel="" htmlFor="exchange-input-mileage">Miltal (mil)</label>
                        <div data-am-inputtext="">
                            <input type="text"
                                    id="exchange-input-mileage"
                                    name="milage"
                                    placeholder="Miltal"
                                    value={props.tradeInCar.milage}
                                    onChange={props.onInputChange}
                                    onBlur={props.onInputBlur} />
                        </div>
                        <div className="alert">Mellan 0 och 80 000 mil.</div>
                    </div>
                </div>
            </section>

            <section className="page-section page-section-bottom">
                <div data-am-buttonnav="">
                    <div className="button-nav-item" onClick={props.onNextStepClick}>
                        <div data-am-button="full-width">
                            Gå vidare
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TradeInCarDefinition;