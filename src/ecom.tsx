import React from "react";

import EcomStep from './enums/ecom-step';
import EcomStepTransitions from './ecom-step-transitions';

import EcomHeader from './ecom-header';
import EcomStepContent from './ecom-step-content';
import EcomCart from './ecom-cart';
import EcomTimeline from './ecom-timeline';

import { IVehicle } from "./types";
import { EcomProvider, getDispatch, getCustomer, getInsurance, getInteract } from "./ecom-context-provider";
import { setInteracted } from './actions/interact';
import { updatePersonalNumber as updateCustomerPersonalNumber } from './actions/customer';

export interface IEcomProps {
    vehicle: IVehicle;
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

class Ecom extends React.Component<IEcomProps, IState> {
    constructor(props: IEcomProps) {
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

        const insurance = getInsurance();
        const customer = getCustomer();

        const shouldUpdateCustomerPersonalNumber = insurance.personalNumber && customer.personalNumber === null;

        if (shouldUpdateCustomerPersonalNumber) {
            updateCustomerPersonalNumber(getDispatch(), insurance.personalNumber);
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
        const interact = { ...getInteract() };
        const dispact = getDispatch();

        switch (this.state.step) {
            case EcomStep.TRADE_IN_CAR_DEFINITION:
                interact.tradeInCar = {
                    registrationNumber: true,
                    milage: true
                }
                setInteracted(dispact, interact);
                break;

            case EcomStep.INSURANCE_INFORMATION_DEFINITION:
                interact.insurance.personalNumber = true;
                setInteracted(dispact, interact);
                break;

            case EcomStep.CUSTOMER_INFORMATION_INITIAL:
                interact.customer.personalNumber = true;
                setInteracted(dispact, interact);
                break;

            case EcomStep.CUSTOMER_INFORMATION_DETAILS:
                interact.customer = {
                    personalNumber: true,
                    name: true,
                    adress: true,
                    zip: true,
                    city: true,
                    email: true,
                    phone: true
                };
                setInteracted(dispact, interact);
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
            <EcomProvider>
                <div data-am-frame="" style={{ marginBottom: '200px'}}>
                    <div className="frame-body">
                        <EcomHeader
                            canPressBackButton={canPressBackButton}
                            onPreviousStepClick={this.handlePreviousStepClick} />

                        <EcomTimeline step={this.state.step} />

                        <div data-am-page="">
                            <EcomStepContent
                                step={this.state.step}

                                onNextStepClick={this.handleNextStepClick}
                                onShowCustomerInformationInitial={() => this.handleSpecificStepClick(EcomStep.CUSTOMER_INFORMATION_INITIAL)}
                                onShowInsuranceInformationDefinition={() => this.handleSpecificStepClick(EcomStep.INSURANCE_INFORMATION_DEFINITION)}
                                onShowTradeInCarDefinition={() => this.handleSpecificStepClick(EcomStep.TRADE_IN_CAR_DEFINITION)} />*
                        </div>
                    </div>

                    <EcomCart vehicle={this.props.vehicle} />
                </div>
            </EcomProvider>
        );
    }
}

export default Ecom;