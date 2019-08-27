import React from 'react';

import EcomStep from './enums/ecom-step';

export interface IEcomTimelineProps {
    currentStep: EcomStep;
    historicalSteps: EcomStep[];
    futureSteps: EcomStep[];
};

interface IItemProps {
    label: string;
    shouldHide: boolean;
    isPassed: boolean;
    isCurrent: boolean;
};

const StepLabels = {
    [EcomStep.TRADE_IN_EXISTS_CHOOSER]: 'Inbyte',
    [EcomStep.TRADE_IN_CAR_DEFINITION]: null,
    [EcomStep.TRADE_IN_CONFIRM_CAR]: null,

    [EcomStep.PAYMENT_METHOD_CHOOSER]: 'Betalsätt',
    [EcomStep.PAYMENT_FINANCING_DETAILS ]: null,

    [EcomStep.INSURANCE_TYPE_CHOOSER]: 'Försäkring',
    [EcomStep.INSURANCE_INFORMATION_DEFINITION]: null,
    [EcomStep.INSURANCE_ALTERNATIVE_CHOOSER]: null,

    [EcomStep.CUSTOMER_INFORMATION_INITIAL]: 'Uppgifter',
    [EcomStep.CUSTOMER_INFORMATION_DETAILS]: null,

    [EcomStep.DELIVERY_TYPE_CHOOSER]: 'Leverans',

    [EcomStep.FINAL_CONFIRMATION]: 'Bekräftelse',
};

const Item = (props: IItemProps) => {
    if (props.shouldHide) {
        return (null);
    }

    let extraClassName = '';

    if (props.isPassed) {
        extraClassName = 'is-active is-stepped';
    } else if (props.isCurrent) {
        extraClassName = 'timeline-item-step';
    }

    return (
        <li className={`timeline-item ${extraClassName}`}>
            <div className="timeline-indicator"></div>

            { props.label &&
                <div className="timeline-label">{props.label}</div>
            }
        </li>
    );
};

const EcomTimeline = (props: IEcomTimelineProps) => {
    const timelineObjects = [
        ...props.historicalSteps.map((s) => ({
            step: s,
            label: null,
            shouldHide: null,
            isPassed: true,
            isCurrent: false
        })),

        {
            step: props.currentStep,
            label: null,
            shouldHide: null,
            isPassed: false,
            isCurrent: true
        },

        ...props.futureSteps.map((s) => ({
            step: s,
            label: null,
            shouldHide: null,
            isPassed: false,
            isCurrent: false
        })),
    ];

    for (let i = 0; i < timelineObjects.length; i++) {
        const object = timelineObjects[i];
        const label = StepLabels[object.step];

        object.label = (i + 1) + '. ' + label;
        object.shouldHide = !label && !object.isCurrent;
    }

    const items = timelineObjects.map((o, index) => <Item key={index} {...o} />);

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