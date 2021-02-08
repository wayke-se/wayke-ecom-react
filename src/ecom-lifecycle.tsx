import React from "react";
import { IOrderOptionsResponse } from "@wayke-se/ecom";

import EcomStep from "./constants/ecom-step";
import UserEvent from "./constants/user-event";
import OverlayType from "./constants/overlay-type";
import {
    getAllTransitions,
    getInitialStep,
    getIdentificationStep,
} from "./ecom-step-transitions";

import EcomHeader from "./ecom-header";
import EcomStepContent from "./ecom-step-content";
import EcomCart from "./ecom-cart";
import EcomTimeline from "./ecom-timeline";
import EcomOverlayContent from "./ecom-overlay-content";

import {
    IEcomExternalProps,
    IEcomContext,
    IEcomStore,
    IEcomData,
} from "./types";

interface IEcomLifecycleProps
    extends IEcomExternalProps,
        IEcomContext,
        IEcomStore {}

interface IState {
    step: EcomStep | undefined;
    stepHistory: EcomStep[];
    isBackwardsStepForbidden: boolean;
    hasNewStep: boolean;
    displayOverlay: boolean;
    overlayType: OverlayType;
}

const getNextStep = (
    currentStep: EcomStep,
    data: IEcomData,
    options: IOrderOptionsResponse
): EcomStep => {
    const transition = getAllTransitions()[currentStep];

    if (!transition) {
        throw new Error("Did not find a possible transition.");
    }

    return transition(data, options);
};

const shouldShowCart = (step: EcomStep) => {
    switch (step) {
        case EcomStep.CUSTOMER_INFORMATION_DETAILS:
        case EcomStep.FINAL_CONFIRMATION:
            return false;
        default:
            return true;
    }
};

class EcomLifecycle extends React.Component<IEcomLifecycleProps, IState> {
    private frameBodyRef: React.RefObject<HTMLDivElement>;
    private rootRef: React.RefObject<HTMLDivElement>;
    state: {
        step: any;
        stepHistory: any[];
        isBackwardsStepForbidden: boolean;
        hasNewStep: boolean;
        displayOverlay: boolean;
        overlayType: any;
    };

    constructor(props: IEcomLifecycleProps) {
        super(props);

        this.handleProceedToNextStep = this.handleProceedToNextStep.bind(this);
        this.handlePreviousStepClick = this.handlePreviousStepClick.bind(this);
        this.handleSpecificStepClick = this.handleSpecificStepClick.bind(this);
        this.handleIncompleteUserEvent = this.handleIncompleteUserEvent.bind(
            this
        );
        this.onDisplayOverlay = this.onDisplayOverlay.bind(this);
        this.onHideOverlay = this.onHideOverlay.bind(this);

        this.frameBodyRef = React.createRef();
        this.rootRef = React.createRef();

        this.state = {
            step: undefined,
            stepHistory: [],
            isBackwardsStepForbidden: false,
            hasNewStep: false,
            displayOverlay: false,
            overlayType: undefined,
        };
    }

    componentDidUpdate() {
        const hasOrderOptions = this.props.orderOptions;
        const hasNoStep = this.state.step === undefined;

        const shouldSetInitialStep = hasOrderOptions && hasNoStep;
        const shouldForceDealer = shouldSetInitialStep && this.props.orderOptions.getDealerSites()?.length === 1;

        if (shouldForceDealer) {
            const dealer = this.props.orderOptions.getDealerSites()[0];
            this.props.onHandleDealerSelection(dealer);
            return;
        }

        if (shouldSetInitialStep) {
            const initialStep = getInitialStep(this.props.orderOptions);

            this.setState({
                stepHistory: [initialStep],
                step: initialStep,
            });
        }

        if (this.state.hasNewStep) {
            this.setState(
                {
                    hasNewStep: false,
                },
                () => {
                    if (this.frameBodyRef.current) {
                        this.frameBodyRef.current.scrollTop = 0;
                    }

                    if (this.rootRef.current) {
                        this.rootRef.current.scrollTop = 0;
                    }
                }
            );
        }
    }

    handleProceedToNextStep() {
        const nextStep = getNextStep(
            this.state.step,
            this.props.data,
            this.props.orderOptions
        );

        if (!nextStep) {
            return;
        }

        const newHistory = [...this.state.stepHistory];
        newHistory.push(nextStep);

        this.setState({
            step: nextStep,
            stepHistory: newHistory,
            isBackwardsStepForbidden: nextStep === EcomStep.FINAL_CONFIRMATION,
            hasNewStep: true,
        });
    }

    handlePreviousStepClick() {
        if (this.state.isBackwardsStepForbidden) {
            return;
        }

        const newHistory = [...this.state.stepHistory];
        newHistory.pop();

        if (newHistory.length === 0) {
            return;
        }

        const previousStep = newHistory[newHistory.length - 1];

        this.setState({
            step: previousStep,
            stepHistory: newHistory,
        });
    }

    handleSpecificStepClick(step: EcomStep) {
        let newHistory = [...this.state.stepHistory];
        const hasStepInHistory = newHistory.includes(step);

        if (hasStepInHistory) {
            const index = newHistory.indexOf(step);
            newHistory = newHistory.slice(0, index + 1);
        } else {
            newHistory.push(step);
        }

        this.setState({
            step,
            stepHistory: newHistory,
        });
    }

    handleIncompleteUserEvent(userEvent: UserEvent) {
        if (this.props.onUserEvent) {
            const userEventKey = UserEvent[userEvent];
            const ecomStepKey = EcomStep[this.state.step];

            this.props.onUserEvent(userEventKey, ecomStepKey);
        }
    }

    onDisplayOverlay(overlayType: OverlayType) {
        this.setState({ overlayType });
        this.setState({ displayOverlay: true });
    }

    onHideOverlay() {
        this.setState({ displayOverlay: false });
        this.setState({ overlayType: undefined });
    }

    render() {
        const canPressBackButton =
            this.state.stepHistory.length > 1 &&
            !this.state.isBackwardsStepForbidden;
        const showCart = shouldShowCart(this.state.step);

        const onShowCustomerInformationInitial = () =>
            this.handleSpecificStepClick(
                getIdentificationStep(this.props.useBankId)
            );

        const onShowInsuranceInformationDefinition = () =>
            this.handleSpecificStepClick(
                EcomStep.INSURANCE_INFORMATION_DEFINITION
            );

        const onShowTradeInCarDefinition = () =>
            this.handleSpecificStepClick(EcomStep.TRADE_IN_CAR_DEFINITION);
        const onShowPaymentMethodChooser = () =>
            this.handleSpecificStepClick(EcomStep.PAYMENT_METHOD_CHOOSER);

        return (
            <div data-ecom-modal="" className="wayke-ecom" ref={this.rootRef}>
                <div className="modal-container">
                    <div className="modal-center">
                        <div className="modal-dialog">
                            <div className="modal-dialog-main">
                                {!this.state.displayOverlay && (
                                    <div data-ecom-frame="">
                                        <div
                                            className="frame-body"
                                            ref={this.frameBodyRef}
                                        >
                                            <EcomHeader
                                                {...this.props}
                                                step={this.state.step}
                                                canPressBackButton={
                                                    canPressBackButton
                                                }
                                                onPreviousStepClick={
                                                    this.handlePreviousStepClick
                                                }
                                                onIncompleteUserEvent={
                                                    this
                                                        .handleIncompleteUserEvent
                                                }
                                            />

                                            <EcomTimeline
                                                currentStep={this.state.step}
                                                options={
                                                    this.props.orderOptions
                                                }
                                                useBankId={this.props.useBankId}
                                            />

                                            <div data-ecom-page="">
                                                <EcomStepContent
                                                    step={this.state.step}
                                                    {...this.props}
                                                    onProceedToNextStep={
                                                        this
                                                            .handleProceedToNextStep
                                                    }
                                                    onPreviousStepClick={
                                                        this
                                                            .handlePreviousStepClick
                                                    }
                                                    onShowCustomerInformationInitial={
                                                        onShowCustomerInformationInitial
                                                    }
                                                    onShowInsuranceInformationDefinition={
                                                        onShowInsuranceInformationDefinition
                                                    }
                                                    onShowTradeInCarDefinition={
                                                        onShowTradeInCarDefinition
                                                    }
                                                    onShowPaymentMethodChooser={
                                                        onShowPaymentMethodChooser
                                                    }
                                                    onIncompleteUserEvent={
                                                        this
                                                            .handleIncompleteUserEvent
                                                    }
                                                    onDisplayOverlay={
                                                        this.onDisplayOverlay
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {showCart && (
                                            <EcomCart {...this.props} />
                                        )}
                                    </div>
                                )}
                                {this.state.displayOverlay && (
                                    <EcomOverlayContent
                                        onHideOverlay={this.onHideOverlay}
                                        onProceedToNextStep={
                                            this.handleProceedToNextStep
                                        }
                                        type={this.state.overlayType}
                                        {...this.props}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EcomLifecycle;
