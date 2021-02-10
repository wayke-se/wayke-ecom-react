/* eslint-disable no-console */
import React from "react";
import { IEcomContext, IEcomStore } from "../../types";

import Base from "./base";
import Error from "./error";

interface IProps extends IEcomContext, IEcomStore {
    onHideOverlay: () => void;
    onProceedToNextStep: () => void;
}

const CreditAssessmentScoring = ({
    creditAssessmentStatus,
    getCreditAssessmentStatus,
    onHideOverlay,
    onProceedToNextStep,
    onFetchAddressInformation,
}: IProps) => {
    const [cancellationToken, setCancellationToken] = React.useState<number>();
    const [addressLoaded, setAddressLoaded] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);
    const [errorTexts, setErrorTexts] = React.useState<string[]>([]);

    React.useEffect(() => {
        getCreditAssessmentStatus();
        onFetchAddressInformation((isSuccessful) => {
            if (isSuccessful) {
                setAddressLoaded(true);
            } else {
                const newErrorTexts = errorTexts.concat([
                    "Kunde inte hitta adress",
                ]);
                setErrorTexts(newErrorTexts);
                setHasError(true);
            }
        });
    }, []);

    React.useEffect(() => {
        if (!hasError && creditAssessmentStatus.hasPendingScoring()) {
            scheduleNewStatusCollect();
        } else if (creditAssessmentStatus.hasScoringError()) {
            const newErrorTexts = errorTexts.concat([
                "Kunde inte bedömma ärende",
            ]);
            setErrorTexts(newErrorTexts);
            setHasError(true);
        }
    }, [creditAssessmentStatus]);

    React.useEffect(() => {
        if (creditAssessmentStatus.isScored() && addressLoaded) {
            onHideOverlay();
            onProceedToNextStep();
        }
    }, [creditAssessmentStatus, addressLoaded]);

    React.useEffect(() => {
        clearTimeout(cancellationToken);
    }, [hasError]);

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

    return hasError ? (
        <Error texts={errorTexts} onReturn={cancelScoring} />
    ) : (
        <Base onCancel={cancelScoring} />
    );
};

export default CreditAssessmentScoring;
