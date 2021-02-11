import React from "react";

import { IEcomContext, IEcomStore } from "./types";

import OverlayType from "./constants/overlay-type";
import BankIdOverlay from "./overlays/bankid/index";
import CreditAssessmentBankIdOverlay from "./overlays/bankid/credit-assessment-bankid";
import CreditAssessmentScoringOverlay from "./overlays/credit-assessment-scoring";

interface IOverlayProps extends IEcomContext, IEcomStore {
    onHideOverlay: () => void;
    onProceedToNextStep: () => void;
    onPreviousStepClick: () => void;
    onDisplayOverlay: (string) => void;
    type: OverlayType;
}

const MissingOverlay = (props: { onHideOverlay: () => void }) => (
    <button data-ecom-button="full-width" onClick={props.onHideOverlay}>
        Tillbaka
    </button>
);

export default (props: IOverlayProps) => {
    switch (props.type) {
        case OverlayType.BANK_ID:
            return <BankIdOverlay {...props} />;
        case OverlayType.CREDIT_ASSESSMENT_BANK_ID:
            return <CreditAssessmentBankIdOverlay {...props} />;
        case OverlayType.CREDIT_ASSESSMENT_SCORING:
            return <CreditAssessmentScoringOverlay {...props} />;
        default:
            return <MissingOverlay onHideOverlay={props.onHideOverlay} />;
    }
};
