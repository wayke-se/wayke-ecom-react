import {
    CreditAssessmentDecision,
    CreditAssessmentRecommendation,
} from "@wayke-se/ecom";
import React from "react";
import Result from "./Result";

interface IProps {
    financialInstitutionName: string;
    logoSrc: string;
    downPayment: string;
    monthlyCost: string;
    duration: string;
    interest: string;
    effectiveInterest: string;
    decision: CreditAssessmentDecision;
    recommendation: CreditAssessmentRecommendation;
    onProceed: () => void;
}

const CreditAssessed = ({
    financialInstitutionName,
    logoSrc,
    downPayment,
    monthlyCost,
    duration,
    interest,
    effectiveInterest,
    decision,
    recommendation,
    onProceed,
}: IProps) => (
    <div data-ecom-page>
        <section className="page-section">
            <div data-ecom-columnrow>
                <div className="column">
                    <h1 className="h6 no-margin">Finansiering</h1>
                    <div className="m-t-half">{financialInstitutionName}</div>
                </div>
                {!!logoSrc && (
                    <div className="column valign-top minimal">
                        <img src={logoSrc} alt="Logotype" className="l-block" />
                    </div>
                )}
            </div>
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
                        Avbetalning
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
            <div className="m-t-half">
                <button data-ecom-link className="l-block">
                    Detaljer
                </button>
            </div>
        </section>
        <section className="page-section page-section-bottom">
            <Result decision={decision} recommendation={recommendation} />
        </section>
        <section className="page-section page-section-bottom">
            <div data-ecom-buttonnav>
                <div className="button-nav-item">
                    <button data-ecom-button="full-width" onClick={onProceed}>
                        Gå vidare
                    </button>
                </div>
            </div>
        </section>
    </div>
);

export default CreditAssessed;
