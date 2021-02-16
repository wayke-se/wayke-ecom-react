import React from "react";

import { CreditAssessmentResult } from "./types";

const Success = () => (
    <div data-ecom-alert="success">
        <div className="alert-icon-section">
            <div className="alert-icon">
                <i className="icon-exclamation no-margin"></i>
            </div>
        </div>
        <div className="alert-content">
            <span className="font-medium">
                Grattis! Din låneansökan har beviljats.
            </span>{" "}
            Vi har fått de uppgifter som vi behöver och det kommer inte göras
            ytterligare kreditprövningar vid avtalsskrivning med handlaren.
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
            <span className="font-medium">
                Tyvärr kommer inte detta lån att beviljas.
            </span>{" "}
            Testa att justera lånevillkoren. En ny kreditprövning kommer att
            göras med dina nya val.{" "}
        </div>
    </div>
);

const AssessManually = () => (
    <div data-ecom-alert="warning">
        <div className="alert-icon-section">
            <div className="alert-icon">
                <i className="icon-exclamation no-margin" />
            </div>
        </div>
        <div className="alert-content">
            <span className="font-medium">
                Vi behöver gå igenom ditt ärende och återkommer inom kort till
                dig med ett besked.
            </span>{" "}
            Slutför ordern genom att klicka dig igenom nästkommande steg.
        </div>
    </div>
);

interface IProps {
    result: CreditAssessmentResult;
}

const Result = ({ result }: IProps) => {
    switch (result) {
        case CreditAssessmentResult.Approve:
            return <Success />;
        case CreditAssessmentResult.Reject:
            return <Failure />;
        default:
            return <AssessManually />;
    }
};

export default Result;
