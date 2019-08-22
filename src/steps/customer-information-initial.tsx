import React from 'react';

import CustomerInformationInputType from '../enums/customer-information-input-type';
import StoreAction from '../enums/store-action';

import { validateSSN } from '../utils/validation';
import { IEcomLifecycle, IEcomStore } from '../types';

export interface ICustomerInformationInitialProps extends IEcomStore, IEcomLifecycle {
};

const CustomerInformationInitial = (props: ICustomerInformationInitialProps) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'customer',
            name: e.target.name,
            value: e.target.value
        });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        props.dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, { type: 'customer', name: e.target.name });
    };

    const handleInputTypeClick = (inputType: CustomerInformationInputType) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'customer',
            name: 'inputType',
            value: inputType
        }, () => {
            props.onNextStepClick();
        });
    };

    const hasPersonalNumberError = props.data.interact.customer.personalNumber && !validateSSN(props.data.customer.personalNumber);

    return (
        <div data-am-page="">
            <section className="page-section">
                <h1 className="h6">Kunduppgifter</h1>
                <div data-am-content="">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.</p>
                </div>
            </section>

            <section className="page-section">
                <div data-am-form="">
                    <div className={`form-group ${hasPersonalNumberError ? ' has-error' : ''}`}>
                        <label data-am-inputlabel="" htmlFor="information-1-input-personalnr">Personnummer</label>

                        <div data-am-inputtext="">
                            <input type="text"
                                id="information-1-input-personalnr"
                                name="personalNumber"
                                placeholder="ÅÅÅÅMMDD-XXXX"
                                value={props.data.customer.personalNumber || ''}
                                onChange={handleInputChange}
                                onBlur={handleBlur} />
                        </div>

                        <div className="alert">Fel format</div>
                    </div>

                    <div className="form-group">
                        <div data-am-button="light full-width" onClick={() => handleInputTypeClick(CustomerInformationInputType.AUTOMATIC)}>
                            Hämta uppgifter
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <button data-am-link="" onClick={() => handleInputTypeClick(CustomerInformationInputType.MANUAL)}>Jag vill fylla i mina uppgifter manuellt</button>
            </section>
        </div>
    );
};

export default CustomerInformationInitial;