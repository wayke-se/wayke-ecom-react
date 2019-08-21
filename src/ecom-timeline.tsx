import React from 'react';

import EcomStep from './enums/ecom-step';

export interface IEcomTimelineProps {
    step: number;
};

interface IItemProps {
    label: string;
    shouldHide: boolean;
    isPassed: boolean;
    isCurrent: boolean;
};

const StepLabels = {
    [EcomStep.TRADE_IN_EXISTS_CHOOSER]: '1. Inbyte',
    [EcomStep.TRADE_IN_CAR_DEFINITION]: null,
    [EcomStep.TRADE_IN_CONFIRM_CAR]: null,

    [EcomStep.PAYMENT_METHOD_CHOOSER]: '2. Betalsätt',
    [EcomStep.PAYMENT_FINANCING_DETAILS ]: null,

    [EcomStep.INSURANCE_TYPE_CHOOSER]: '3. Försäkring',
    [EcomStep.INSURANCE_INFORMATION_DEFINITION]: null,
    [EcomStep.INSURANCE_ALTERNATIVE_CHOOSER]: null,

    [EcomStep.CUSTOMER_INFORMATION_INITIAL]: '4. Uppgifter',
    [EcomStep.CUSTOMER_INFORMATION_DETAILS]: null,

    [EcomStep.DELIVERY_TYPE_CHOOSER]: '5. Leverans',

    [EcomStep.FINAL_CONFIRMATION]: '6. Bekräftelse',
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
    const currentStep = props.step;
    const ecomStepValues = Object.values(EcomStep);

    const timelineObjects = [];

    ecomStepValues.forEach((v, index) => {
        const label = StepLabels[v];

        timelineObjects.push({
            label,
            shouldHide: currentStep !== index && !label,
            isPassed: index < currentStep,
            isCurrent: currentStep === index
        });
    });

    const items = timelineObjects.map((v, index) => <Item key={index} {...v} />);

    return (
        <div data-am-timeline="">
            <div className="timeline">
                <ul className="timeline-list">
                    {items}
                </ul>
            </div>
        </div>
    );
};

export default EcomTimeline;