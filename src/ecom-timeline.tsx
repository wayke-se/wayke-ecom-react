import React from 'react';

import EcomStep from './constants/ecom-step';
import { IOrderOptionsResponse } from '@wayke-se/ecom';
import { getPrimarySteps } from './ecom-step-transitions';

export interface IEcomTimelineProps {
    options: IOrderOptionsResponse;
    currentStep: EcomStep;
};

interface IItemProps {
    label: string;
    isActive: boolean;
    isInbetweenStepActive: boolean;
};

const Item = (props: IItemProps) => {
    return (
        <li className={`timeline-item ${props.isActive ? 'is-active' : ''} ${props.isInbetweenStepActive ? 'is-stepped' : ''}`}>
            <div className="timeline-indicator"></div>
            <div className="timeline-label">{props.label}</div>
        </li>
    );
};

const InbetweenItem = () => {
    return (
        <li className="timeline-item timeline-item-step">
            <div className="timeline-indicator"></div>
        </li>
    );
};

const getLabel = (step: EcomStep): string => {
    switch (step) {
        case EcomStep.TRADE_IN_EXISTS_CHOOSER:
            return 'Inbyte';
        case EcomStep.PAYMENT_METHOD_CHOOSER:
            return 'Betalsätt';
        case EcomStep.INSURANCE_TYPE_CHOOSER:
            return 'Försäkring';
        case EcomStep.CUSTOMER_INFORMATION_INITIAL:
            return 'Uppgifter';
        case EcomStep.CONFIRM_ORDER:
            return 'Granska';
        case EcomStep.FINAL_CONFIRMATION:
            return 'Bekräftelse';
        default:
            return '';
    }
}

const EcomTimeline = (props: IEcomTimelineProps) => {
    if (!props.options) {
        return <div></div>;
    }

    const primarySteps = getPrimarySteps(props.options);
    const items = [];

    var timelineItemKey = 0;

    for (var i = 0; i < primarySteps.length; i++) {
        const primaryStep = primarySteps[i];

        const nextStepIndex = i + 1;
        const nextStep = nextStepIndex < primarySteps.length ? primarySteps[nextStepIndex] : null;

        const label = getLabel(primaryStep);
        const fullLabel = label ? `${i + 1}. ${label}` : null;

        var isActive: boolean;
        var isInbetweenStepActive: boolean;

        if (nextStep) {
            isActive = props.currentStep >= primaryStep && props.currentStep < nextStep;
            isInbetweenStepActive = props.currentStep > primaryStep && props.currentStep < nextStep;
        } else {
            isActive = props.currentStep === primaryStep;
            isInbetweenStepActive = false;
        }

        items.push(<Item key={timelineItemKey} label={fullLabel} isActive={isActive} isInbetweenStepActive={isInbetweenStepActive} />);
        timelineItemKey += 1;

        if (nextStep) {
            items.push(<InbetweenItem key={timelineItemKey} />);
            timelineItemKey += 1;
        }
    }

    return (
        <div data-ecom-timeline="">
            <div className="timeline">
                <ul className="timeline-list">
                    {items}
                </ul>
            </div>
        </div>
    );
};

export default EcomTimeline;