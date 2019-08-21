import React from 'react';

import { validateSSN } from '../utils/validation';
import CustomerInformationInputType from '../enums/customer-information-input-type';

import { IInteractData, IEcomLifecycle, ICustomerData } from '../types';

export interface ICustomerInformationInitialProps extends IEcomLifecycle {
    customer: ICustomerData;
    interact: IInteractData;

    onCustomerInformationInputTypeChange: (type: CustomerInformationInputType) => void;
};

const CustomerInformationInitial = (props: ICustomerInformationInitialProps) => {
    const hasPersonalNumberError = props.interact.customer.personalNumber && !validateSSN(props.customer.personalNumber);

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
                                name="customerPersonalNumber"
                                placeholder="ÅÅÅÅMMDD-XXXX"
                                value={props.customer.personalNumber || ''}
                                onChange={props.onInputChange}
                                onBlur={props.onInputBlur} />
                        </div>

                        <div className="alert">Fel format</div>
                    </div>

                    <div className="form-group">
                        <div data-am-button="light full-width" onClick={() => props.onCustomerInformationInputTypeChange(CustomerInformationInputType.AUTOMATIC)}>
                            Hämta uppgifter
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <button data-am-link="" onClick={() => props.onCustomerInformationInputTypeChange(CustomerInformationInputType.MANUAL)}>Jag vill fylla i mina uppgifter manuellt</button>
            </section>
        </div>
    );
};

export default CustomerInformationInitial;