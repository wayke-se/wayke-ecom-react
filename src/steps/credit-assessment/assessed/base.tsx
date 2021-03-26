import React from "react";

import { CreditAssessmentResult } from "./types";
import Result from "./Result";

interface IProps {
    financialInstitutionName: string;
    retailerName: string;
    retailerPhoneNumber: string;
    logoSrc: string;
    downPayment: string;
    creditAmount: string;
    monthlyCost: string;
    duration: string;
    interest: string;
    effectiveInterest: string;
    result: CreditAssessmentResult;
    buttonLabel: string;
    onButtonClick: () => void;
}

const CreditAssessed = ({
    financialInstitutionName,
    retailerName,
    retailerPhoneNumber,
    logoSrc,
    downPayment,
    creditAmount,
    monthlyCost,
    duration,
    interest,
    effectiveInterest,
    result,
    buttonLabel,
    onButtonClick,
}: IProps) => (
    <div data-ecom-page>
        <section className="page-section">
            <div data-ecom-columnrow>
                <div className="column">
                    <h1 className="h6 no-margin">Billån</h1>
                </div>
                {!!logoSrc && (
                    <div className="column valign-top minimal">
                        <img src={logoSrc} alt="Logotype" className="l-block" />
                    </div>
                )}
            </div>
            <div data-ecom-content="" className="m-t m-b">
                <p>Ordern är snart klar, här ser du ditt lånebesked:</p>
            </div>
            <Result
                result={result}
                financialProvider={financialInstitutionName}
                retailerName={retailerName}
                retailerPhoneNumber={retailerPhoneNumber}
            />
        </section>
        <section className="page-section">
            <div data-ecom-columnrow className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">
                        Kontantinsats
                    </div>
                </div>
                <div className="column">{downPayment}</div>
            </div>
            <div data-ecom-columnrow className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">
                        Lånebelopp
                    </div>
                </div>
                <div className="column">{creditAmount}</div>
            </div>
            <div data-ecom-columnrow className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">
                        Avbetalningsperiod
                    </div>
                </div>
                <div className="column">{duration}</div>
            </div>
        </section>
        <section className="page-section">
            <div className="h6 m-b-mini">{monthlyCost}</div>
            <div className="font-size-small">
                {`Beräknat på ${interest} ränta (effektivt ${effectiveInterest})`}
            </div>
        </section>
        <section className="page-section page-section-bottom">
            <div data-ecom-buttonnav>
                <div className="button-nav-item">
                    <button
                        data-ecom-button="full-width"
                        onClick={onButtonClick}
                    >
                        {buttonLabel}
                    </button>
                </div>
            </div>
        </section>
    </div>
);

export default CreditAssessed;
