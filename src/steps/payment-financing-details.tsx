import React from "react";

import {
    IEcomContext,
    IEcomLifecycle,
    IEcomStore,
    IEcomExternalProps,
    IEcomData,
} from "../types";

import StoreAction from "../constants/store-action";

import Slider from "../components/slider";
import Alert from "../components/alert";
import SpinnerInline from "../components/spinner-inline";

import { validateStringNumberInRange } from "../utils/validation";
import { addSizeQuery } from "../utils/image";
import { formatPrice, formatPercentage } from "../utils/helpers";
import { getLoanDetails } from "../utils/payment";
import {
    getConvertedResidualSpecification,
    isResidualEnabled,
    isResidualFixed,
} from "../utils/residual";

import { validatePayment } from "../tools/data-validation";
import {
    PaymentType,
    IPaymentRangeSpec,
    IPaymentLookupResponse,
} from "@wayke-se/ecom";
import UserEvent from "../constants/user-event";
import HelperBoxLabel from "../components/helper-box-label";
import HelperLabel from "../components/helper-label";
import { getRetailerInformation } from "../utils/retailer";
import shouldUseCreditAssessment from "../utils/credit-assessment/usage-resolver";

interface IProceedButtonProps {
    updating: boolean;
    onClick: () => void;
}

const ProceedButton = ({ updating, onClick }: IProceedButtonProps) => (
    <div data-ecom-buttonnav="">
        <div className="button-nav-item">
            <button
                data-ecom-button="full-width"
                disabled={updating}
                onClick={onClick}
            >
                {!updating ? (
                    "Gå vidare"
                ) : (
                    <>
                        <div data-ecom-spinner="inline" className="m-r-half">
                            <div className="spinner" />
                        </div>
                        Uppdaterar
                    </>
                )}
            </button>
        </div>
    </div>
);

export interface IPaymentFinancingDetailsProps
    extends IEcomExternalProps,
        IEcomContext,
        IEcomStore,
        IEcomLifecycle {}

interface IState {
    isShowingDetails: boolean;
    hasRequestError: boolean;

    deposit: string;
    durationIndex: number;
    residual: string;
}

const getAllDurationSteps = (durationSpecification: IPaymentRangeSpec) => {
    const difference = durationSpecification.max - durationSpecification.min;
    const numberOfSteps = difference / durationSpecification.step;

    const result = [];

    for (let i = 0; i <= numberOfSteps; i += 1) {
        const value =
            durationSpecification.min + i * durationSpecification.step;
        result.push(value);
    }

    return result;
};

const getIndexFromDuration = (
    duration: number,
    durationSpecification: IPaymentRangeSpec
): number =>
    getAllDurationSteps(durationSpecification).findIndex((s) => s === duration);

const getDurationFromIndex = (
    index: number,
    durationSpecification: IPaymentRangeSpec
): number =>
    getAllDurationSteps(durationSpecification).find((_, i) => i === index);

const createFinancialProviderLink = (
    loanDetails: IPaymentLookupResponse,
    title: string
) => {
    let url = loanDetails.getPublicURL();
    if (!url) {
        return "";
    }

    const titleParam = `title=${title}`;
    url = url.includes("?") ? `${url}&${titleParam}` : `${url}?${titleParam}`;
    return encodeURI(url);
};

class PaymentFinancingDetails extends React.Component<
    IPaymentFinancingDetailsProps,
    IState
> {
    constructor(props: IPaymentFinancingDetailsProps) {
        super(props);

        this.handleDetailsClick = this.handleDetailsClick.bind(this);
        this.handleDurationChange = this.handleDurationChange.bind(this);
        this.handleInputValueChange = this.handleInputValueChange.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.handleValueUpdated = this.handleValueUpdated.bind(this);
        this.handleProceedClick = this.handleProceedClick.bind(this);
        this.updateStoreValues = this.updateStoreValues.bind(this);

        const loanDetails = getLoanDetails(
            props.orderOptions,
            props.paymentLookup
        );

        const convertedResidualSpecification =
            getConvertedResidualSpecification(
                loanDetails.getResidualValueSpec()
            );
        const hasResidual = isResidualEnabled(convertedResidualSpecification);

        let residual = null;

        if (hasResidual) {
            residual = props.data.payment.loanResidual
                ? props.data.payment.loanResidual * 100
                : convertedResidualSpecification.default;
        }

        const deposit = props.data.payment.loanDeposit
            ? props.data.payment.loanDeposit
            : loanDetails.getDownPaymentSpec().default;
        const duration = props.data.payment.loanDuration
            ? props.data.payment.loanDuration
            : loanDetails.getDurationSpec().default;

        const durationIndex = getIndexFromDuration(
            duration,
            loanDetails.getDurationSpec()
        );

        this.state = {
            durationIndex,
            isShowingDetails: false,
            hasRequestError: false,
            deposit: `${deposit}`,
            residual: residual === null ? null : `${residual}`,
        };
    }

    handleDetailsClick() {
        this.setState({
            isShowingDetails: !this.state.isShowingDetails,
        });
    }

    handleDurationChange(e) {
        this.setState(
            {
                durationIndex: e.target.selectedIndex,
            },
            () => {
                this.handleValueUpdated();
            }
        );
    }

    handleInputValueChange(e) {
        // @ts-ignore
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleSliderChange(name, value) {
        // @ts-ignore
        this.setState({
            [name]: value,
        });
    }

    handleValueUpdated() {
        this.updateStoreValues((state: IEcomData) => {
            const isValidPayment = validatePayment(
                state.payment,
                this.props.orderOptions,
                this.props.paymentLookup
            );

            if (!isValidPayment) {
                return;
            }

            this.props.onFetchPaymentInformation((isSuccessful: boolean) => {
                this.setState({
                    hasRequestError: !isSuccessful,
                });
            });
        });
    }

    handleProceedClick() {
        this.props.dispatchStoreAction(
            StoreAction.UPDATE_NAMED_VALUE,
            {
                type: "payment",
                name: "hasAcceptedLoanDetails",
                value: true,
            },
            () => {
                this.updateStoreValues((state: IEcomData) => {
                    const isValidPayment = validatePayment(
                        state.payment,
                        this.props.orderOptions,
                        this.props.paymentLookup
                    );

                    if (!isValidPayment) {
                        return;
                    }

                    this.props.onIncompleteUserEvent(
                        UserEvent.PAYMENT_TYPE_LOAN_CHOSEN
                    );

                    this.props.onFetchPaymentInformation(
                        (isSuccessful: boolean) => {
                            if (isSuccessful) {
                                this.setState({
                                    hasRequestError: false,
                                });
                                this.props.onProceedToNextStep();
                            } else {
                                this.setState({
                                    hasRequestError: true,
                                });
                            }
                        }
                    );
                });
            }
        );
    }

    updateStoreValues(callback?: (state: IEcomData) => void) {
        const loanDetails = getLoanDetails(
            this.props.orderOptions,
            this.props.paymentLookup
        );

        const depositSpecification = loanDetails.getDownPaymentSpec();
        const durationSpecification = loanDetails.getDurationSpec();
        const convertedResidualSpecification =
            getConvertedResidualSpecification(
                loanDetails.getResidualValueSpec()
            );

        const deposit = validateStringNumberInRange(
            this.state.deposit,
            depositSpecification.min,
            depositSpecification.max
        )
            ? parseInt(this.state.deposit, 10)
            : null;
        const duration = getDurationFromIndex(
            this.state.durationIndex,
            durationSpecification
        );

        let residual = null;
        const hasResidual = isResidualEnabled(convertedResidualSpecification);

        if (hasResidual) {
            const residualMin = convertedResidualSpecification.min;
            const residualMax = convertedResidualSpecification.max;

            residual = validateStringNumberInRange(
                this.state.residual,
                residualMin,
                residualMax
            )
                ? parseInt(this.state.residual, 10) / 100
                : null;
        }

        this.props.dispatchStoreAction(
            StoreAction.PAYMENT_UPDATE_FINANCING_INFORMATION,
            {
                loanDeposit: deposit,
                loanDuration: duration,
                loanResidual: residual,
            },
            (state: IEcomData) => {
                if (callback) {
                    callback(state);
                }
            }
        );
    }

    render() {
        const loanDetails = getLoanDetails(
            this.props.orderOptions,
            this.props.paymentLookup
        );

        const depositSpecification = loanDetails.getDownPaymentSpec();
        const durationSpecification = loanDetails.getDurationSpec();
        const convertedResidualSpecification =
            getConvertedResidualSpecification(
                loanDetails.getResidualValueSpec()
            );

        const options = getAllDurationSteps(durationSpecification).map(
            (s) => `${s} mån`
        );

        const optionItems = options.map((o, index) => (
            <option key={index}>{o}</option>
        ));
        const durationValue = options[this.state.durationIndex];

        let residual = null;
        let residualMin = null;
        let residualMax = null;
        let residualStep = null;
        let residualFixed = null;

        const hasResidual = isResidualEnabled(convertedResidualSpecification);
        const hasFixedResidual = isResidualFixed(
            convertedResidualSpecification
        );

        if (hasResidual) {
            residual = this.state.residual;
            residualMin = convertedResidualSpecification.min;
            residualMax = convertedResidualSpecification.max;
            residualStep = convertedResidualSpecification.step;
        }

        if (hasFixedResidual) {
            residualFixed = convertedResidualSpecification.min;
        }

        const hasDepositError = !validateStringNumberInRange(
            this.state.deposit,
            depositSpecification.min,
            depositSpecification.max
        );
        const hasResidualError =
            hasResidual &&
            !validateStringNumberInRange(residual, residualMin, residualMax);

        const hasAnyError = hasDepositError || hasResidualError;

        const isDepositDisabled =
            (hasAnyError && !hasDepositError) ||
            this.props.isWaitingForResponse;
        const isDurationDisabled =
            hasAnyError || this.props.isWaitingForResponse;
        const isResidualDisabled =
            (hasAnyError && !hasResidualError) ||
            this.props.isWaitingForResponse;

        const paymentOption = this.props.orderOptions
            .getPaymentOptions()
            .find((p) => p.type === PaymentType.Loan);
        const scaledImage = addSizeQuery(paymentOption.logo, 100, 60);

        const formattedPrice = formatPrice(loanDetails.getCosts().monthlyCost);
        const formattedInterest = formatPercentage(
            loanDetails.getInterests().interest
        );
        const formattedEffectiveInterest = formatPercentage(
            loanDetails.getInterests().effectiveInterest
        );
        const formattedSetupFee = formatPrice(loanDetails.getFees().setupFee);
        const formattedAdministrationFee = formatPrice(
            loanDetails.getFees().administrationFee
        );
        const formattedTotalCreditCost = formatPrice(
            loanDetails.getCosts().totalCreditCost
        );
        const formattedTotalResidualValue = formatPrice(
            loanDetails.getTotalResidualValue()
        );
        const formattedCreditAmount = formatPrice(
            loanDetails.getCreditAmount()
        );
        const creditPercentage = !!loanDetails.getPrice()
            ? loanDetails.getCreditAmount() / loanDetails.getPrice()
            : 0;
        const formattedCreditPercentage = formatPercentage(creditPercentage);

        const publicUrl = createFinancialProviderLink(
            loanDetails,
            this.props.vehicle.title
        );

        const onDepositChange = (value) => {
            this.handleSliderChange("deposit", value);
        };

        const onDurationChange = (value) => {
            this.handleSliderChange("durationIndex", value);
        };

        const onResidualValueChange = (value) => {
            this.handleSliderChange("residual", value);
        };

        const footNote =
            hasResidual || hasFixedResidual
                ? `Beräknat på ${formattedInterest} % ränta (effektivt ${formattedEffectiveInterest} %) och en årlig körsträcka om 1500 mil.`
                : `Beräknat på ${formattedInterest} % ränta (effektivt ${formattedEffectiveInterest} %).`;
        const loanText = `Lån (${formattedCreditPercentage} %): ${formattedCreditAmount} kr`;

        const retailerInformation = getRetailerInformation(
            this.props.orderOptions
        );
        const retailerName = !!retailerInformation
            ? retailerInformation.name
            : "Handlaren";

        const useCreditAssessment = shouldUseCreditAssessment(
            this.props.data,
            this.props.orderOptions
        );
        const description = useCreditAssessment
            ? `Betala bilen med finansiering via ${paymentOption.name}. Gör din låneansökan här – och få besked direkt. Kom ihåg, köpet är inte bindande förrän du signerat det definitiva affärsförslaget som tas fram av säljaren.`
            : `Betala bilen med finansiering via ${paymentOption.name}.`;

        return (
            <div className="page-main">
                <section className="page-section">
                    <div data-ecom-columnrow="">
                        <div className="column">
                            <h1 className="h6 no-margin">Billån</h1>
                            <div className="font-size-small">
                                {paymentOption.name}
                            </div>
                        </div>

                        {paymentOption.logo && (
                            <div className="column minimal">
                                <img
                                    src={scaledImage}
                                    alt="Logotype"
                                    className="l-block"
                                    style={{
                                        maxWidth: "100px",
                                        maxHeight: "60px",
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <div data-ecom-content="" className="m-t-half">
                        <p>{description}</p>
                        <p>
                            Ange din tänkta kontantinsats och hur många månader
                            du vill lägga upp ditt lån på.
                        </p>
                    </div>
                    <div data-ecom-columnrow="">
                        <div className="column">
                            <button
                                data-ecom-link="font-inerit"
                                onClick={this.props.onShowPaymentMethodChooser}
                                className="m-t"
                            >
                                Ändra finansiering
                            </button>
                        </div>
                    </div>
                </section>

                <section className="page-section">
                    <div data-ecom-form="">
                        <div
                            className={`form-group ${
                                hasDepositError ? " has-error" : ""
                            }`}
                        >
                            <HelperBoxLabel
                                label="Kontantinsats (kr)"
                                forId="payment-input-downpayment"
                                title="Hur mycket av dina egna pengar vill du lägga?"
                            >
                                <p>
                                    {`Kontantinsatsen är en del av bilens pris som du betalar med egna pengar. Den behöver vara minst 20% av priset på bilen. Kontantinsatsen betalar du senare i samband med avtalsskrivning hos ${retailerName}.`}
                                </p>
                                <p>
                                    {`Ifall du har en inbytesbil kan du betala kontantinsatsen med den. Detta kommer du överens om tillsammans med ${retailerName} vid avtalsskrivning.`}
                                </p>
                            </HelperBoxLabel>
                            <div data-ecom-inputtext="">
                                <input
                                    type="text"
                                    id="payment-input-downpayment"
                                    name="deposit"
                                    placeholder="Kontantinsats"
                                    value={this.state.deposit}
                                    disabled={isDepositDisabled}
                                    onChange={this.handleInputValueChange}
                                    onBlur={this.handleValueUpdated}
                                />
                            </div>
                            <div className="m-t">
                                {!hasDepositError && (
                                    <Slider
                                        min={depositSpecification.min}
                                        max={depositSpecification.max}
                                        step={depositSpecification.step}
                                        initialValue={parseInt(
                                            this.state.deposit,
                                            10
                                        )}
                                        isDisabled={isDepositDisabled}
                                        onChange={onDepositChange}
                                        onAfterChange={this.handleValueUpdated}
                                    />
                                )}
                            </div>
                            <div className="form-alert">
                                Mellan {formatPrice(depositSpecification.min)}kr
                                och {formatPrice(depositSpecification.max)}kr
                            </div>
                        </div>

                        <div className="form-group">
                            <HelperLabel label="Avbetalning (mån)" />
                            <div
                                data-ecom-select=""
                                className={
                                    this.props.isWaitingForResponse
                                        ? "is-disabled"
                                        : ""
                                }
                            >
                                <select
                                    className="select"
                                    value={durationValue}
                                    disabled={isDurationDisabled}
                                    onChange={this.handleDurationChange}
                                >
                                    {optionItems}
                                </select>
                            </div>
                            <div className="m-t">
                                <Slider
                                    min={0}
                                    max={options.length - 1}
                                    step={1}
                                    initialValue={this.state.durationIndex}
                                    isDisabled={isDurationDisabled}
                                    onChange={onDurationChange}
                                    onAfterChange={this.handleValueUpdated}
                                />
                            </div>
                        </div>

                        {hasResidual && (
                            <div
                                className={`form-group ${
                                    hasResidualError ? " has-error" : ""
                                }`}
                            >
                                <div
                                    data-ecom-columnrow=""
                                    className="m-b-half"
                                >
                                    <div className="column">
                                        <label
                                            data-ecom-inputlabel=""
                                            htmlFor="payment-input-residual"
                                            className="no-margin"
                                        >
                                            Restskuld (%)
                                        </label>
                                    </div>
                                    <div className="column">
                                        <div className="font-medium font-size-small">
                                            {formattedTotalResidualValue} kr
                                        </div>
                                    </div>
                                </div>
                                <div data-ecom-inputtext="">
                                    <input
                                        type="text"
                                        id="payment-input-residual"
                                        name="residual"
                                        placeholder="Restskuld"
                                        value={this.state.residual}
                                        disabled={isResidualDisabled}
                                        onChange={this.handleInputValueChange}
                                        onBlur={this.handleValueUpdated}
                                    />
                                </div>
                                <div className="m-t">
                                    {!hasResidualError && (
                                        <React.Fragment>
                                            <Slider
                                                min={residualMin}
                                                max={residualMax}
                                                step={residualStep}
                                                initialValue={parseInt(
                                                    this.state.residual,
                                                    10
                                                )}
                                                isDisabled={isResidualDisabled}
                                                onChange={onResidualValueChange}
                                                onAfterChange={
                                                    this.handleValueUpdated
                                                }
                                            />
                                        </React.Fragment>
                                    )}
                                </div>
                                <div className="form-alert">
                                    Mellan {residualMin} % och {residualMax} %
                                </div>
                            </div>
                        )}

                        {hasFixedResidual && (
                            <div className="form-group">
                                <div
                                    data-ecom-columnrow=""
                                    className="m-b-half"
                                >
                                    <div className="column">
                                        <label
                                            data-ecom-inputlabel=""
                                            htmlFor="payment-input-residual"
                                            className="no-margin"
                                        >
                                            Restskuld (%)
                                        </label>
                                    </div>
                                </div>

                                <div
                                    data-ecom-columnrow=""
                                    className="m-b-half"
                                >
                                    <div className="column">
                                        {residualFixed}%
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {this.state.hasRequestError && (
                    <section className="page-section">
                        <Alert message="Tyvärr gick någonting fel. Prova gärna igen om en liten stund." />
                    </section>
                )}

                <section className="page-section">
                    <div className="h6 m-b-mini">
                        {this.props.isWaitingForResponse ? (
                            <SpinnerInline />
                        ) : (
                            formattedPrice
                        )}{" "}
                        kr/mån
                    </div>
                    <div className="font-size-small">{footNote}</div>
                    <div className="font-size-small">{loanText}</div>

                    <div className="m-t-half">
                        <button
                            data-ecom-link=""
                            className="l-block"
                            onClick={this.handleDetailsClick}
                        >
                            {this.state.isShowingDetails
                                ? "Färre detaljer"
                                : "Detaljer"}
                        </button>
                    </div>

                    {this.state.isShowingDetails && (
                        <React.Fragment>
                            <div className="m-t">
                                <div
                                    data-ecom-columnrow=""
                                    className="repeat-m-half"
                                >
                                    <div className="column">
                                        <div className="font-medium font-size-small">
                                            Avbetalningsperiod
                                        </div>
                                    </div>
                                    <div className="column">
                                        {this.props.isWaitingForResponse ? (
                                            <SpinnerInline />
                                        ) : (
                                            durationValue
                                        )}
                                    </div>
                                </div>
                                <div
                                    data-ecom-columnrow=""
                                    className="repeat-m-half"
                                >
                                    <div className="column">
                                        <div className="font-medium font-size-small">
                                            Ränta
                                        </div>
                                    </div>
                                    <div className="column">
                                        {this.props.isWaitingForResponse ? (
                                            <SpinnerInline />
                                        ) : (
                                            formattedInterest
                                        )}{" "}
                                        %
                                    </div>
                                </div>
                                <div
                                    data-ecom-columnrow=""
                                    className="repeat-m-half"
                                >
                                    <div className="column">
                                        <div className="font-medium font-size-small">
                                            Effektiv ränta{" "}
                                        </div>
                                    </div>
                                    <div className="column">
                                        {this.props.isWaitingForResponse ? (
                                            <SpinnerInline />
                                        ) : (
                                            formattedEffectiveInterest
                                        )}{" "}
                                        %
                                    </div>
                                </div>
                                <div
                                    data-ecom-columnrow=""
                                    className="repeat-m-half"
                                >
                                    <div className="column">
                                        <div className="font-medium font-size-small">
                                            Uppläggningskostnad
                                        </div>
                                    </div>
                                    <div className="column">
                                        {this.props.isWaitingForResponse ? (
                                            <SpinnerInline />
                                        ) : (
                                            formattedSetupFee
                                        )}{" "}
                                        kr
                                    </div>
                                </div>
                                <div
                                    data-ecom-columnrow=""
                                    className="repeat-m-half"
                                >
                                    <div className="column">
                                        <div className="font-medium font-size-small">
                                            Administrativa avgifter
                                        </div>
                                    </div>
                                    <div className="column">
                                        {this.props.isWaitingForResponse ? (
                                            <SpinnerInline />
                                        ) : (
                                            formattedAdministrationFee
                                        )}{" "}
                                        kr/mån
                                    </div>
                                </div>
                                <div
                                    data-ecom-columnrow=""
                                    className="repeat-m-half"
                                >
                                    <div className="column">
                                        <div className="font-medium font-size-small">
                                            Total kreditkostnad
                                        </div>
                                    </div>
                                    <div className="column">
                                        {this.props.isWaitingForResponse ? (
                                            <SpinnerInline />
                                        ) : (
                                            formattedTotalCreditCost
                                        )}{" "}
                                        kr
                                    </div>
                                </div>
                                <div
                                    data-ecom-content
                                    className="text-dark-lighten font-size-small m-t"
                                >
                                    <p>
                                        *Det här är inte den slutgiltiga
                                        offerten. Räntan kan komma att ändras
                                        ifall det sker justeringar i initial
                                        amorteringsplan, tillägg i utrustning
                                        eller andra ändringar som påverkar det
                                        initiala prisförslaget.
                                    </p>

                                    <p>
                                        Om marknadsräntan förändras kan
                                        månadskostnaden komma att ändras i
                                        motsvarande mån. Månadskostnaden kan
                                        också komma att påverkas av den
                                        kreditriskklass låntagaren åsätts vid en
                                        kreditbedömning.
                                    </p>
                                </div>
                            </div>

                            {publicUrl && (
                                <div data-ecom-content="" className="m-t">
                                    <a
                                        data-ecom-link=""
                                        href={publicUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {`Mer information om ${paymentOption.name}`}
                                        <i className="icon-link-external m-l-half" />
                                    </a>
                                </div>
                            )}
                        </React.Fragment>
                    )}
                    <div data-ecom-alert className="m-t">
                        <div className="alert-icon-section">
                            <div className="alert-icon">
                                <i className="icon-exclamation no-margin"></i>
                            </div>
                        </div>
                        <div className="alert-content">
                            Det är inte förrän i kontakt med säljaren som det
                            definitiva affärsförslaget tas fram av säljaren och
                            godkänns av dig som kund. I samband med leverans
                            signeras det finansiella avtalet och det är först då
                            avtalet är bindande.
                        </div>
                    </div>
                </section>

                <section className="page-section page-section-bottom">
                    <ProceedButton
                        updating={this.props.isWaitingForResponse}
                        onClick={this.handleProceedClick}
                    />
                </section>
            </div>
        );
    }
}

export default PaymentFinancingDetails;
