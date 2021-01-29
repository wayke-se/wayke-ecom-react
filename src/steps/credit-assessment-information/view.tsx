import React from "react";

const CreditAssessmentInformation = () => (
    <div data-ecom-page>
        <section className="page-section">
            <div data-ecom-columnrow>
                <div className="column">
                    <h1 className="h6">Gör klart din låneansökan</h1>
                    <div data-ecom-content>
                        <p>
                            Fyll i följande uppgifter om dig och ditt hushåll,
                            bekräfta och signera sedan med BankID för att få
                            ditt lånebesked.
                        </p>
                    </div>
                </div>
                <div className="column valign-top minimal">
                    <img
                        src="/assets/toolkit/images/audi-logo.png"
                        alt="Audi logotype"
                        className="l-block"
                    />
                </div>
            </div>
        </section>
        <section className="page-section">
            <div data-ecom-form>
                <div className="form-group">
                    <label
                        data-ecom-inputlabel
                        htmlFor="finance-input-personalnr"
                    >
                        Personnummer
                    </label>{" "}
                    <div data-ecom-inputtext>
                        <input
                            type="text"
                            id="finance-input-personalnr"
                            placeholder="ÅÅMMDD-XXXX"
                            // defaultValue
                        />
                    </div>
                </div>
                <div className="form-group-row">
                    <div className="form-group is-half">
                        <label
                            data-ecom-inputlabel
                            htmlFor="finance-input-email"
                        >
                            E-postadress
                        </label>{" "}
                        <div data-ecom-inputtext>
                            <input
                                type="text"
                                id="finance-input-email"
                                placeholder="E-postadress"
                                // defaultValue
                            />
                        </div>{" "}
                    </div>
                    <div className="form-group is-half">
                        <label
                            data-ecom-inputlabel
                            htmlFor="finance-input-phone"
                        >
                            Telefonnummer
                        </label>{" "}
                        <div data-ecom-inputtext>
                            <input
                                type="text"
                                id="finance-input-phone"
                                placeholder="Telefonnummer"
                                // defaultValue
                            />
                        </div>{" "}
                    </div>
                </div>
                <div className="form-group">
                    <label data-ecom-inputlabel htmlFor="finance-input-status">
                        Civilstatus
                    </label>{" "}
                    <div data-ecom-select>
                        <select className="select">
                            <option>Option 1</option>
                            <option>Option 2</option>
                            <option>Option 3</option>
                            <option>Option 4</option>
                            <option>Option 5</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label data-ecom-inputlabel htmlFor="finance-input-income">
                        Inkomst per månad före skatt (kr)
                    </label>{" "}
                    <div data-ecom-inputtext>
                        <input
                            type="text"
                            id="finance-input-income"
                            placeholder="Inkomst"
                            // defaultValue
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label
                        data-ecom-inputlabel
                        htmlFor="finance-input-employment"
                    >
                        Sysselsättning
                    </label>{" "}
                    <div data-ecom-select>
                        <select className="select">
                            <option>Option 1</option>
                            <option>Option 2</option>
                            <option>Option 3</option>
                            <option>Option 4</option>
                            <option>Option 5</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label
                        data-ecom-inputlabel
                        htmlFor="finance-input-children"
                    >
                        Antal hemmavarande barn
                    </label>{" "}
                    <div data-ecom-inputtext>
                        <input
                            type="text"
                            id="finance-input-children"
                            placeholder="Antal hemmavarande barn"
                            // defaultValue
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label
                        data-ecom-inputlabel
                        htmlFor="finance-input-familyincome"
                    >
                        Hushållets inkomst per månad före skatt (kr)
                    </label>{" "}
                    <div data-ecom-inputtext>
                        <input
                            type="text"
                            id="finance-input-familyincome"
                            placeholder="Inkomst"
                            // defaultValue
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label data-ecom-inputlabel htmlFor="finance-input-living">
                        Hushållets ungefärliga boendekostnad per månad (kr)
                    </label>{" "}
                    <div data-ecom-inputtext>
                        <input
                            type="text"
                            id="finance-input-living"
                            placeholder="Ungefärlig boendekostnad"
                            // defaultValue
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label data-ecom-inputlabel htmlFor="finance-input-debt">
                        Hushållets totala skulder (kr)
                    </label>{" "}
                    <div data-ecom-inputtext>
                        <input
                            type="text"
                            id="finance-input-debt"
                            placeholder="Hushållets totala skulder"
                            // defaultValue
                        />
                    </div>
                </div>
                <div className="form-group">
                    <div data-ecom-alert>
                        <div className="alert-icon-section">
                            <div className="alert-icon">
                                <i className="icon-info no-margin" />
                            </div>
                        </div>
                        <div className="alert-content">
                            I samband med att du går vidare med din ansökan
                            kommer en kreditupplysning att tas och du får svar
                            direkt. Blir du godkänd så gäller den genom hela
                            köpet, men din ansökan är inte bindande.
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div data-ecom-inputselection="checkbox">
                        <input type="checkbox" id="finance-checkbox-1" />
                        <label htmlFor="finance-checkbox-1">
                            <span className="text">
                                Jag har förstått{" "}
                                <a href="#" title="" data-ecom-link>
                                    villkoren
                                </a>{" "}
                                och accepterar dessa.
                            </span>
                        </label>
                    </div>
                    <div
                        data-ecom-inputselection="checkbox"
                        className="m-t-half"
                    >
                        <input type="checkbox" id="finance-checkbox-2" />
                        <label htmlFor="finance-checkbox-2">
                            <span className="text">
                                Jag har förstått{" "}
                                <a href="#" title="" data-ecom-link>
                                    integritetpolicyn
                                </a>{" "}
                                och godkänner denna.
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </section>
        <section className="page-section page-section-bottom">
            <button data-ecom-button="full-width">
                <div className="button-section">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 315.9 298.8"
                        className="button-icon"
                    >
                        <path d="M90.7 214.9H12.6c1.5-9.8 21-134 22.3-142.1h14.4c9.4-.1 18-4.4 22-11 3.9-6.4 2.4-13.3-3.9-17.9-2.1-1.5-4.5-4.1-4-7.2.6-4.2 7.8-10 17.9-10 6 0 10.7 1.3 13.1 3.6 1.7 1.6 2.3 3.7 1.8 6.1-.5 2.3-3.1 5.3-6.9 8-10.9 7.7-9 15.7-8.2 17.9 2.5 6.8 11 10.5 17.6 10.5h14.1L99.7 156h.2c-4.9 31.1-8.5 54.5-9.2 58.9zM204.2 0h-79.5l-10.6 67.3h13.5c7.4 0 14.4-3.4 17.4-8.3 1-1.6 1.4-3 1.4-4.3 0-2.8-1.9-4.9-3.8-6.3-5.2-3.9-6.3-8-6.3-10.9 0-.6 0-1.1.1-1.6 1.1-7.1 10.7-14.8 23.4-14.8 7.6 0 13.4 1.8 16.9 5.1 3.1 2.9 4.3 7 3.4 11.3-1.1 5.1-6.2 9.3-9.1 11.4-7.7 5.4-6.7 10.1-6.2 11.5 1.6 4.2 7.7 6.9 12.4 6.9h20.6v.1c28 .2 43 13.1 38.3 43.1-4.4 27.9-25.8 39.9-51.3 40.1L174.7 215h14.9c62.9 0 114.3-40.4 124.4-104.2C326.5 31.7 276.3 0 204.2 0zM56.3 256.8c-.8 5.1-4.3 8.9-10.3 11.4 7.6 2.9 10.6 7.4 9.5 14.5-1.4 8.9-9.1 15.5-19.2 15.5H0l8.4-54.5h31.9c13.6-.1 16.9 6.8 16 13.1zM29 274.5h-6.2l-2.4 15.3h5.8c6.4 0 10.1-2.6 11-7.9.6-4.6-2-7.4-8.2-7.4zm2.8-22.6h-5.5L24 266.2h5.5c6.2 0 9.1-3.3 9.7-7.2.7-4.1-1.2-7.1-7.4-7.1zm73.1 35.5l-4.8 11.3c-8.3.6-12.3-.3-14.3-3.9-4.4 2.7-9.3 4.1-14.5 4.1-9.4 0-12.7-4.9-11.8-10.3.4-2.6 1.9-5.1 4.3-7.2 5.2-4.5 18-5.1 23-8.5.4-3.8-1.1-5.2-5.8-5.2-5.5 0-10.1 1.8-18 7.2l1.9-12.4c6.8-4.9 13.4-7.2 21-7.2 9.7 0 18.3 4 16.7 14.6l-1.9 12c-.6 4.1-.5 5.4 4.2 5.5zm-19.2-7.6c-4.4 2.8-12.6 2.3-13.5 8.1-.4 2.7 1.3 4.7 4 4.7 2.6 0 5.8-1.1 8.4-2.9-.2-1-.1-2 .2-3.9l.9-6zm60.3-24.6c-5.3 0-9.3 1.8-14.5 6.2l.9-5.5h-16.6l-6.5 42.2h16.6l3.8-24.7c2.3-3.1 4.7-4.5 7.3-4.5 3.3 0 4.5 1.9 3.8 6.2l-3.6 23.1h16.6l4.3-27.9c1.5-9.4-2.8-15.1-12.1-15.1zm53.3.7l-15.9 14.5 4.2-26.8H171l-8.4 54.5h16.6l3-19.5h.2l12.6 19.5h20.9l-16.4-24.2 20.4-18h-20.6zm22 42.2h19.1l8.4-54.5h-19.1l-8.4 54.5zm89.3-26.5c-1.9 12.4-11.7 26.5-30.2 26.5h-30.8l8.4-54.5h27.3c21.2 0 27.3 15.3 25.3 28zm-30.3-15.1h-5.1l-4.4 28.6h5c9.3 0 14.4-4.6 15.9-14.3 1.1-7.1-1.1-14.3-11.4-14.3z" />
                    </svg>
                </div>
                <div className="button-section">Gå vidare med BankID</div>
            </button>
        </section>
    </div>
);

export default CreditAssessmentInformation;
