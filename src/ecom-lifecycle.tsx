import React from 'react';

import EcomStep from './enums/ecom-step';
import EcomStepTransitions from './ecom-step-transitions';

import EcomHeader from './ecom-header';
import EcomStepContent from './ecom-step-content';
import EcomCart from './ecom-cart';
import EcomTimeline from './ecom-timeline';

import { IVehicle, IEcomData, IEcomStore } from './types';
import StoreAction from './enums/store-action';

interface IEcomLifecycleProps extends IEcomStore {
    vehicle: IVehicle;
    data: IEcomData;
}

interface IState {
    step: EcomStep;
    stepHistory: EcomStep[];
    isBackwardsStepForbidden: boolean;
}

const getNewStep = (currentStep: EcomStep, state): EcomStep => {
    const transition = EcomStepTransitions[currentStep];

    if (transition) {
        return transition(state);
    } else {
        throw 'Did not find a possible transition.';
    }
};

class EcomLifecycle extends React.Component<IEcomLifecycleProps, IState> {
    constructor(props: IEcomLifecycleProps) {
        super(props);

        this.componentDidTransitionForward = this.componentDidTransitionForward.bind(this);

        this.handleNextStepClick = this.handleNextStepClick.bind(this);
        this.handleRejectedStepForward = this.handleRejectedStepForward.bind(this);
        this.handlePreviousStepClick = this.handlePreviousStepClick.bind(this);
        this.handleSpecificStepClick = this.handleSpecificStepClick.bind(this);

        this.state = {
            step: EcomStep.TRADE_IN_EXISTS_CHOOSER,
            stepHistory: [ EcomStep.TRADE_IN_EXISTS_CHOOSER ],
            isBackwardsStepForbidden: false
        };
    }

    componentDidTransitionForward() {
        //Custom lifecycle event

        const insurance = this.props.data.insurance;
        const customer = this.props.data.customer;

        const shouldUpdateCustomerPersonalNumber = insurance.personalNumber && customer.personalNumber === null;

        if (shouldUpdateCustomerPersonalNumber) {
            this.props.dispatchStoreAction(StoreAction.CUSTOMER_UPDATE_PERSONAL_NUMBER, insurance.personalNumber);
        }
    }

    handleNextStepClick() {
        const nextStep = getNewStep(this.state.step, this.state);

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
        const interact = { ...this.props.data.interact };

        switch (this.state.step) {
            case EcomStep.TRADE_IN_CAR_DEFINITION:
                this.props.dispatchStoreAction(StoreAction.INTERACT_SET_ALL_FOR_TYPE, 'tradeInCar');
                break;

            case EcomStep.INSURANCE_INFORMATION_DEFINITION:
                this.props.dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, { insurance: { personalNumber: true }});
                break;

            case EcomStep.CUSTOMER_INFORMATION_INITIAL:
                this.props.dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, { customer: { personalNumber: true }});
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

    handleSpecificStepClick(step) {
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

        return (
            <div data-am-frame="" style={{ marginBottom: '200px'}}>
                <div className="frame-body">
                    <EcomHeader
                        canPressBackButton={canPressBackButton}
                        onPreviousStepClick={this.handlePreviousStepClick} />

                    <EcomTimeline step={this.state.step} />

                    <div data-am-page="">
                        <EcomStepContent
                            step={this.state.step}
                            {...this.props}

                            onNextStepClick={this.handleNextStepClick}
                            onShowCustomerInformationInitial={() => this.handleSpecificStepClick(EcomStep.CUSTOMER_INFORMATION_INITIAL)}
                            onShowInsuranceInformationDefinition={() => this.handleSpecificStepClick(EcomStep.INSURANCE_INFORMATION_DEFINITION)}
                            onShowTradeInCarDefinition={() => this.handleSpecificStepClick(EcomStep.TRADE_IN_CAR_DEFINITION)} />*
                    </div>
                </div>

                <EcomCart vehicle={this.props.vehicle} />
            </div>
        );
    }
};

export default EcomLifecycle;