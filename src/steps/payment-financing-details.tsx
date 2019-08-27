import React from 'react';

import { IOrderOptionsResponse } from 'wayke-ecom';
import { IEcomLifecycle, IEcomStore, IVehicle } from '../types';

import StoreAction from '../enums/store-action';
import Slider from '../components/slider';

import { validateNumberInRange } from '../utils/validation';
import { addSizeQuery } from '../utils/image';
import { getDefaultDeposit, getMinDeposit, getMaxDeposit, getDefaultDuration, getMinDuration, getMaxDuration, getDurationStep, getLoanInformation } from '../utils/loan';
import { formatPrice } from '../utils/helpers';

export interface IPaymentFinancingDetailsProps extends IEcomStore, IEcomLifecycle {
    options: IOrderOptionsResponse;
    vehicle: IVehicle;
};

interface IState {
    isShowingDetails: boolean;
    deposit: string;
    durationIndex: number;
};

const getAllDurationSteps = () => {
    const difference = getMaxDuration() - getMinDuration();
    const numberOfSteps = difference / getDurationStep();

    const result = [];

    for (var i = 0; i <= numberOfSteps; i++) {
        const value = getMinDuration() + i * getDurationStep();
        result.push(value);
    }

    return result;
};

const getIndexFromDuration = (duration: number): number => {
    return getAllDurationSteps().findIndex(s => s === duration);
};

const getDurationFromIndex = (index: number): number => {
    return getAllDurationSteps().find((s, i) => i === index);
};

class PaymentFinancingDetails extends React.Component<IPaymentFinancingDetailsProps, IState> {
    constructor(props: IPaymentFinancingDetailsProps) {
        super(props);

        this.handleDetailsClick = this.handleDetailsClick.bind(this);
        this.handleDurationChange = this.handleDurationChange.bind(this);
        this.handleDurationSliderChange = this.handleDurationSliderChange.bind(this);
        this.handleDepositChange = this.handleDepositChange.bind(this);
        this.handleDepositSliderChange = this.handleDepositSliderChange.bind(this);
        this.handleValueUpdated = this.handleValueUpdated.bind(this);
        this.handleProceedClick = this.handleProceedClick.bind(this);

        const deposit = props.data.payment.financingDeposit ? props.data.payment.financingDeposit : getDefaultDeposit(props.vehicle.price);
        const duration = props.data.payment.financingDuration ? props.data.payment.financingDuration : getDefaultDuration();

        const durationIndex = getIndexFromDuration(duration);

        this.state = {
            isShowingDetails: false,
            deposit: deposit + '',
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

    handleDurationSliderChange(e) {
        this.setState({
            durationIndex: e
        });
    }

    handleDepositChange(e) {
        this.setState({
            deposit: e.target.value
        });
    }

    handleDepositSliderChange(e) {
        this.setState({
            deposit: e
        });
    }

    handleValueUpdated() {
        const depositMin = getMinDeposit(this.props.vehicle.price);
        const depositMax = getMaxDeposit(this.props.vehicle.price);

        const deposit = validateNumberInRange(this.state.deposit, depositMin, depositMax) ? parseInt(this.state.deposit) : null;
        const duration = getDurationFromIndex(this.state.durationIndex);

        this.props.dispatchStoreAction(StoreAction.PAYMENT_UPDATE_FINANCING_INFORMATION, {
            financingDeposit: deposit,
            financingDuration: duration
        });
    }

    handleProceedClick() {
        this.handleValueUpdated();
        this.props.onNextStepClick();
    }

    render() {
        const options = getAllDurationSteps().map(s => s + 'mån');

        const optionItems = options.map((o, index) => <option key={index}>{o}</option>);
        const durationValue = options[this.state.durationIndex];

        const depositMin = getMinDeposit(this.props.vehicle.price);
        const depositMax = getMaxDeposit(this.props.vehicle.price);

        const hasDownPaymentError = !validateNumberInRange(this.state.deposit, depositMin, depositMax);
        const paymentOption = this.props.data.payment.paymentOption;

        const scaledImage = addSizeQuery(paymentOption.logo, 100, 60);

        const loanDetails = paymentOption.loanDetails;
        const deposit = parseInt(this.state.deposit);
        const duration = getDurationFromIndex(this.state.durationIndex);
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
                                <img src={scaledImage} alt="Audi logotype" className="l-block" />
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
                                    placeholder="Kontantinsats"
                                    value={this.state.deposit}
                                    onChange={this.handleDepositChange}
                                    onBlur={this.handleValueUpdated} />
                            </div>

                            <div className="form-alert">Mellan {formatPrice(depositMin)}kr och {formatPrice(depositMax)}kr.</div>

                            <div className="m-t">
                                <div data-ecom-rangeslider="">
                                    <div className="range-slider">
                                        { !hasDownPaymentError &&
                                            <Slider
                                                min={depositMin}
                                                max={depositMax}
                                                step={10}
                                                initialValue={parseInt(this.state.deposit)}
                                                onChange={this.handleDepositSliderChange}
                                                onAfterChange={this.handleValueUpdated} />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label data-ecom-inputlabel="" htmlFor="payment-input-installment">Avbetalning (mil)</label>

                            <div data-ecom-select="">
                                <select className="select" value={durationValue} onChange={this.handleDurationChange}>
                                    {optionItems}
                                </select>
                            </div>

                            <div className="m-t">
                                <div data-ecom-rangeslider="">
                                    <div className="range-slider">
                                        <Slider
                                            min={0}
                                            max={options.length - 1}
                                            step={1}
                                            initialValue={this.state.durationIndex}
                                            onChange={this.handleDurationSliderChange}
                                            onAfterChange={this.handleValueUpdated} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="page-section">
                    <div className="h6 m-b-mini">{formattedPrice} kr/mån</div>
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
                            <div data-ecom-button="full-width">
                                Välj finansiering
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
};

export default PaymentFinancingDetails;