import React from 'react';

import { validateNumberInRange } from '../utils/validation';
import { IEcomLifecycle, IEcomStore } from '../types';
import StoreAction from '../enums/store-action';
import Slider from '../components/slider';
import { IOrderOptionsResponse } from 'wayke-ecom';

export interface IPaymentFinancingDetailsProps extends IEcomStore, IEcomLifecycle {
    options: IOrderOptionsResponse;
};

interface IState {
    downPayment: string;
    duration: number;
};

const downPaymentMin = 50000;
const downPaymentMax = 500000;

const getIndexFromDuration = (duration: number): number => {
    return duration / 24 - 1;
};

const getDurationFromIndex = (index: number): number => {
    return (index + 1) * 24;
};

class PaymentFinancingDetails extends React.Component<IPaymentFinancingDetailsProps, IState> {
    constructor(props: IPaymentFinancingDetailsProps) {
        super(props);

        this.handleDurationChange = this.handleDurationChange.bind(this);
        this.handleDurationSliderChange = this.handleDurationSliderChange.bind(this);

        this.handleDownPaymentChange = this.handleDownPaymentChange.bind(this);
        this.handleDownPaymentSliderChange = this.handleDownPaymentSliderChange.bind(this);

        this.handleValueUpdated = this.handleValueUpdated.bind(this);
        this.handleProceedClick = this.handleProceedClick.bind(this);

        this.state = {
            downPayment: props.data.payment.financingDownPayment ? '' + props.data.payment.financingDownPayment : '100000',
            duration: props.data.payment.financingDuration ? getIndexFromDuration(props.data.payment.financingDuration) : 1
        };
    }

    handleDurationChange(e) {
        this.setState({
            duration: e.target.selectedIndex
        }, () => {
            this.handleValueUpdated();
        });
    }

    handleDurationSliderChange(e) {
        this.setState({
            duration: e
        });
    }

    handleDownPaymentChange(e) {
        this.setState({
            downPayment: e.target.value
        });
    }

    handleDownPaymentSliderChange(e) {
        this.setState({
            downPayment: e
        });
    }

    handleValueUpdated() {
        const downPayment = validateNumberInRange(this.state.downPayment, downPaymentMin, downPaymentMax) ? parseInt(this.state.downPayment) : null;
        const duration = getDurationFromIndex(this.state.duration);

        this.props.dispatchStoreAction(StoreAction.PAYMENT_UPDATE_FINANCING_INFORMATION, {
            financingDownPayment: downPayment,
            financingDuration: duration
        });
    }

    handleProceedClick() {
        this.handleValueUpdated();
        this.props.onNextStepClick();
    }

    render() {
        const durationCount = 10;
        const options = [];

        for (let i = 0; i < durationCount; i++) {
            options.push(getDurationFromIndex(i) + 'mån');
        }

        const optionItems = options.map((o, index) => <option key={index}>{o}</option>);
        const durationValue = options[this.state.duration];

        const hasDownPaymentError = !validateNumberInRange(this.state.downPayment, downPaymentMin, downPaymentMax);
        const paymentOption = this.props.data.payment.paymentOption;
        console.log(paymentOption);

        return (
            <div className="page-main">
                <section className="page-section">
                    <div data-am-columnrow="">
                        <div className="column">
                            <h1 className="h6 no-margin">Betalsätt</h1>
                            <div className="font-size-small">{paymentOption.name}</div>
                        </div>

                        { paymentOption.logo &&
                            <div className="column valign-top minimal">
                                <img src={paymentOption.logo} alt="Audi logotype" className="l-block" />
                            </div>
                        }
                    </div>
                </section>

                <section className="page-section">
                    <div data-am-form="">
                        <div className={`form-group ${hasDownPaymentError ? ' has-error' : ''}`}>
                            <label data-am-inputlabel="" htmlFor="payment-input-downpayment">Kontantinsats (kr)</label>

                            <div data-am-inputtext="">
                                <input type="text"
                                    id="payment-input-downpayment"
                                    placeholder="Kontantinsats"
                                    value={this.state.downPayment}
                                    onChange={this.handleDownPaymentChange}
                                    onBlur={this.handleValueUpdated} />
                            </div>

                            <div className="alert">Mellan 50 000kr och 500 000kr.</div>

                            <div className="m-t">
                                <div data-am-rangeslider="">
                                    <div className="range-slider">
                                        { !hasDownPaymentError &&
                                            <Slider
                                                min={downPaymentMin}
                                                max={downPaymentMax}
                                                step={1000}
                                                initialValue={parseInt(this.state.downPayment) || downPaymentMin}
                                                onChange={this.handleDownPaymentSliderChange}
                                                onAfterChange={this.handleValueUpdated} />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label data-am-inputlabel="" htmlFor="payment-input-installment">Avbetalning (mil)</label>

                            <div data-am-select="">
                                <select className="select" value={durationValue} onChange={this.handleDurationChange}>
                                    {optionItems}
                                </select>
                            </div>

                            <div className="m-t">
                                <div data-am-rangeslider="">
                                    <div className="range-slider">
                                        <Slider
                                            min={0}
                                            max={durationCount - 1}
                                            step={1}
                                            initialValue={this.state.duration}
                                            onChange={this.handleDurationSliderChange}
                                            onAfterChange={this.handleValueUpdated} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="page-section">
                    <div className="h6 m-b-mini">5 700 kr/mån</div>
                    <div className="font-size-small">Beräknat på 4,65% ränta (effektivt 4,75%)</div>
                    <div className="m-t-half">
                        <button data-am-link="" className="l-block">Detaljer</button>
                    </div>
                </section>

                <section className="page-section page-section-bottom">
                    <div data-am-buttonnav="">
                        <div className="button-nav-item" onClick={this.handleProceedClick}>
                            <div data-am-button="full-width">
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