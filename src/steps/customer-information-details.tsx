import React, { ChangeEvent, FocusEvent } from 'react';

import CustomerInformationInputType from '../enums/customer-information-input-type';
import { validateEmail, validateSSN, validateZip } from '../utils/validation';
import { ICustomerData, IEcomLifecycle, IEcomContext, IInteractData } from '../types';

export interface ICustomerInformationDetailsProps extends IEcomLifecycle {
    customer: ICustomerData;
    context: IEcomContext;
    interact: IInteractData;

    onTermsToggle: () => void;
    onShowCustomerInformationInitial: () => void;
};

interface IAutomaticContentProps extends IEcomLifecycle {
    onShowCustomerInformationInitial: () => void;
};

interface IManualContentProps extends IEcomLifecycle {
    customer: ICustomerData;
    interact: IInteractData;
};

const AutomaticContent = (props: IAutomaticContentProps) => {
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

const ManualContent = (props: IManualContentProps) => {
    const hasPersonalNumberError = props.interact.customer.personalNumber && !validateSSN(props.customer.personalNumber);
    const hasNameError = props.interact.customer.name && !props.customer.name;
    const hasAdressError = props.interact.customer.adress && !props.customer.adress;
    const hasZipError = props.interact.customer.zip && !validateZip(props.customer.zip);
    const hasCityError = props.interact.customer.city && !props.customer.city;

    return (
        <section className="page-section">
            <div data-am-form="">
                <div className={`form-group ${hasPersonalNumberError ? ' has-error' : ''}`}>
                    <label data-am-inputlabel="" htmlFor="information-2-input-personalnr">Personnummer</label>

                    <div data-am-inputtext="">
                        <input type="text"
                            id="information-2-input-personalnr"
                            name="customerPersonalNumber"
                            placeholder="ÅÅÅÅMMDD-XXXX"
                            value={props.customer.personalNumber || ''}
                            onChange={props.onInputChange}
                            onBlur={props.onInputBlur} />
                    </div>

                    <div className="alert">Fel format</div>
                </div>

                <div className={`form-group ${hasNameError ? ' has-error' : ''}`}>
                    <label data-am-inputlabel="" htmlFor="information-2-input-name">För- och efternamn</label>

                    <div data-am-inputtext="">
                        <input type="text"
                            id="information-2-input-name"
                            name="customerName"
                            placeholder="Förnamn Efternamn"
                            value={props.customer.name}
                            onChange={props.onInputChange}
                            onBlur={props.onInputBlur} />
                    </div>

                    <div className="alert">Fel format</div>
                </div>

                <div className={`form-group ${hasAdressError ? ' has-error' : ''}`}>
                    <label data-am-inputlabel="" htmlFor="information-2-input-street">Gatuadress</label>

                    <div data-am-inputtext="">
                        <input type="text"
                            id="information-2-input-street"
                            name="customerAdress"
                            placeholder="Gatuadress"
                            value={props.customer.adress}
                            onChange={props.onInputChange}
                            onBlur={props.onInputBlur} />
                    </div>

                    <div className="alert">Fel format</div>
                </div>

                <div className={`form-group ${hasZipError ? ' has-error' : ''}`}>
                    <label data-am-inputlabel="" htmlFor="information-2-input-zip">Postnummer</label>

                    <div data-am-inputtext="">
                        <input type="text"
                            id="information-2-input-zip"
                            name="customerZip"
                            placeholder="XXX XX"
                            value={props.customer.zip}
                            onChange={props.onInputChange}
                            onBlur={props.onInputBlur} />
                    </div>

                    <div className="alert">Fel format</div>
                </div>

                <div className={`form-group ${hasCityError ? ' has-error' : ''}`}>
                    <label data-am-inputlabel="" htmlFor="information-2-input-city">Postort</label>

                    <div data-am-inputtext="">
                        <input type="text"
                            id="information-2-input-city"
                            name="customerCity"
                            placeholder="Postort"
                            value={props.customer.city}
                            onChange={props.onInputChange}
                            onBlur={props.onInputBlur} />
                    </div>

                    <div className="alert">Fel format</div>
                </div>
            </div>
        </section>
    );
};

const CustomerInformationDetails = (props: ICustomerInformationDetailsProps) => {
    const hasEmailError = props.interact.customer.email && !validateEmail(props.customer.email);
    const hasPhoneError = props.interact.customer.phone && !props.customer.phone;
    const hasTermsError = props.interact.context.hasAcceptedTerms && !props.context.hasAcceptedTerms;

    return (
        <div data-am-page="">
            <section className="page-section">
                <h1 className="h6">Kunduppgifter</h1>
                <div data-am-content="">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.</p>
                </div>
            </section>

            { props.customer.inputType === CustomerInformationInputType.AUTOMATIC &&
                <AutomaticContent {...props} />
            }

            { props.customer.inputType === CustomerInformationInputType.MANUAL &&
                <ManualContent {...props} />
            }

            <section className="page-section">
                <div data-am-form="">
                    <div className={`form-group ${hasEmailError ? ' has-error' : ''}`}>
                        <label data-am-inputlabel="" htmlFor="information-2-input-email">E-post</label>

                        <div data-am-inputtext="">
                            <input type="text"
                                id="information-2-input-email"
                                name="customerEmail"
                                placeholder="E-postadress"
                                value={props.customer.email}
                                onChange={props.onInputChange}
                                onBlur={props.onInputBlur} />
                        </div>

                        <div className="alert">Fel format</div>
                    </div>

                    <div className={`form-group ${hasPhoneError ? ' has-error' : ''}`}>
                        <label data-am-inputlabel="" htmlFor="information-2-input-phone">Telefonnummer</label>

                        <div data-am-inputtext="">
                            <input type="text"
                                id="information-2-input-phone"
                                name="customerPhone"
                                placeholder="Telefonnummer"
                                value={props.customer.phone}
                                onChange={props.onInputChange}
                                onBlur={props.onInputBlur} />
                        </div>

                        <div className="alert">Fel format</div>
                    </div>

                    <div className={`form-group ${hasTermsError ? ' has-error' : ''}`}>
                        <div data-am-inputselection="checkbox">
                            <input type="checkbox"
                                id="information-2-checkbox"
                                name="hasAcceptedTerms"
                                checked={props.context.hasAcceptedTerms}
                                onChange={props.onTermsToggle}
                                onBlur={props.onInputBlur} />

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