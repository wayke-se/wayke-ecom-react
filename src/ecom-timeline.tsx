import React from "react";

import EcomStep from "./constants/ecom-step";
import { IOrderOptionsResponse } from "@wayke-se/ecom";
import { getPrimarySteps } from "./ecom-step-transitions";

import TimelineItem from "./ecom-timeline-item";

export interface IEcomTimelineProps {
    options: IOrderOptionsResponse;
    currentStep: EcomStep;
    skipBankId: boolean;
}

const getLabel = (step: EcomStep): string => {
    switch (step) {
        case EcomStep.TRADE_IN_EXISTS_CHOOSER:
            return "Inbyte";
        case EcomStep.PAYMENT_METHOD_CHOOSER:
            return "Betalsätt";
        case EcomStep.INSURANCE_INFORMATION_DEFINITION:
            return "Försäkring";
        case EcomStep.BANKID_AUTHENTICATION:
            return "Uppgifter";
        case EcomStep.DELIVERY_METHOD:
            return "Leverans";
        case EcomStep.FINAL_SUMMARY:
            return "Sammanställning";
        case EcomStep.FINAL_CONFIRMATION:
            return "Bekräftelse";
        default:
            return "";
    }
};

export default (props: IEcomTimelineProps) => {
    if (!props.options) {
        return <div />;
    }

    const primarySteps = getPrimarySteps(props.options, props.skipBankId);
    const items = [];

    let timelineItemKey = 0;

    for (let i = 0; i < primarySteps.length; i += 1) {
        const primaryStep = primarySteps[i];

        const nextStepIndex = i + 1;
        const nextStep =
            nextStepIndex < primarySteps.length
                ? primarySteps[nextStepIndex]
                : null;

        const label = getLabel(primaryStep);
        const fullLabel = label ? `${i + 1}. ${label}` : null;

        let isActive: boolean;
        let isInbetweenStepActive: boolean;

        if (nextStep) {
            isActive =
                props.currentStep >= primaryStep &&
                props.currentStep < nextStep;
            isInbetweenStepActive =
                props.currentStep > primaryStep && props.currentStep < nextStep;
        } else {
            isActive = props.currentStep === primaryStep;
            isInbetweenStepActive = false;
        }

        items.push(
            <TimelineItem
                key={timelineItemKey}
                label={fullLabel}
                isActive={isActive}
                isInbetweenStepActive={isInbetweenStepActive}
            />
        );
        timelineItemKey += 1;

        if (nextStep) {
            items.push(
                <li
                    key={timelineItemKey}
                    className="timeline-item timeline-item-step"
                >
                    <div className="timeline-indicator" />
                </li>
            );
            timelineItemKey += 1;
        }
    }

    return (
        <div data-ecom-timeline="">
            <div className="timeline">
                <ul className="timeline-list">{items}</ul>
            </div>
        </div>
    );
};
