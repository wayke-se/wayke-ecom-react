import React from 'react';

import { IEcomContext, IEcomLifecycle, IEcomStore, IEcomExternalProps, ILoanSpecification, IEcomData } from '../types';

import StoreAction from '../constants/store-action';

import Slider from '../components/slider';
import Alert from '../components/alert';
import SpinnerInline from '../components/spinner-inline';

import { validateStringNumberInRange } from '../utils/validation';
import { addSizeQuery } from '../utils/image';
import { getLoanInformation } from '../utils/loan';
import { formatPrice } from '../utils/helpers';
import { validatePayment } from '../tools/data-validation';
import { PaymentType } from 'wayke-ecom';

export interface IPaymentFinancingDetailsProps extends IEcomExternalProps, IEcomContext, IEcomStore, IEcomLifecycle {
};

interface IState {
    isShowingDetails: boolean;
    hasRequestError: boolean;

    deposit: string;
    durationIndex: number;
    residual: string;
};

const getAllDurationSteps = (loanSpecification: ILoanSpecification) => {
    const difference = loanSpecification.durationMax - loanSpecification.durationMin;
    const numberOfSteps = difference / loanSpecification.durationStep;

    const result = [];

    for (var i = 0; i <= numberOfSteps; i++) {
        const value = loanSpecification.durationMin + i * loanSpecification.durationStep;
        result.push(value);
    }

    return result;
};

const getIndexFromDuration = (duration: number, loanSpecification: ILoanSpecification): number => {
    return getAllDurationSteps(loanSpecification).findIndex(s => s === duration);
};

const getDurationFromIndex = (index: number, loanSpecification: ILoanSpecification): number => {
    return getAllDurationSteps(loanSpecification).find((s, i) => i === index);
};

class PaymentFinancingDetails extends React.Component<IPaymentFinancingDetailsProps, IState> {
    constructor(props: IPaymentFinancingDetailsProps) {
        super(props);

        this.handleDetailsClick = this.handleDetailsClick.bind(this);
        this.handleDurationChange = this.handleDurationChange.bind(this);
        this.handleInputValueChange = this.handleInputValueChange.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.handleValueUpdated = this.handleValueUpdated.bind(this);
        this.handleProceedClick = this.handleProceedClick.bind(this);

        const loanSpecification = props.loanSpecification;

        const deposit = props.data.payment.loanDeposit ? props.data.payment.loanDeposit : loanSpecification.depositDefault;
        const duration = props.data.payment.loanDuration ? props.data.payment.loanDuration : loanSpecification.durationDefault;
        const residual = props.data.payment.loanResidual ? props.data.payment.loanResidual : loanSpecification.residualDefault;

        const durationIndex = getIndexFromDuration(duration, loanSpecification);

        this.state = {
            isShowingDetails: false,
            hasRequestError: false,

            deposit: deposit + '',
            residual: residual + '',
            durationIndex
        };
    }

    handleDetailsClick() {
        this.setState({
            isShowingDetails: !this.state.isShowingDetails
        });
    }

    handleDurationChange(e) {
        this.setState({
            durationIndex: e.target.selectedIndex
        }, () => {
            this.handleValueUpdated();
        });
    }

    handleInputValueChange(e) {
        // @ts-ignore
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSliderChange(name, value) {
        // @ts-ignore
        this.setState({
            [name]: value
        });
    }

    handleValueUpdated(callback?: (state: IEcomData) => void) {
        const loanSpecification = this.props.loanSpecification;

        const {
            depositMin,
            depositMax,

            residualMin,
            residualMax
        } = loanSpecification;

        const deposit = validateStringNumberInRange(this.state.deposit, depositMin, depositMax) ? parseInt(this.state.deposit) : null;
        const duration = getDurationFromIndex(this.state.durationIndex, loanSpecification);
        const residual = validateStringNumberInRange(this.state.residual, residualMin, residualMax) ? parseInt(this.state.residual) : null;

        const proceedAfterRequestMade = (state: IEcomData, isSuccessful: boolean) => {
            this.setState({
                hasRequestError: !isSuccessful
            }, () => {
                if (callback) {
                    callback(state);
                }
            });
        }

        const proceedAfterStoreChanged = (state: IEcomData) => {
            this.props.onFetchPaymentInformation((isSuccessful: boolean) => {
                proceedAfterRequestMade(state, isSuccessful);
            });
        }

        this.props.dispatchStoreAction(StoreAction.PAYMENT_UPDATE_FINANCING_INFORMATION, {
            loanDeposit: deposit,
            loanDuration: duration,
            loanResidual: residual
        }, (state: IEcomData) => {
            proceedAfterStoreChanged(state);
        });
    }

    handleProceedClick() {
        this.handleValueUpdated((state: IEcomData) => {
            const isValidPayment = validatePayment(state.payment);

            if (!isValidPayment) {
                return;
            }

            this.props.onProceedToNextStep();
        });
    }

    render() {
        const loanSpecification = this.props.loanSpecification;

        const options = getAllDurationSteps(loanSpecification).map(s => s + 'mån');

        const optionItems = options.map((o, index) => <option key={index}>{o}</option>);
        const durationValue = options[this.state.durationIndex];

        const {
            depositMin,
            depositMax,
            depositStep,

            residualMin,
            residualMax,
            residualStep
        } = loanSpecification;

        const hasDownPaymentError = !validateStringNumberInRange(this.state.deposit, depositMin, depositMax);
        const hasResidualError = !validateStringNumberInRange(this.state.residual, residualMin, residualMax);

        const paymentOption = this.props.orderOptions.getPaymentOptions().find(p => p.type === PaymentType.Loan);
        const scaledImage = addSizeQuery(paymentOption.logo, 100, 60);

        const loanDetails = paymentOption.loanDetails;
        const deposit = parseInt(this.state.deposit);
        const duration = getDurationFromIndex(this.state.durationIndex, loanSpecification);
        const loanInformation = getLoanInformation(this.props.vehicle.price, duration, deposit, loanDetails.interest, loanDetails.administrationFee, loanDetails.setupFee);

        const formattedPrice = formatPrice(loanInformation.monthlyCost);
        const formattedInterest = formatPrice(loanInformation.interest);
        const formattedEffectiveInterest = formatPrice(loanInformation.effectiveInterest);
        const formattedSetupFee = formatPrice(loanInformation.setupFee);
        const formattedAdministrationFee = formatPrice(loanInformation.administrationFee);
        const formattedTotalCreditCost = formatPrice(loanInformation.totalCreditCost);

        return (
            <div className="page-main">
                <section className="page-section">
                    <div data-ecom-columnrow="">
                        <div className="column">
                            <h1 className="h6 no-margin">Betalsätt</h1>
                            <div className="font-size-small">{paymentOption.name}</div>
                        </div>

                        { paymentOption.logo &&
                            <div className="column valign-top minimal">
                                <img src={scaledImage} alt="Logotype" className="l-block" />
                            </div>
                        }
                    </div>
                </section>

                <section className="page-section">
                    <div data-ecom-form="">
                        <div className={`form-group ${hasDownPaymentError ? ' has-error' : ''}`}>
                            <label data-ecom-inputlabel="" htmlFor="payment-input-downpayment">Kontantinsats (kr)</label>

                            <div data-ecom-inputtext="">
                                <input type="text"
                                    id="payment-input-downpayment"
                                    name="deposit"
                                    placeholder="Kontantinsats"
                                    value={this.state.deposit}
                                    disabled={this.props.isWaitingForResponse}
                                    onChange={this.handleInputValueChange}
                                    onBlur={() => { this.handleValueUpdated(); }} />
                            </div>

                            <div className="form-alert">Mellan {formatPrice(depositMin)}kr och {formatPrice(depositMax)}kr.</div>

                            <div className="m-t">
                                <div data-ecom-rangeslider="" className={this.props.isWaitingForResponse ? 'disabled' : ''}>
                                    <div className="range-slider">
                                        { !hasDownPaymentError &&
                                            <Slider
                                                min={depositMin}
                                                max={depositMax}
                                                step={depositStep}
                                                initialValue={parseInt(this.state.deposit)}
                                                isDisabled={this.props.isWaitingForResponse}
                                                onChange={(value) => { this.handleSliderChange('deposit', value); }}
                                                onAfterChange={this.handleValueUpdated} />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label data-ecom-inputlabel="" htmlFor="payment-input-installment">Avbetalning (mil)</label>

                            <div data-ecom-select="" className={this.props.isWaitingForResponse ? 'is-disabled' : ''}>
                                <select className="select"
                                        value={durationValue}
                                        disabled={this.props.isWaitingForResponse}
                                        onChange={this.handleDurationChange}>
                                    {optionItems}
                                </select>
                            </div>

                            <div className="m-t">
                                <div data-ecom-rangeslider="" className={this.props.isWaitingForResponse ? 'disabled' : ''}>
                                    <div className="range-slider">
                                        <Slider
                                            min={0}
                                            max={options.length - 1}
                                            step={1}
                                            initialValue={this.state.durationIndex}
                                            isDisabled={this.props.isWaitingForResponse}
                                            onChange={(value) => { this.handleSliderChange('durationIndex', value); }}
                                            onAfterChange={this.handleValueUpdated} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`form-group ${hasResidualError ? ' has-error' : ''}`}>
                            <label data-ecom-inputlabel="" htmlFor="payment-input-residual">Restvärde (%)</label>

                            <div data-ecom-inputtext="">
                                <input type="text"
                                    id="payment-input-residual"
                                    name="residual"
                                    placeholder="Restvärde"
                                    value={this.state.residual}
                                    disabled={this.props.isWaitingForResponse}
                                    onChange={this.handleInputValueChange}
                                    onBlur={() => { this.handleValueUpdated(); }} />
                            </div>

                            <div className="form-alert">Mellan {formatPrice(residualMin)}kr och {formatPrice(residualMax)}kr.</div>

                            <div className="m-t">
                                <div data-ecom-rangeslider="" className={this.props.isWaitingForResponse ? 'disabled' : ''}>
                                    <div className="range-slider">
                                        { !hasResidualError &&
                                            <Slider
                                                min={residualMin}
                                                max={residualMax}
                                                step={residualStep}
                                                initialValue={parseInt(this.state.residual)}
                                                isDisabled={this.props.isWaitingForResponse}
                                                onChange={(value) => { this.handleSliderChange('residual', value); }}
                                                onAfterChange={this.handleValueUpdated} />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                { this.state.hasRequestError &&
                    <section className="page-section">
                        <Alert message="Tyvärr gick någonting fel. Prova gärna igen om en liten stund." />
                    </section>
                }

                <section className="page-section">
                    <div className="h6 m-b-mini">{this.props.isWaitingForResponse ? <SpinnerInline /> : formattedPrice} kr/mån</div>
                    <div className="font-size-small">Beräknat på {formattedInterest}% ränta (effektivt {formattedEffectiveInterest}%)</div>
                    <div className="m-t-half">
                        <button data-ecom-link="" className="l-block" onClick={this.handleDetailsClick}>{this.state.isShowingDetails ? 'Färre detaljer' : 'Detaljer'}</button>
                    </div>
                    { this.state.isShowingDetails &&
                        <div className="m-t">
                            <div data-ecom-columnrow="" className="repeat-m-half">
                                <div className="column">
                                    <div className="font-medium font-size-small">Ränta</div>
                                </div>
                                <div className="column">{formattedInterest}%</div>
                            </div>
                            <div data-ecom-columnrow="" className="repeat-m-half">
                                <div className="column">
                                    <div className="font-medium font-size-small">Effektiv ränta	</div>
                                </div>
                                <div className="column">{formattedEffectiveInterest}%</div>
                            </div>
                            <div data-ecom-columnrow="" className="repeat-m-half">
                                <div className="column">
                                    <div className="font-medium font-size-small">Uppläggningskostnad</div>
                                </div>
                                <div className="column">{formattedSetupFee}kr</div>
                            </div>
                            <div data-ecom-columnrow="" className="repeat-m-half">
                                <div className="column">
                                    <div className="font-medium font-size-small">Administrativa avgifter</div>
                                </div>
                                <div className="column">{formattedAdministrationFee}kr/mån</div>
                            </div>
                            <div data-ecom-columnrow="" className="repeat-m-half">
                                <div className="column">
                                    <div className="font-medium font-size-small">Total kreditkostnad</div>
                                </div>
                                <div className="column">{formattedTotalCreditCost}kr</div>
                            </div>
                        </div>
                    }
                </section>

                <section className="page-section page-section-bottom">
                    <div data-ecom-buttonnav="">
                        <div className="button-nav-item" onClick={this.handleProceedClick}>
                            <button data-ecom-button="full-width" disabled={this.props.isWaitingForResponse}>
                                Välj finansiering
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
};

export default PaymentFinancingDetails;