import React from 'react';

import CustomerInformationInputType from '../enums/customer-information-input-type';
import { validateEmail, validateSSN, validateZip } from '../../../../../utils/validation';

const AutomaticContent = (props) => {
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

const ManualContent = (props) => {
    const hasPersonalNumberError = props.interact.customerPersonalNumber && !validateSSN(props.customerPersonalNumber);
    const hasNameError = props.interact.customerName && !props.customerName;
    const hasAdressError = props.interact.customerAdress && !props.customerAdress;
    const hasZipError = props.interact.customerZip && !validateZip(props.customerZip);
    const hasCityError = props.interact.customerCity && !props.customerCity;

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
                            value={props.customerPersonalNumber || ''}
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
                            value={props.customerName}
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
                            value={props.customerAdress}
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
                            value={props.customerZip}
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
                            value={props.customerCity}
                            onChange={props.onInputChange}
                            onBlur={props.onInputBlur} />
                    </div>

                    <div className="alert">Fel format</div>
                </div>
            </div>
        </section>
    );
};

const CustomerInformationDetails = (props) => {
    const hasEmailError = props.interact.customerEmail && !validateEmail(props.customerEmail);
    const hasPhoneError = props.interact.customerPhone && !props.customerPhone;
    const hasTermsError = props.interact.hasAcceptedTerms && !props.hasAcceptedTerms;

    return (
        <div data-am-page="">
            <section className="page-section">
                <h1 className="h6">Kunduppgifter</h1>
                <div data-am-content="">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.</p>
                </div>
            </section>

            { props.customerInformationInputType === CustomerInformationInputType.AUTOMATIC &&
                <AutomaticContent {...props} />
            }

            { props.customerInformationInputType === CustomerInformationInputType.MANUAL &&
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
                                value={props.customerEmail}
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
                                value={props.customerPhone}
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
                                checked={props.hasAcceptedTerms}
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