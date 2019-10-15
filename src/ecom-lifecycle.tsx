import React from 'react';

import EcomStep from './constants/ecom-step';
import UserEvent from './constants/user-event';
import { getAllTransitions, getInitialStep } from './ecom-step-transitions';

import EcomHeader from './ecom-header';
import EcomStepContent from './ecom-step-content';
import EcomCart from './ecom-cart';
import EcomTimeline from './ecom-timeline';

import { IEcomExternalProps, IEcomContext, IEcomStore, IEcomData } from './types';
import { IOrderOptionsResponse } from '@wayke-se/ecom';

interface IEcomLifecycleProps extends IEcomExternalProps, IEcomContext, IEcomStore {
}

interface IState {
    step: EcomStep | undefined;
    stepHistory: EcomStep[];
    isBackwardsStepForbidden: boolean;
    hasNewStep: boolean;
}

const getNextStep = (currentStep: EcomStep, data: IEcomData, options: IOrderOptionsResponse): EcomStep => {
    const transition = getAllTransitions()[currentStep];

    if (transition) {
        return transition(data, options);
    } else {
        throw 'Did not find a possible transition.';
    }
};

const shouldShowCart = (step: EcomStep) => {
    switch(step) {
        case EcomStep.CUSTOMER_INFORMATION_DETAILS:
        case EcomStep.FINAL_CONFIRMATION:
            return false;
        default:
            return true;
    }
}

class EcomLifecycle extends React.Component<IEcomLifecycleProps, IState> {
    private frameBodyRef: React.RefObject<HTMLDivElement>;
    private rootRef: React.RefObject<HTMLDivElement>;

    constructor(props: IEcomLifecycleProps) {
        super(props);

        this.handleProceedToNextStep = this.handleProceedToNextStep.bind(this);
        this.handlePreviousStepClick = this.handlePreviousStepClick.bind(this);
        this.handleSpecificStepClick = this.handleSpecificStepClick.bind(this);
        this.handleIncompleteUserEvent = this.handleIncompleteUserEvent.bind(this);

        this.frameBodyRef = React.createRef();
        this.rootRef = React.createRef();

        this.state = {
            step: undefined,
            stepHistory: [],
            isBackwardsStepForbidden: false,
            hasNewStep: false
        };
    }

    componentDidUpdate() {
        const hasOrderOptions = this.props.orderOptions;
        const hasNoStep = this.state.step === undefined;

        const shouldSetInitialStep = hasOrderOptions && hasNoStep;

        if (shouldSetInitialStep) {
            const initialStep = getInitialStep(this.props.orderOptions);

            this.setState({
                stepHistory: [ initialStep ],
                step: initialStep
            });
        }

        if (this.state.hasNewStep) {
            this.setState({
                hasNewStep: false
            }, () => {
                if (this.frameBodyRef.current) {
                    this.frameBodyRef.current.scrollTop = 0;
                }

                if (this.rootRef.current) {
                    this.rootRef.current.scrollTop = 0;
                }
            })
        }
    }

    handleProceedToNextStep() {
        const nextStep = getNextStep(this.state.step, this.props.data, this.props.orderOptions);

        if (!nextStep) {
            return;
        }

        const newHistory = [ ...this.state.stepHistory ];
        newHistory.push(nextStep);

        this.setState({
            step: nextStep,
            stepHistory: newHistory,
            isBackwardsStepForbidden: nextStep === EcomStep.FINAL_CONFIRMATION,
            hasNewStep: true
        });
    }

    handlePreviousStepClick() {
        if (this.state.isBackwardsStepForbidden) {
            return;
        }

        const newHistory = [ ...this.state.stepHistory ];
        newHistory.pop();

        if (newHistory.length === 0) {
            return;
        }

        const previousStep = newHistory[newHistory.length - 1];

        this.setState({
            step: previousStep,
            stepHistory: newHistory
        });
    }

    handleSpecificStepClick(step: EcomStep) {
        let newHistory = [ ...this.state.stepHistory ];
        const hasStepInHistory = newHistory.includes(step);

        if (hasStepInHistory) {
            const index = newHistory.indexOf(step);
            newHistory = newHistory.slice(0, index + 1);
        } else {
            newHistory.push(step);
        }

        this.setState({
            step,
            stepHistory: newHistory
        });
    }

    handleIncompleteUserEvent(userEvent: UserEvent) {
        if (this.props.onUserEvent) {
            const userEventKey = UserEvent[userEvent];
            const ecomStepKey = EcomStep[this.state.step];

            this.props.onUserEvent(userEventKey, ecomStepKey);
        }
    }

    render() {
        const canPressBackButton = this.state.stepHistory.length > 1 && !this.state.isBackwardsStepForbidden;
        const showCart = shouldShowCart(this.state.step);

        return (
            <div data-ecom-modal="" className="wayke-ecom" ref={this.rootRef}>
                <div className="modal-container">
                    <div className="modal-center">
                        <div className="modal-dialog">
                            <div className="modal-dialog-main">
                                <div data-ecom-frame="">
                                    <div className="frame-body" ref={this.frameBodyRef}>
                                        <EcomHeader
                                            {...this.props}
                                            step={this.state.step}
                                            canPressBackButton={canPressBackButton}
                                            onPreviousStepClick={this.handlePreviousStepClick}
                                            onIncompleteUserEvent={this.handleIncompleteUserEvent} />

                                        <EcomTimeline currentStep={this.state.step} options={this.props.orderOptions} />

                                        <div data-ecom-page="">
                                            <EcomStepContent
                                                step={this.state.step}
                                                {...this.props}

                                                onProceedToNextStep={this.handleProceedToNextStep}
                                                onShowCustomerInformationInitial={() => this.handleSpecificStepClick(EcomStep.CUSTOMER_INFORMATION_INITIAL)}
                                                onShowInsuranceInformationDefinition={() => this.handleSpecificStepClick(EcomStep.INSURANCE_INFORMATION_DEFINITION)}
                                                onShowTradeInCarDefinition={() => this.handleSpecificStepClick(EcomStep.TRADE_IN_CAR_DEFINITION)}
                                                onShowPaymentMethodChooser={() => this.handleSpecificStepClick(EcomStep.PAYMENT_METHOD_CHOOSER)}
                                                onIncompleteUserEvent={this.handleIncompleteUserEvent} />
                                        </div>
                                    </div>

                                    { showCart && <EcomCart {...this.props} /> }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default EcomLifecycle;
