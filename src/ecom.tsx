import React from "react";

import EcomStep from './enums/ecom-step';
import EcomStepTransitions from './ecom-step-transitions';

import EcomHeader from './ecom-header';
import EcomStepContent from './ecom-step-content';
import EcomCart from './ecom-cart';
import EcomTimeline from './ecom-timeline';

import { IVehicle } from "./types";
import { EcomProvider } from "./ecom-context-provider";

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

/*
            hasTradeInCar: null,
            registrationNumber: '',
            milage: '',

            paymentMethod: null,
            financingDownPayment: '',
            financingDuration: '',

            insuranceOption: null,
            insurancePersonalNumber: '',
            insuranceExpectedDrivingDistance: null,
            insuranceAlternative: null,

            customerPersonalNumber: null,
            customerInformationInputType: null,
            customerName: '',
            customerAdress: '',
            customerZip: '',
            customerCity: '',
            customerEmail: '',
            customerPhone: '',
            hasAcceptedTerms: false,

            deliveryType: null,

            interact: {
                registrationNumber: false,
                milage: false,

                insurancePersonalNumber: false,

                customerPersonalNumber: false,
                customerName: false,
                customerAdress: false,
                customerZip: false,
                customerCity: false,
                customerEmail: false,
                customerPhone: false,
                hasAcceptedTerms: false,
            }*/

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

        const shouldUpdateCustomerPersonalNumber = this.state.insurancePersonalNumber && this.state.customerPersonalNumber === null;

        if (shouldUpdateCustomerPersonalNumber) {
            this.setState({
                customerPersonalNumber: this.state.insurancePersonalNumber
            });
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
        let interact = { ...this.state.interact };

        switch (this.state.step) {
            case EcomStep.TRADE_IN_CAR_DEFINITION:
                interact.registrationNumber = true;
                interact.milage = true;
                this.setState({ interact });
                break;

            case EcomStep.INSURANCE_INFORMATION_DEFINITION:
                interact.insurancePersonalNumber = true;
                this.setState({ interact });
                break;

            case EcomStep.CUSTOMER_INFORMATION_INITIAL:
                interact.customerPersonalNumber = true;
                this.setState({ interact });
                break;

            case EcomStep.CUSTOMER_INFORMATION_DETAILS:
                interact.customerPersonalNumber = true;
                interact.customerName = true;
                interact.customerAdress = true;
                interact.customerZip = true;
                interact.customerCity = true;
                interact.customerEmail = true;
                interact.customerPhone = true;
                interact.hasAcceptedTerms = true;
                this.setState({ interact });
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