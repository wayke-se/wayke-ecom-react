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
                <i className="icon-check no-margin"></i>
            </div>
        </div>
        <div className="alert-content">
            <p>
                <span className="font-medium">
                    Grattis! Din låneansökan har beviljats av{" "}
                    {financialProvider}.
                </span>{" "}
            </p>
            Bilen är inte reserverad ännu. Slutför ordern genom att klicka dig
            igenom nästkommande steg. Har du frågor under tiden? Kontakta{" "}
            {retailerName} på tel {retailerPhoneNumber}.
        </div>
    </div>
);

const Failure = ({ retailerName, retailerPhoneNumber }: IResultProps) => (
    <div data-ecom-alert="error">
        <div className="alert-icon-section">
            <div className="alert-icon">
                <i className="icon-exclamation no-margin" />
            </div>
        </div>
        <div className="alert-content">
            <p>
                <span className="font-medium">
                    Vi kan tyvärr inte bevilja din ansökan om billån.
                </span>{" "}
            </p>
            <p>
                Det kan finnas olika skäl till att en ansökan nekas. Du kommer
                inom kort få ett brev med bekräftelse och mer information om
                just din ansökan.
            </p>
            <p>
                Ditt redan påbörjade köp kan fortfarande genomföras och
                avslutas, för att gå vidare kan du välja ett annat betalsätt.
            </p>
            Har du frågor under tiden? Kontakta {retailerName} på tel{" "}
            {retailerPhoneNumber}.
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
                    När ordern är slutförd kommer vi att gå igenom ditt ärende
                    och återkoppla till dig med ett lånebesked.
                </span>
            </p>
            Din bil är fortfarande inte reserverad. Gå vidare till nästa steg
            för att slutföra ordern, men det är inte säkert att ditt lån kommer
            att beviljas. Har du frågor under tiden? Kontakta {retailerName} på
            tel {retailerPhoneNumber}.
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
            return (
                <Failure
                    retailerName={retailerName}
                    retailerPhoneNumber={retailerPhoneNumber}
                    financialProvider={financialProvider}
                />
            );
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
