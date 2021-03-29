/* eslint-disable react/jsx-no-target-blank */
import React from "react";

import { IInfoItem, IValidatableInfoItem } from "./types";
import { TextInput, DropDownInput } from "./input";
import CreateCaseButton from "./create-case-button";
import {
    MARITAL_STATUS_VALUES,
    OCCUPATION_VALUES,
} from "../../../constants/credit-assessment";
import HelperLabel from "../../../components/helper-label";
import HelperBox from "../../../components/helper-box";

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
    hasPrivacyPolicy: boolean;
    privacyPolicyUrl?: string;
    retailerName: string;
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
    hasPrivacyPolicy,
    privacyPolicyUrl,
    retailerName,
    submit,
}: IProps) => (
    <div data-ecom-page>
        <section className="page-section">
            <div data-ecom-columnrow>
                <div className="column">
                    <h1 className="h6">Låneansökan</h1>
                </div>
                <div className="column valign-top minimal">
                    <img src={logoSrc} alt="logotyp" className="l-block" />
                </div>
            </div>
            <div data-ecom-columnrow>
                <div className="column">
                    <div data-ecom-content>
                        <p>
                            För att besvara din förfrågan om billån behöver{" "}
                            {financialProvider} några fler uppgifter om dig och
                            ditt hushåll. Frågorna tar bara någon minut att
                            besvara. Bekräfta och signera sedan med Mobilt
                            BankID – därefter får du ditt lånebesked direkt på
                            skärmen och kan gå vidare med ditt bilköp. Blir du
                            godkänd så gäller lånebeskedet genom hela köpet så
                            länge inga tillägg görs – men din ansökan är inte
                            bindande.
                        </p>
                    </div>
                </div>
            </div>
            <div className="form-group m-t">
                <div data-ecom-alert>
                    <div className="alert-icon-section">
                        <div className="alert-icon">
                            <i className="icon-info no-margin" />
                        </div>
                    </div>
                    <div className="alert-content">
                        <p>
                            <span className="font-medium">
                                Varför måste jag svara på allt detta?
                            </span>
                        </p>
                        <p>
                            {financialProvider}, liksom alla banker i Sverige,
                            är enligt lagen om åtgärder mot penningtvätt och
                            finansiering av terrorism skyldiga att ha god
                            kännedom om sina kunder. Därför måste vi ställa
                            frågor om dig som kund. Den information vi får om
                            dig behandlas konfidentiellt och omfattas av
                            banksekretessen och GDPR.
                        </p>
                        <a
                            href="https://www.fi.se/sv/bank/penningtvatt"
                            target="_blank"
                        >
                            Läs mer
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <section className="page-section">
            <div data-ecom-form>
                <div className="m-t m-b">
                    <HelperLabel label="Personnummer" />
                    <TextInput
                        {...personalNumber}
                        placeholder="ÅÅÅÅMMDD-XXXX"
                        errorText="Ange personnummer i formatet ÅÅÅÅMMDD-XXXX"
                        wide
                    />
                </div>
                <div className="m-t m-b">
                    <HelperLabel label="E-postadress" />
                    <TextInput
                        {...email}
                        placeholder="E-postadress"
                        errorText="En giltig e-postadress måste anges"
                        wide
                    />
                </div>
                <div className="m-t m-b">
                    <HelperLabel label="Telefonnummer" />
                    <TextInput
                        {...phone}
                        placeholder="07X-XXXXXXX"
                        errorText="Ange ditt telefonnummer"
                        wide
                    />
                </div>
                <div className="m-t m-b">
                    <HelperLabel label="Civilstånd" />
                    <DropDownInput
                        {...maritalStatus}
                        options={MARITAL_STATUS_VALUES.slice()}
                    />
                </div>
                <div className="m-t m-b">
                    <HelperBox
                        label="Inkomst per månad före skatt (kr)"
                        title="Hur stor inkomst har du per månad före skatt?"
                    >
                        <p>Ange hur stor din totala inkomst är.</p>
                        <p>Exempel på inkomster kan vara:</p>
                        <ul>
                            <li>Lön</li>
                            <li>Pension</li>
                            <li>Kapitalinkomst</li>
                        </ul>
                    </HelperBox>
                    <TextInput
                        {...income}
                        placeholder="Inkomst"
                        errorText="Ange din inkomst"
                        wide
                    />
                </div>
                <div className="m-t m-b">
                    <HelperLabel label="Sysselsättning" />
                    <DropDownInput
                        {...employment}
                        options={OCCUPATION_VALUES.slice()}
                    />
                </div>
                <div className="m-t m-b">
                    <HelperBox
                        label="Antal hemmavarande barn"
                        title="Hur många barn försörjer du?"
                    >
                        <p>
                            Fyll i antal barn som får barn- eller studiebidrag
                            och som du försörjer. Barn som bor hemma och arbetar
                            och kan försörja sig själva behöver inte räknas med.
                        </p>
                        <p>
                            För dig som har delad vårdnad: ange samtliga barn
                            som bor minst 50 % i hushållet.
                        </p>
                    </HelperBox>
                    <TextInput
                        {...householdChildren}
                        placeholder="Antal hemmavarande barn"
                        errorText="Ange antalet hemmavarande barn i heltal"
                        wide
                    />
                </div>
                <div className="m-t m-b">
                    <HelperBox
                        label="Hushållets inkomst per månad före skatt (kr)"
                        title="Hur stor inkomst har ert hushåll per månad före skatt?"
                    >
                        <p>Ange hur stor hushållets totala inkomst är.</p>
                        <p>Exempel på inkomster kan vara:</p>
                        <ul>
                            <li>Lön</li>
                            <li>Pension</li>
                            <li>Kapitalinkomst</li>
                        </ul>
                    </HelperBox>
                    <TextInput
                        {...householdIncome}
                        placeholder="Hushållets inkomst"
                        errorText="Ange hushållets inkomst"
                        wide
                    />
                </div>
                <div className="m-t m-b">
                    <HelperBox
                        label="Hushållets ungefärliga boendekostnad per månad (kr)"
                        title="Hur stora utgifter för ert boende har ditt hushåll varje månad?"
                    >
                        <p>
                            Ange hur stor hushållets ungefärliga boendekostnader
                            är.
                        </p>
                        <p>Exempel på kostnader kan vara:</p>
                        <ul>
                            <li>Hyra</li>
                            <li>Avgift till förening</li>
                            <li>Driftkostnader</li>
                            <li>Räntekostnader</li>
                        </ul>
                        <p>Amorteringskostnader ingår inte i beräkningen.</p>
                    </HelperBox>
                    <TextInput
                        {...householdHousingCost}
                        placeholder="Ungefärlig boendekostnad"
                        errorText="Ange hushållets ungefärliga boendekostnad per månad (kr)"
                        wide
                    />
                </div>
                <div className="m-t m-b">
                    <HelperBox
                        label="Hushållets totala skulder (kr)"
                        title="Hur mycket andra skulder har ert hushåll?"
                    >
                        <p>
                            Ange kostnaden för samtliga övriga lån och skulder
                            som hushållet har.
                        </p>
                        <p>Exempel på andra lån kan vara:</p>
                        <ul>
                            <li>Andra billån</li>
                            <li>Bostadslån</li>
                            <li>Studielån</li>
                            <li>Blanco/privatlån</li>
                            <li>Kortkredit</li>
                        </ul>
                    </HelperBox>
                    <TextInput
                        {...householdDebt}
                        placeholder="Hushållets totala skulder"
                        errorText="Ange hushållets totala skulder (kr)"
                        wide
                    />
                </div>
                <div data-ecom-content="" className="m-t m-b">
                    <h2 className="h6">Gör låneansökan</h2>
                    <p className="font-size-small">
                        Genom att gå vidare ansöker du om ett lån på{" "}
                        <b>{formattedCreditAmount} kr</b> hos{" "}
                        {financialProvider}.
                    </p>
                    <p className="font-size-small">
                        För att gå vidare med din låneansökan behöver du signera
                        och validera dina svar med Mobilt BankID mot{" "}
                        {financialProvider}. En kreditupplysning kommer att tas
                        och får du ditt lånebesked direkt. Blir du godkänd så
                        gäller den genom hela köpet så länge inga tillägg görs –
                        men din ansökan är inte bindande.
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
                            Du betalar inget i detta steg, detta är bara en
                            låneansökan. Köpet slutförs sedan vid möte med{" "}
                            {retailerName}.
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
        {!!hasPrivacyPolicy && (
            <div data-ecom-content="" className="m-t m-b">
                <p className="text-center font-size-small">
                    Genom att klicka på ”Genomför låneansökan” godkänner jag att{" "}
                    {financialProvider} gör en kreditupplysning på mig baserat
                    på informationen ovan och jag bekräftar att jag läst{" "}
                    <a href={privacyPolicyUrl} target="_blank">
                        {financialProvider} dataskyddspolicy
                    </a>
                    .
                </p>
                <p className="text-center font-size-small">
                    Dina uppgifter lagras och sparas säkert.
                </p>
            </div>
        )}
    </div>
);

export default CreditAssessmentInformation;
