import React from 'react';

import CustomerInformationInputType from '../enums/customer-information-input-type';
import { validateEmail, validateSSN, validateZip } from '../utils/validation';
import { IEcomLifecycle, IEcomStore } from '../types';
import StoreAction from '../enums/store-action';

export interface ICustomerInformationDetailsProps extends IEcomStore, IEcomLifecycle {
};

const handleInputChange = (props: ICustomerInformationDetailsProps, e: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
        type: 'customer',
        name: e.target.name,
        value: e.target.value
    });
};

const handleCheckboxChange = (props: ICustomerInformationDetailsProps, e: React.ChangeEvent<HTMLInputElement>) => {
    props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
        type: 'customer',
        name: e.target.name,
        value: e.target.checked
    });
}

const handleBlur = (props: ICustomerInformationDetailsProps, e: React.FocusEvent<HTMLInputElement>) => {
    props.dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, { type: 'customer', name: e.target.name });
};

const AutomaticContent = (props: ICustomerInformationDetailsProps) => {
    return (
        <React.Fragment>
            <section className="page-section page-section-border">
                <div data-am-columnrow="" className="font-size-small m-b-half">
                    <div className="column">
                        <div className="font-medium">Personnummer</div>
                    </div>
                    <div className="column">
                        <button data-am-link="font-inerit" onClick={() => props.onShowCustomerInformationInitial()}>Ändra</button>
                    </div>
                </div>
                <div className="m-t-half">
                    <i className="icon-profile m-r-half"></i>19870603-4852
                </div>
            </section>

            <section className="page-section page-section-border">
                <div data-am-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">För- och efternamn</div>
                    </div>
                    <div className="column">J*** D**</div>
                </div>

                <div data-am-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">Gatuadress</div>
                    </div>
                    <div className="column">B******* 5</div>
                </div>

                <div data-am-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">Postnummer</div>
                    </div>
                    <div className="column">*** 55</div>
                </div>

                <div data-am-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">Postort</div>
                    </div>
                    <div className="column">G*******</div>
                </div>
            </section>
        </React.Fragment>
    );
};

const ManualContent = (props: ICustomerInformationDetailsProps) => {
    const hasPersonalNumberError = props.data.interact.customer.personalNumber && !validateSSN(props.data.customer.personalNumber);
    const hasNameError = props.data.interact.customer.name && !props.data.customer.name;
    const hasAdressError = props.data.interact.customer.adress && !props.data.customer.adress;
    const hasZipError = props.data.interact.customer.zip && !validateZip(props.data.customer.zip);
    const hasCityError = props.data.interact.customer.city && !props.data.customer.city;

    return (
        <section className="page-section">
            <div data-am-form="">
                <div className={`form-group ${hasPersonalNumberError ? ' has-error' : ''}`}>
                    <label data-am-inputlabel="" htmlFor="information-2-input-personalnr">Personnummer</label>

                    <div data-am-inputtext="">
                        <input type="text"
                            id="information-2-input-personalnr"
                            name="personalNumber"
                            placeholder="ÅÅÅÅMMDD-XXXX"
                            value={props.data.customer.personalNumber || ''}
                            onChange={(e) => { handleInputChange(props, e) }}
                            onBlur={(e) => handleBlur(props, e)} />
                    </div>

                    <div className="alert">Fel format</div>
                </div>

                <div className={`form-group ${hasNameError ? ' has-error' : ''}`}>
                    <label data-am-inputlabel="" htmlFor="information-2-input-name">För- och efternamn</label>

                    <div data-am-inputtext="">
                        <input type="text"
                            id="information-2-input-name"
                            name="name"
                            placeholder="Förnamn Efternamn"
                            value={props.data.customer.name}
                            onChange={(e) => { handleInputChange(props, e) }}
                            onBlur={(e) => handleBlur(props, e)} />
                    </div>

                    <div className="alert">Fel format</div>
                </div>

                <div className={`form-group ${hasAdressError ? ' has-error' : ''}`}>
                    <label data-am-inputlabel="" htmlFor="information-2-input-street">Gatuadress</label>

                    <div data-am-inputtext="">
                        <input type="text"
                            id="information-2-input-street"
                            name="adress"
                            placeholder="Gatuadress"
                            value={props.data.customer.adress}
                            onChange={(e) => { handleInputChange(props, e) }}
                            onBlur={(e) => handleBlur(props, e)} />
                    </div>

                    <div className="alert">Fel format</div>
                </div>

                <div className={`form-group ${hasZipError ? ' has-error' : ''}`}>
                    <label data-am-inputlabel="" htmlFor="information-2-input-zip">Postnummer</label>

                    <div data-am-inputtext="">
                        <input type="text"
                            id="information-2-input-zip"
                            name="zip"
                            placeholder="XXX XX"
                            value={props.data.customer.zip}
                            onChange={(e) => { handleInputChange(props, e) }}
                            onBlur={(e) => handleBlur(props, e)} />
                    </div>

                    <div className="alert">Fel format</div>
                </div>

                <div className={`form-group ${hasCityError ? ' has-error' : ''}`}>
                    <label data-am-inputlabel="" htmlFor="information-2-input-city">Postort</label>

                    <div data-am-inputtext="">
                        <input type="text"
                            id="information-2-input-city"
                            name="city"
                            placeholder="Postort"
                            value={props.data.customer.city}
                            onChange={(e) => { handleInputChange(props, e) }}
                            onBlur={(e) => handleBlur(props, e)} />
                    </div>

                    <div className="alert">Fel format</div>
                </div>
            </div>
        </section>
    );
};

const CustomerInformationDetails = (props: ICustomerInformationDetailsProps) => {
    const hasEmailError = props.data.interact.customer.email && !validateEmail(props.data.customer.email);
    const hasPhoneError = props.data.interact.customer.phone && !props.data.customer.phone;
    const hasTermsError = props.data.interact.customer.hasAcceptedTerms && !props.data.customer.hasAcceptedTerms;

    return (
        <div data-am-page="">
            <section className="page-section">
                <h1 className="h6">Kunduppgifter</h1>
                <div data-am-content="">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.</p>
                </div>
            </section>

            { props.data.customer.inputType === CustomerInformationInputType.AUTOMATIC &&
                <AutomaticContent {...props} />
            }

            { props.data.customer.inputType === CustomerInformationInputType.MANUAL &&
                <ManualContent {...props} />
            }

            <section className="page-section">
                <div data-am-form="">
                    <div className={`form-group ${hasEmailError ? ' has-error' : ''}`}>
                        <label data-am-inputlabel="" htmlFor="information-2-input-email">E-post</label>

                        <div data-am-inputtext="">
                            <input type="text"
                                id="information-2-input-email"
                                name="email"
                                placeholder="E-postadress"
                                value={props.data.customer.email}
                                onChange={(e) => { handleInputChange(props, e) }}
                                onBlur={(e) => handleBlur(props, e)} />
                        </div>

                        <div className="alert">Fel format</div>
                    </div>

                    <div className={`form-group ${hasPhoneError ? ' has-error' : ''}`}>
                        <label data-am-inputlabel="" htmlFor="information-2-input-phone">Telefonnummer</label>

                        <div data-am-inputtext="">
                            <input type="text"
                                id="information-2-input-phone"
                                name="phone"
                                placeholder="Telefonnummer"
                                value={props.data.customer.phone}
                                onChange={(e) => { handleInputChange(props, e) }}
                                onBlur={(e) => handleBlur(props, e)} />
                        </div>

                        <div className="alert">Fel format</div>
                    </div>

                    <div className={`form-group ${hasTermsError ? ' has-error' : ''}`}>
                        <div data-am-inputselection="checkbox">
                            <input type="checkbox"
                                id="information-2-checkbox"
                                name="hasAcceptedTerms"
                                checked={props.data.customer.hasAcceptedTerms}
                                onChange={(e) => { handleCheckboxChange(props, e) }}
                                onBlur={(e) => handleBlur(props, e)} />

                            <label htmlFor="information-2-checkbox">
                                <span className="text">Jag godkänner användarvillkoren</span>
                            </label>

                            <div className="alert">Användarvillkoren behöver godkännas för att gå vidare</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section page-section-bottom">
                <div data-am-buttonnav="">
                    <div className="button-nav-item">
                        <div data-am-button="full-width" onClick={props.onNextStepClick}>
                            Gå vidare
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CustomerInformationDetails;