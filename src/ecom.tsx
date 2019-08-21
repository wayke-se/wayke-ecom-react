import React from "react";

import EcomStep from './enums/ecom-step';
import EcomStepTransitions from './ecom-step-transitions';

import EcomHeader from './ecom-header';
import EcomStepContent from './ecom-step-content';
import EcomCart from './ecom-cart';
import EcomTimeline from './ecom-timeline';

export interface IEcomProps {
    vehicle: {
        title: string;
        shortDescription: string;
    }
}

interface IState {
    registrationNumber: string;
}

const getNewStep = (currentStep, state) => {
    const transition = EcomStepTransitions[currentStep];

    if (transition) {
        return transition(state);
    } else {
        throw 'Did not find a possible transition.';
    }
};

class Ecom extends React.Component<IEcomProps, IState> {
    private state: IState = {
        registrationNumber: "",
    };

    constructor(props: IEcomProps) {
        super(props);

        this.componentDidTransitionForward = this.componentDidTransitionForward.bind(this);

        this.handleNextStepClick = this.handleNextStepClick.bind(this);
        this.handleRejectedStepForward = this.handleRejectedStepForward.bind(this);
        this.handlePreviousStepClick = this.handlePreviousStepClick.bind(this);
        this.handleSpecificStepClick = this.handleSpecificStepClick.bind(this);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.handleHasTradeInCarChange = this.handleHasTradeInCarChange.bind(this);
        this.handlePaymentMethodChange = this.handlePaymentMethodChange.bind(this);
        this.handleInsuranceOptionChange = this.handleInsuranceOptionChange.bind(this);
        this.handleInsuranceAlternativeChange = this.handleInsuranceAlternativeChange.bind(this);
        this.handleInsuranceExpectedDrivingDistanceChange = this.handleInsuranceExpectedDrivingDistanceChange.bind(this);
        this.handleCustomerInformationInputTypeChange = this.handleCustomerInformationInputTypeChange.bind(this);
        this.handleTermsToggle = this.handleTermsToggle.bind(this);
        this.handleDeliveryTypeChange = this.handleDeliveryTypeChange.bind(this);
        this.handleFinancingValuesChange = this.handleFinancingValuesChange.bind(this);

        this.state = {
            step: EcomStep.TRADE_IN_EXISTS_CHOOSER,
            stepHistory: [ EcomStep.TRADE_IN_EXISTS_CHOOSER ],
            isBackwardsStepForbidden: false,

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
            }
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

    handleInputChange(e) {
        const name = e.target.name;

        this.setState({
            [name]: e.target.value
        });
    }

    handleInputBlur(e) {
        let interact = { ...this.state.interact };
        interact[e.target.name] = true;
        this.setState({ interact });
    }

    handleHasTradeInCarChange(value) {
        this.setState({
            hasTradeInCar: value
        }, () => {
            this.handleNextStepClick();
        });
    }

    handlePaymentMethodChange(paymentMethod) {
        this.setState({
            paymentMethod
        }, () => {
            this.handleNextStepClick();
        });
    }

    handleInsuranceOptionChange(insuranceOption) {
        this.setState({
            insuranceOption
        }, () => {
            this.handleNextStepClick();
        });
    }

    handleInsuranceAlternativeChange(insuranceAlternative) {
        this.setState({
            insuranceAlternative
        }, () => {
            this.handleNextStepClick();
        });
    }

    handleInsuranceExpectedDrivingDistanceChange(expectedDrivingDistance) {
        this.setState({
            insuranceExpectedDrivingDistance: expectedDrivingDistance
        });
    }

    handleCustomerInformationInputTypeChange(customerInformationInputType) {
        this.setState({
            customerInformationInputType
        }, () => {
            this.handleNextStepClick();
        });
    }

    handleTermsToggle() {
        this.setState({
            hasAcceptedTerms: !this.state.hasAcceptedTerms
        });
    }

    handleDeliveryTypeChange(deliveryType) {
        this.setState({
            deliveryType
        }, () => {
            this.handleNextStepClick();
        });
    }

    handleFinancingValuesChange(downPayment, duration) {
        this.setState({
            financingDownPayment: downPayment,
            financingDuration: duration
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
                            {...this.state}

                            onNextStepClick={this.handleNextStepClick}
                            onSpecificStepClick={this.handleSpecificStepClick}

                            onInputChange={this.handleInputChange}
                            onInputBlur={this.handleInputBlur}
                            onHasTradeInCarChange={this.handleHasTradeInCarChange}
                            onPaymentMethodChange={this.handlePaymentMethodChange}
                            onInsuranceOptionChange={this.handleInsuranceOptionChange}
                            onInsuranceAlternativeChange={this.handleInsuranceAlternativeChange}
                            onInsuranceExpectedDrivingDistanceChange={this.handleInsuranceExpectedDrivingDistanceChange}
                            onCustomerInformationInputTypeChange={this.handleCustomerInformationInputTypeChange}
                            onTermsToggle={this.handleTermsToggle}
                            onDeliveryTypeChange={this.handleDeliveryTypeChange}
                            onFinancingValuesChange={this.handleFinancingValuesChange}

                            onShowCustomerInformationInitial={() => this.handleSpecificStepClick(EcomStep.CUSTOMER_INFORMATION_INITIAL)}
                            onShowInsuranceInformationDefinition={() => this.handleSpecificStepClick(EcomStep.INSURANCE_INFORMATION_DEFINITION)}
                            onShowTradeInCarDefinition={() => this.handleSpecificStepClick(EcomStep.TRADE_IN_CAR_DEFINITION)} />
                    </div>
                </div>

                <EcomCart vehicle={this.props.vehicle} />
            </div>
        );
    }
}

Ecom.propTypes = {
};

export default Ecom;