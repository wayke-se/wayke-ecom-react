/* eslint-disable no-console */
import React from "react";
import { IEcomContext, IEcomStore } from "../../types";

import Base from "./base";

interface IProps extends IEcomContext, IEcomStore {
    onHideOverlay: () => void;
    onProceedToNextStep: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CreditAssessmentScoring = ({
    creditAssessmentStatus,
    getCreditAssessmentStatus,
    onHideOverlay,
    onProceedToNextStep,
}: IProps) => {
    const [cancellationToken, setCancellationToken] = React.useState<number>();

    React.useEffect(() => {
        getCreditAssessmentStatus();
    }, []);

    React.useEffect(() => {
        if (creditAssessmentStatus.hasPendingScoring()) {
            scheduleNewStatusCollect();
        } else if (creditAssessmentStatus.isScored()) {
            onHideOverlay();
            onProceedToNextStep();
        }
        // TODO Handle scroing errors.
    }, [creditAssessmentStatus]);

    const scheduleNewStatusCollect = () => {
        clearTimeout(cancellationToken);
        const newCancellationToken = window.setTimeout(() => {
            // TODO Handle case not being active.
            getCreditAssessmentStatus();
        }, 2000);
        setCancellationToken(newCancellationToken);
    };

    const cancelScoring = () => {
        clearTimeout(cancellationToken);
        console.log("Cancelled status collecting");
    };

    return <Base onCancel={cancelScoring} />;
};

export default CreditAssessmentScoring;
