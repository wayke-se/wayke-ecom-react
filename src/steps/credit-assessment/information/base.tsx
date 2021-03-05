import React from "react";

import { IInfoItem, IValidatableInfoItem } from "./types";
import { TextInput, DropDownInput } from "./input";
import CreateCaseButton from "./create-case-button";
import {
    MARITAL_STATUS_VALUES,
    OCCUPATION_VALUES,
} from "../../../constants/credit-assessment";

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
    hasError: boolean;
    errorText: string;
    creatingCase: boolean;
    formattedCreditAmount: string;
    financialProvider: string;
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
    hasError,
    errorText,
    creatingCase,
    formattedCreditAmount,
    financialProvider,
    submit,
}: IProps) => (
    <div data-ecom-page>
        <section className="page-section">
            <div data-ecom-columnrow>
                <div className="column">
                    <h1 className="h6">Låneansökan</h1>
                    <div data-ecom-content>
                        <p>
                            För att besvara din förfrågan om finansiering
                            behöver vi några fler uppgifter om dig och ditt
                            hushåll. Frågorna tar bara någon minut att besvara.
                            Bekräfta och signera sedan med BankID – därefter får
                            du ditt lånebesked direkt på skärmen!
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
                    options={MARITAL_STATUS_VALUES}
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
                    options={OCCUPATION_VALUES}
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
                <div data-ecom-content="" className="m-t m-b">
                    <h2 className="h6">Gör låneansökan</h2>
                    <p>
                        Genom att gå vidare ansöker du om ett lån på{" "}
                        <b>{formattedCreditAmount} kr</b> hos{" "}
                        {financialProvider}.
                    </p>
                    <p>
                        För att gå vidare med din låneansökan behöver du signera
                        och validera dina svar med Mobilt BankID mot Volvofinans
                        Bank. En kreditupplysning kommer att tas och får du ditt
                        lånebesked direkt. Blir du godkänd så gäller den genom
                        hela köpet så länge inga tillägg görs – men din ansökan
                        är inte bindande.
                    </p>
                </div>
                <div className="form-group">
                    <div data-ecom-alert>
                        <div className="alert-icon-section">
                            <div className="alert-icon">
                                <i className="icon-info no-margin" />
                            </div>
                        </div>
                        <div className="alert-content">
                            Vi kommer inte att belasta ert konto med någon
                            kostnad i detta steg. Köpet slutförs sedan vid möte
                            med handlaren.
                        </div>
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
