/* eslint-disable no-console */
import React from "react";
import { IEcomContext, IEcomStore } from "../../types";

import Base from "./base";
import Error from "./error";

interface IProps extends IEcomContext, IEcomStore {
    onHideOverlay: () => void;
    onProceedToNextStep: () => void;
    onPreviousStepClick: () => void;
}

const CreditAssessmentScoring = ({
    creditAssessmentStatus,
    data,
    orderOptions,
    getCreditAssessmentStatus,
    onHideOverlay,
    onProceedToNextStep,
    onPreviousStepClick,
    onFetchAddressInformation,
}: IProps) => {
    const [cancellationToken, setCancellationToken] = React.useState<number>();
    const [hasError, setHasError] = React.useState(false);
    const [errorTexts, setErrorTexts] = React.useState<string[]>([]);

    React.useEffect(() => {
        onFetchAddressInformation((isSuccessful) => {
            if (isSuccessful) {
                getCreditAssessmentStatus();
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
        if (creditAssessmentStatus.isScored()) {
            onHideOverlay();
            onProceedToNextStep();
        }
    }, [creditAssessmentStatus]);

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
        onHideOverlay();
        onPreviousStepClick();
    };

    const paymentType = data.payment.paymentType;
    const paymentOptions = orderOptions.getPaymentOptions();
    const selectedOption = paymentOptions.find(
        (option) => option.type === paymentType
    );
    const financialProvider = selectedOption.name;

    return hasError ? (
        <Error texts={errorTexts} onReturn={cancelScoring} />
    ) : (
        <Base onCancel={cancelScoring} financialProvider={financialProvider} />
    );
};

export default CreditAssessmentScoring;
