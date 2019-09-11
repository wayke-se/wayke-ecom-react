import React, { useEffect, useState } from 'react';

import CustomerInformationInputType from '../constants/customer-information-input-type';
import StoreAction from '../constants/store-action';

import { validatePersonalNumber } from '../utils/validation';
import { IEcomLifecycle, IEcomStore, IEcomData, IEcomContext } from '../types';

import { createCustomerObject } from '../tools/data-creator';
import { validateCustomerObjectPersonalNumber } from '../tools/data-validation';

import Alert from '../components/alert';
import Spinner from '../components/spinner';
import { handleEnterPress } from '../utils/events';

export interface ICustomerInformationInitialProps extends IEcomContext, IEcomStore, IEcomLifecycle {
};

const CustomerInformationInitial = (props: ICustomerInformationInitialProps) => {
    const [hasRequestError, setHasRequestError] = useState(false);

    useEffect(() => {
        const insurance = props.data.insurance;
        const customer = props.data.customer;

        const shouldUpdateCustomerPersonalNumber = insurance.personalNumber && customer.personalNumber === null;

        if (shouldUpdateCustomerPersonalNumber) {
            props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
                type: 'customer',
                name: 'personalNumber',
                value: insurance.personalNumber
            });
        }
    });

    const handleInputChange = (e) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'customer',
            name: e.target.name,
            value: e.target.value
        });
    };

    const handleBlur = (e) => {
        props.dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, { type: 'customer', name: e.target.name });
    };

    const handleProceedWithAutomaticLookup = (state: IEcomData) => {
        const customerObject = createCustomerObject(state.customer, null);
        const isValidPersonalNumber = validateCustomerObjectPersonalNumber(customerObject);

        if (!isValidPersonalNumber) {
            return props.dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, { type: 'customer', name: 'personalNumber' });
        }

        setHasRequestError(false);

        props.onFetchAddressInformation((isSuccessful: boolean) => {
            if (isSuccessful) {
                props.onProceedToNextStep();
            } else {
                setHasRequestError(true);
            }
        });
    };

    const handleInputTypeClick = (inputType: CustomerInformationInputType) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'customer',
            name: 'inputType',
            value: inputType
        }, (state: IEcomData) => {
            const isAutomatic = inputType === CustomerInformationInputType.AUTOMATIC;

            if (isAutomatic) {
                handleProceedWithAutomaticLookup(state);
            } else {
                props.onProceedToNextStep();
            }
        });
    };

    const hasPersonalNumberError = props.data.interact.customer.personalNumber && !validatePersonalNumber(props.data.customer.personalNumber);

    return (
        <div data-ecom-page="">
            <section className="page-section">
                <h1 className="h6">Kunduppgifter</h1>
                <div data-ecom-content="">
                    <p>Hämta dina uppgifter via personnummer eller skriv in dem manuellt.</p>
                </div>
            </section>

            <section className="page-section">
                <div data-ecom-form="">
                    <div className={`form-group ${hasPersonalNumberError ? ' has-error' : ''}`}>
                        <label data-ecom-inputlabel="" htmlFor="information-1-input-personalnr">Personnummer</label>

                        <div data-ecom-inputtext="">
                            <input type="text"
                                id="information-1-input-personalnr"
                                name="personalNumber"
                                placeholder="ÅÅÅÅMMDD-XXXX"
                                value={props.data.customer.personalNumber || ''}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                onKeyPress={(e: React.KeyboardEvent) => handleEnterPress(e, () => handleInputTypeClick(CustomerInformationInputType.AUTOMATIC)) } />
                        </div>

                        <div className="form-alert">Ange personnummer i formatet ÅÅÅÅMMDD-XXXX</div>
                    </div>

                    { hasRequestError &&
                        <div className="form-group">
                            <Alert message={`Tyvärr fick vi ingen träff på personnumret du angav.`} />
                        </div>
                    }

                    { !props.isWaitingForResponse &&
                        <div className="form-group">
                            <button data-ecom-button="light full-width" onClick={() => handleInputTypeClick(CustomerInformationInputType.AUTOMATIC)}>
                                Hämta uppgifter
                            </button>
                        </div>
                    }

                    { props.isWaitingForResponse &&
                        <div className="form-group">
                            <Spinner />
                        </div>
                    }
                </div>
            </section>

            <section className="page-section text-center" onClick={() => handleInputTypeClick(CustomerInformationInputType.MANUAL)}>
                <button data-ecom-link="action">Jag vill fylla i mina uppgifter manuellt</button>
            </section>
        </div>
    );
};

export default CustomerInformationInitial;