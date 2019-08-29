import React from 'react';

import CustomerInformationInputType from '../constants/customer-information-input-type';
import StoreAction from '../constants/store-action';

import { validatePersonalNumber } from '../utils/validation';
import { IEcomLifecycle, IEcomStore } from '../types';

export interface ICustomerInformationInitialProps extends IEcomStore, IEcomLifecycle {
};

class CustomerInformationInitial extends React.Component<ICustomerInformationInitialProps> {
    constructor(props: ICustomerInformationInitialProps) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleInputTypeClick = this.handleInputTypeClick.bind(this);
    }

    componentDidMount() {
        const insurance = this.props.data.insurance;
        const customer = this.props.data.customer;

        const shouldUpdateCustomerPersonalNumber = insurance.personalNumber && !customer.personalNumber;

        if (shouldUpdateCustomerPersonalNumber) {
            this.props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
                type: 'customer',
                name: 'personalNumber',
                value: insurance.personalNumber
            });
        }
    }

    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'customer',
            name: e.target.name,
            value: e.target.value
        });
    };

    handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        this.props.dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, { type: 'customer', name: e.target.name });
    };

    handleInputTypeClick(inputType: CustomerInformationInputType) {
        this.props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'customer',
            name: 'inputType',
            value: inputType
        }, () => {
            this.props.onNextStepClick();
        });
    };

    render () {
        const hasPersonalNumberError = this.props.data.interact.customer.personalNumber && !validatePersonalNumber(this.props.data.customer.personalNumber);

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
                                    value={this.props.data.customer.personalNumber || ''}
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleBlur} />
                            </div>

                            <div className="form-alert">Fel format</div>
                        </div>

                        <div className="form-group">
                            <div data-ecom-button="light full-width" onClick={() => this.handleInputTypeClick(CustomerInformationInputType.AUTOMATIC)}>
                                Hämta uppgifter
                            </div>
                        </div>
                    </div>
                </section>

                <section className="page-section">
                    <button data-ecom-link="" onClick={() => this.handleInputTypeClick(CustomerInformationInputType.MANUAL)}>Jag vill fylla i mina uppgifter manuellt</button>
                </section>
            </div>
        );
    }
};

export default CustomerInformationInitial;