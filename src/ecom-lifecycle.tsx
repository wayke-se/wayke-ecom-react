import React from 'react';

import EcomStep from './enums/ecom-step';
import { getAllTransitions, getInitialStep } from './ecom-step-transitions';

import EcomHeader from './ecom-header';
import EcomStepContent from './ecom-step-content';
import EcomCart from './ecom-cart';
import EcomTimeline from './ecom-timeline';

import { IEcomExternalProps, IEcomContext, IEcomStore, IEcomData } from './types';
import StoreAction from './enums/store-action';
import { IOrderOptionsResponse } from 'wayke-ecom';

interface IEcomLifecycleProps extends IEcomExternalProps, IEcomContext, IEcomStore {
}

interface IState {
    step: EcomStep | undefined;
    stepHistory: EcomStep[];
    isBackwardsStepForbidden: boolean;
}

const getNewStep = (currentStep: EcomStep, data: IEcomData, options: IOrderOptionsResponse): EcomStep => {
    const transition = getAllTransitions()[currentStep];

    if (transition) {
        return transition(data, options);
    } else {
        throw 'Did not find a possible transition.';
    }
};

const shouldShowCart = (step: EcomStep) => {
    switch(step) {
        case EcomStep.CONFIRM_ORDER:
        case EcomStep.FINAL_CONFIRMATION:
            return false;
        default:
            return true;
    }
}

class EcomLifecycle extends React.Component<IEcomLifecycleProps, IState> {
    constructor(props: IEcomLifecycleProps) {
        super(props);

        this.componentDidTransitionForward = this.componentDidTransitionForward.bind(this);

        this.handleNextStepClick = this.handleNextStepClick.bind(this);
        this.handleRejectedStepForward = this.handleRejectedStepForward.bind(this);
        this.handlePreviousStepClick = this.handlePreviousStepClick.bind(this);
        this.handleSpecificStepClick = this.handleSpecificStepClick.bind(this);

        this.state = {
            step: undefined,
            stepHistory: [],
            isBackwardsStepForbidden: false
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
    }

    componentDidTransitionForward() {
        //Custom lifecycle event

        const insurance = this.props.data.insurance;
        const customer = this.props.data.customer;

        const shouldUpdateCustomerPersonalNumber = insurance.personalNumber && !customer.personalNumber;

        console.log(shouldUpdateCustomerPersonalNumber);

        if (shouldUpdateCustomerPersonalNumber) {
            this.props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
                type: 'customer',
                name: 'personalNumber',
                value: insurance.personalNumber
            });
        }
    }

    handleNextStepClick() {
        const nextStep = getNewStep(this.state.step, this.props.data, this.props.orderOptions);

        if (nextStep === null) {
            this.handleRejectedStepForward();
            return;
        }

        const newHistory = [ ...this.state.stepHistory ];
        newHistory.push(nextStep);

        this.setState({
            step: nextStep,
            stepHistory: newHistory,
            isBackwardsStepForbidden: nextStep === EcomStep.FINAL_CONFIRMATION
        }, () => {
            this.componentDidTransitionForward();
        });
    }

    handleRejectedStepForward() {
        switch (this.state.step) {
            case EcomStep.TRADE_IN_CAR_DEFINITION:
                this.props.dispatchStoreAction(StoreAction.INTERACT_SET_ALL_FOR_TYPE, 'tradeInCar');
                break;

            case EcomStep.INSURANCE_INFORMATION_DEFINITION:
                this.props.dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, { type: 'insurance', name: 'personalNumber' });
                break;

            case EcomStep.CUSTOMER_INFORMATION_INITIAL:
                this.props.dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, { type: 'customer', name: 'personalNumber' });
                break;

            case EcomStep.CUSTOMER_INFORMATION_DETAILS:
                this.props.dispatchStoreAction(StoreAction.INTERACT_SET_ALL_FOR_TYPE, 'customer');
                break;
        }
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

    render() {
        const canPressBackButton = this.state.stepHistory.length > 1 && !this.state.isBackwardsStepForbidden;
        const showCart = shouldShowCart(this.state.step);

        return (
            <div data-ecom-modal="" className="wayke-ecom">
                <div className="modal-container">
                    <div className="modal-center">
                        <div className="modal-dialog">
                            <div className="modal-dialog-main">
                                <div data-ecom-frame="">
                                    <div className="frame-body">
                                        <EcomHeader
                                            {...this.props}
                                            canPressBackButton={canPressBackButton}
                                            onPreviousStepClick={this.handlePreviousStepClick} />

                                        <EcomTimeline currentStep={this.state.step} options={this.props.orderOptions} />

                                        <div data-ecom-page="">
                                            <EcomStepContent
                                                step={this.state.step}
                                                {...this.props}

                                                onNextStepClick={this.handleNextStepClick}
                                                onShowCustomerInformationInitial={() => this.handleSpecificStepClick(EcomStep.CUSTOMER_INFORMATION_INITIAL)}
                                                onShowInsuranceInformationDefinition={() => this.handleSpecificStepClick(EcomStep.INSURANCE_INFORMATION_DEFINITION)}
                                                onShowTradeInCarDefinition={() => this.handleSpecificStepClick(EcomStep.TRADE_IN_CAR_DEFINITION)} />
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
