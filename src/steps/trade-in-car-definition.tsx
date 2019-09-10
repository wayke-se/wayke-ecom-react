import React, { useState } from 'react';

import { validateRegistrationNumber, validateMilage } from '../utils/validation';
import { IEcomLifecycle, IEcomStore, IEcomContext } from '../types';
import StoreAction from '../constants/store-action';
import { validateTradeIn } from '../tools/data-validation';

import Alert from '../components/alert';
import Spinner from '../components/spinner';
import { handleEnterPress } from '../utils/events';

export interface ITradeInCarDefinitionProps extends IEcomContext, IEcomStore, IEcomLifecycle {
};

const TradeInCarDefinition = (props: ITradeInCarDefinitionProps) => {
    const [hasRequestError, setHasRequestError] = useState(false);

    const handleInputChange = (e) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'tradeInCar',
            name: e.target.name,
            value: e.target.value
        });
    };

    const handleBlur = (e) => {
        props.dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, { type: 'tradeInCar', name: e.target.name });
    };

    const handleNextStepClick = () => {
        const isValidData = validateTradeIn(props.data.tradeInCar);

        if (!isValidData) {
            return props.dispatchStoreAction(StoreAction.INTERACT_SET_ALL_FOR_TYPE, 'tradeInCar');
        }

        setHasRequestError(false);

        props.onFetchVehicleInformation((isSuccessful: boolean) => {
            if (isSuccessful) {
                props.onProceedToNextStep();
            } else {
                setHasRequestError(true);
            }
        });
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
                        <div className="form-alert">Ett giltigt registreringsnummer behöver anges</div>
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
                                    onBlur={handleBlur}
                                    onKeyPress={(e: React.KeyboardEvent) => handleEnterPress(e, handleNextStepClick)} />
                        </div>
                        <div className="form-alert">Mellan 0 och 80 000 mil</div>
                    </div>
                </div>
            </section>

            { hasRequestError &&
                <section className="page-section">
                    <Alert message={`Tyvärr fick vi ingen träff på registreringsnumret ${props.data.tradeInCar.registrationNumber}. Prova gärna med ett annat registreringsnummer.`} />
                </section>
            }

            { !props.isWaitingForResponse &&
                <section className="page-section page-section-bottom">
                    <div data-ecom-buttonnav="">
                        <div className="button-nav-item" onClick={handleNextStepClick}>
                            <button data-ecom-button="full-width">
                                Gå vidare
                            </button>
                        </div>
                    </div>
                </section>
            }

            { props.isWaitingForResponse &&
                <section className="page-section">
                    <Spinner />
                </section>
            }
        </div>
    );
};

export default TradeInCarDefinition;