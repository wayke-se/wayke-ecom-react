import React from 'react';

import CustomerInformationInputType from '../constants/customer-information-input-type';
import StoreAction from '../constants/store-action';

import { validateEmail, validateZip, validatePhoneNumber } from '../utils/validation';
import { IEcomLifecycle, IEcomStore, IEcomContext, IEcomExternalProps } from '../types';
import { validateEcomData } from '../tools/data-validation';

import Alert from '../components/alert';
import Spinner from '../components/spinner';
import OrderSummary from '../components/order-summary';
import UserEvent from '../constants/user-event';

export interface ICustomerInformationDetailsProps extends IEcomExternalProps, IEcomContext, IEcomStore, IEcomLifecycle {
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
    const address = props.addressLookup.getAddress();

    return (
        <React.Fragment>
            <section className="page-section page-section-border">
                <div data-ecom-columnrow="" className="font-size-small m-b-half">
                    <div className="column">
                        <div className="font-medium">Personnummer</div>
                    </div>
                    <div className="column">
                        <button data-ecom-link="font-inerit" onClick={() => props.onShowCustomerInformationInitial()}>Ändra</button>
                    </div>
                </div>
                <div className="m-t-half">
                    <i className="icon-profile m-r-half"></i>{props.data.customer.personalNumber}
                </div>
            </section>

            <section className="page-section page-section-border">
                <div data-ecom-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">För- och efternamn</div>
                    </div>
                    <div className="column">{address.name}</div>
                </div>

                <div data-ecom-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">Gatuadress</div>
                    </div>
                    <div className="column">{address.street}</div>
                </div>

                <div data-ecom-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">Postnummer</div>
                    </div>
                    <div className="column">{address.postalCode}</div>
                </div>

                <div data-ecom-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">Postort</div>
                    </div>
                    <div className="column">{address.city}</div>
                </div>
            </section>
        </React.Fragment>
    );
};

const ManualContent = (props: ICustomerInformationDetailsProps) => {
    const hasNameError = props.data.interact.customer.name && !props.data.customer.name;
    const hasAddressError = props.data.interact.customer.address && !props.data.customer.address;
    const hasZipError = props.data.interact.customer.zip && !validateZip(props.data.customer.zip);
    const hasCityError = props.data.interact.customer.city && !props.data.customer.city;

    return (
        <section className="page-section">
            <div data-ecom-form="">
                <div className={`form-group ${hasNameError ? ' has-error' : ''}`}>
                    <label data-ecom-inputlabel="" htmlFor="information-2-input-name">För- och efternamn</label>

                    <div data-ecom-inputtext="">
                        <input type="text"
                            id="information-2-input-name"
                            name="name"
                            placeholder="Förnamn Efternamn"
                            value={props.data.customer.name}
                            onChange={(e) => { handleInputChange(props, e) }}
                            onBlur={(e) => handleBlur(props, e)} />
                    </div>

                    <div className="form-alert">För- och efternamn måste anges</div>
                </div>

                <div className={`form-group ${hasAddressError ? ' has-error' : ''}`}>
                    <label data-ecom-inputlabel="" htmlFor="information-2-input-street">Gatuadress</label>

                    <div data-ecom-inputtext="">
                        <input type="text"
                            id="information-2-input-street"
                            name="address"
                            placeholder="Gatuadress"
                            value={props.data.customer.address}
                            onChange={(e) => { handleInputChange(props, e) }}
                            onBlur={(e) => handleBlur(props, e)} />
                    </div>

                    <div className="form-alert">Gatuadress måste anges</div>
                </div>

                <div className={`form-group ${hasZipError ? ' has-error' : ''}`}>
                    <label data-ecom-inputlabel="" htmlFor="information-2-input-zip">Postnummer</label>

                    <div data-ecom-inputtext="">
                        <input type="text"
                            id="information-2-input-zip"
                            name="zip"
                            placeholder="XXX XX"
                            value={props.data.customer.zip}
                            onChange={(e) => { handleInputChange(props, e) }}
                            onBlur={(e) => handleBlur(props, e)} />
                    </div>

                    <div className="form-alert">Ange postnummer i formatet "XXX XX"</div>
                </div>

                <div className={`form-group ${hasCityError ? ' has-error' : ''}`}>
                    <label data-ecom-inputlabel="" htmlFor="information-2-input-city">Postort</label>

                    <div data-ecom-inputtext="">
                        <input type="text"
                            id="information-2-input-city"
                            name="city"
                            placeholder="Postort"
                            value={props.data.customer.city}
                            onChange={(e) => { handleInputChange(props, e) }}
                            onBlur={(e) => handleBlur(props, e)} />
                    </div>

                    <div className="form-alert">Postort måste anges</div>
                </div>
            </div>
        </section>
    );
};

const CustomerInformationDetails = (props: ICustomerInformationDetailsProps) => {
    const [isExtended, setIsExtended] = React.useState(false);
    const [hasRequestError, setHasRequestError] = React.useState(false);

    const isAutomatic = props.data.customer.inputType === CustomerInformationInputType.AUTOMATIC;

    const handleCreateOrderClick = () => {
        const isValidData = validateEcomData(props.data, props.addressLookup, props.orderOptions, props.paymentLookup);

        if (!isValidData) {
            return props.dispatchStoreAction(StoreAction.INTERACT_SET_ALL_FOR_TYPE, 'customer');
        }

        setHasRequestError(false);

        props.onCreateOrder((isSuccessful: boolean) => {
            if (!isSuccessful) {
                setHasRequestError(true);
                return;
            }

            if (isAutomatic) {
                props.onIncompleteUserEvent(UserEvent.CUSTOMER_DETAILS_AUTOMATIC_CHOSEN);
            } else {
                props.onIncompleteUserEvent(UserEvent.CUSTOMER_DETAILS_MANUAL_CHOSEN);
            }

            props.onIncompleteUserEvent(UserEvent.ORDER_CREATED);
            props.onProceedToNextStep();
        });
    }

    const handleShowTermsClick = () => {
        setIsExtended(!isExtended);
    };

    const hasEmailError = props.data.interact.customer.email && !validateEmail(props.data.customer.email);
    const hasPhoneError = props.data.interact.customer.phone && !validatePhoneNumber( props.data.customer.phone);
    const hasTermsError = props.data.interact.customer.hasAcceptedTerms && !props.data.customer.hasAcceptedTerms;

    const conditions = props.orderOptions.getOrderConditions();

    return (
        <div data-ecom-page="">
            <section className="page-section">
                <h1 className="h6">Kunduppgifter</h1>
            </section>

            { isAutomatic &&
                <AutomaticContent {...props} />
            }

            { !isAutomatic &&
                <ManualContent {...props} />
            }

            <section className="page-section">
                <div data-ecom-form="">
                    <div className={`form-group ${hasEmailError ? ' has-error' : ''}`}>
                        <label data-ecom-inputlabel="" htmlFor="information-2-input-email">E-post</label>

                        <div data-ecom-inputtext="">
                            <input type="text"
                                id="information-2-input-email"
                                name="email"
                                placeholder="E-postadress"
                                value={props.data.customer.email}
                                onChange={(e) => { handleInputChange(props, e) }}
                                onBlur={(e) => handleBlur(props, e)} />
                        </div>

                        <div className="form-alert">En giltig e-postadress måste anges</div>
                    </div>

                    <div className={`form-group ${hasPhoneError ? ' has-error' : ''}`}>
                        <label data-ecom-inputlabel="" htmlFor="information-2-input-phone">Telefonnummer</label>

                        <div data-ecom-inputtext="">
                            <input type="text"
                                id="information-2-input-phone"
                                name="phone"
                                placeholder="07X-XXXXXXX"
                                value={props.data.customer.phone}
                                onChange={(e) => { handleInputChange(props, e) }}
                                onBlur={(e) => handleBlur(props, e)} />
                        </div>

                        <div className="form-alert">Ange ditt telefonnummer</div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <div data-ecom-form="">
                    <div className={`form-group ${hasTermsError ? ' has-error' : ''}`}>
                        <div data-ecom-inputselection="checkbox">
                            <input type="checkbox"
                                id="checkbox-summary-terms"
                                name="hasAcceptedTerms"
                                checked={props.data.customer.hasAcceptedTerms}
                                onChange={(e) => { handleCheckboxChange(props, e) }}
                                onBlur={(e) => handleBlur(props, e)} />

                            <label htmlFor="checkbox-summary-terms">
                                <span className="text">Jag godkänner <button data-ecom-link="" className="valign-baseline" onClick={handleShowTermsClick}>köpvillkoren</button></span>
                            </label>

                            <div className="form-alert">Köpvillkoren behöver godkännas för att gå vidare</div>
                        </div>
                    </div>
                </div>

                { isExtended &&
                    <div data-ecom-scrollbox="" className="m-t">
                        <article data-ecom-content="small-headings">
                            <h1>Köpvillkor</h1>
                            <p>{conditions}</p>
                        </article>
                    </div>
                }
            </section>

            { hasRequestError &&
                <section className="page-section">
                    <Alert message="Tyvärr gick någonting fel. Prova gärna igen om en liten stund." />
                </section>
            }

            { !props.isWaitingForResponse &&
                <section className="page-section page-section-bottom">
                    <div data-ecom-buttonnav="">
                        <div className="button-nav-item">
                            <button data-ecom-button="full-width" onClick={handleCreateOrderClick}>
                                Genomför köp
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

            <section className="page-section page-section-accent">
                <div className="page-section-accent-content">
                    <h2 className="h6">Din order</h2>
                </div>

                <OrderSummary {...props} />
            </section>
        </div>
    );
};

export default CustomerInformationDetails;