import React from "react";

import { CreditAssessmentResult } from "./types";

interface IResultProps {
    retailerName: string;
    retailerPhoneNumber: string;
    financialProvider: string;
}

const Success = ({
    retailerName,
    retailerPhoneNumber,
    financialProvider,
}: IResultProps) => (
    <div data-ecom-alert="success">
        <div className="alert-icon-section">
            <div className="alert-icon">
                <i className="icon-exclamation no-margin"></i>
            </div>
        </div>
        <div className="alert-content">
            <p>
                <span className="font-medium">
                    Grattis! Din låneansökan har beviljats av{" "}
                    {financialProvider}.
                </span>{" "}
            </p>
            Slutför ordern genom att klicka dig igenom nästkommande steg. Har du
            frågor under tiden? Kontakta {retailerName} på tel{" "}
            {retailerPhoneNumber}.
        </div>
    </div>
);

const Failure = () => (
    <div data-ecom-alert="error">
        <div className="alert-icon-section">
            <div className="alert-icon">
                <i className="icon-exclamation no-margin" />
            </div>
        </div>
        <div className="alert-content">
            <p>
                <span className="font-medium">
                    Vi kan tyvärr inte bevilja din kreditansökan.
                </span>{" "}
            </p>
            <p>
                De vanligaste orsakerna att kreditansökan inte kan beviljas är
                tidigare betalningsanmärkningar, en obalans mellan taxerad
                inkomst och övrig belåning eller att du är under 18 år. Du
                kommer via brev att få en bekräftelse med kompletterande
                information.
            </p>
            Ditt redan påbörjade köp kan fortfarande genomföras och avslutas,
            för att gå vidare kan du välja ett annat betalsätt.
        </div>
    </div>
);

const AssessManually = ({
    retailerName,
    retailerPhoneNumber,
}: IResultProps) => (
    <div data-ecom-alert="warning">
        <div className="alert-icon-section">
            <div className="alert-icon">
                <i className="icon-exclamation no-margin" />
            </div>
        </div>
        <div className="alert-content">
            <p>
                <span className="font-medium">
                    Vi behöver gå igenom ditt ärende och återkommer inom kort
                    till dig med ett besked.
                </span>
            </p>
            Du kan fortfarande sluföra ordern genom att klicka dig igenom
            nästkommande steg, men det är inte säkert att ditt lån kommer att
            beviljas. Har du frågor under tiden? Kontakta {retailerName} på tel{" "}
            {retailerPhoneNumber}.
        </div>
    </div>
);

interface IProps extends IResultProps {
    result: CreditAssessmentResult;
}

const Result = ({
    result,
    retailerName,
    retailerPhoneNumber,
    financialProvider,
}: IProps) => {
    switch (result) {
        case CreditAssessmentResult.Approve:
            return (
                <Success
                    retailerName={retailerName}
                    retailerPhoneNumber={retailerPhoneNumber}
                    financialProvider={financialProvider}
                />
            );
        case CreditAssessmentResult.Reject:
            return <Failure />;
        default:
            return (
                <AssessManually
                    retailerName={retailerName}
                    retailerPhoneNumber={retailerPhoneNumber}
                    financialProvider={financialProvider}
                />
            );
    }
};

export default Result;
