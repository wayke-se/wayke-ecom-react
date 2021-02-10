import React from "react";

import { IInfoItem, IValidatableInfoItem } from "./types";
import { TextInput, DropDownInput } from "./input";
import CreateCaseButton from "./create-case-button";

interface IProps {
    logoSrc: string;
    phone: IValidatableInfoItem;
    email: IValidatableInfoItem;
    personalNumber: IValidatableInfoItem;
    income: IValidatableInfoItem;
    householdChildren: IValidatableInfoItem;
    householdIncome: IValidatableInfoItem;
    householdHousingCost: IValidatableInfoItem;
    householdDebt: IValidatableInfoItem;
    maritalStatus: IInfoItem;
    employment: IInfoItem;
    termsApproved: boolean;
    privacyApproved: boolean;
    hasError: boolean;
    errorText: string;
    creatingCase: boolean;
    setTermsApproved: (value: boolean) => void;
    setPrivacyApproved: (value: boolean) => void;
    submit: () => void;
}

const CreditAssessmentInformation = ({
    logoSrc,
    phone,
    email,
    personalNumber,
    maritalStatus,
    income,
    employment,
    householdChildren,
    householdIncome,
    householdHousingCost,
    householdDebt,
    termsApproved,
    privacyApproved,
    hasError,
    errorText,
    creatingCase,
    setTermsApproved,
    setPrivacyApproved,
    submit,
}: IProps) => (
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
                    <img src={logoSrc} alt="logotyp" className="l-block" />
                </div>
            </div>
        </section>
        <section className="page-section">
            <div data-ecom-form>
                <TextInput
                    {...personalNumber}
                    label="Personnummer"
                    placeholder="ÅÅÅÅMMDD-XXXX"
                    errorText="Ange personnummer i formatet ÅÅÅÅMMDD-XXXX"
                    wide
                />
                <div className="form-group-row">
                    <TextInput
                        {...email}
                        label="E-postadress"
                        placeholder="E-postadress"
                        errorText="En giltig e-postadress måste anges"
                    />
                    <TextInput
                        {...phone}
                        label="Telefonnummer"
                        placeholder="07X-XXXXXXX"
                        errorText="Ange ditt telefonnummer"
                    />
                </div>
                <DropDownInput
                    {...maritalStatus}
                    label="Civilstatus"
                    options={["Gift", "Singel"]}
                />
                <TextInput
                    {...income}
                    label="Inkomst per månad före skatt (kr)"
                    placeholder="Inkomst"
                    errorText="Ange din inkomst"
                    wide
                />
                <DropDownInput
                    {...employment}
                    label="Sysselsättning"
                    options={[
                        "Fulltidsanställd",
                        "Student",
                        "Deltidsanställd",
                        "Pensionär",
                        "Egenföretagare",
                        "Annat",
                    ]}
                />
                <TextInput
                    {...householdChildren}
                    label="Antal hemmavarande barn"
                    placeholder="Antal hemmavarande barn"
                    errorText="Ange antalet hemmavarande barn i heltal"
                    wide
                />
                <TextInput
                    {...householdIncome}
                    label="Hushållets inkomst per månad före skatt (kr)"
                    placeholder="Hushållets inkomst"
                    errorText="Ange hushållets inkomst"
                    wide
                />
                <TextInput
                    {...householdHousingCost}
                    label="Hushållets ungefärliga boendekostnad per månad (kr)"
                    placeholder="Ungefärlig boendekostnad"
                    errorText="Ange hushållets ungefärliga boendekostnad per månad (kr)"
                    wide
                />
                <TextInput
                    {...householdDebt}
                    label="Hushållets totala skulder (kr)"
                    placeholder="Hushållets totala skulder"
                    errorText="Ange hushållets totala skulder (kr)"
                    wide
                />
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
                        <input
                            type="checkbox"
                            id="finance-checkbox-1"
                            checked={termsApproved}
                            onChange={(e) => setTermsApproved(e.target.checked)}
                        />
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
                        <input
                            type="checkbox"
                            id="finance-checkbox-2"
                            checked={privacyApproved}
                            onChange={(e) =>
                                setPrivacyApproved(e.target.checked)
                            }
                        />
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
            <CreateCaseButton creatingCase={creatingCase} onClick={submit} />
        </section>
        {!!hasError && (
            <div data-ecom-alert="error" className="m-t">
                <div className="alert-icon-section">
                    <div className="alert-icon">
                        <i className="icon-exclamation no-margin"></i>
                    </div>
                </div>
                <div className="alert-content">{errorText}</div>
            </div>
        )}
    </div>
);

export default CreditAssessmentInformation;
