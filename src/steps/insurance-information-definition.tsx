import React from "react";
import marked from "marked";

import { DrivingDistance } from "@wayke-se/ecom";
import { IEcomLifecycle, IEcomStore, IEcomContext, IEcomData } from "../types";

import StoreAction from "../constants/store-action";
import UserEvent from "../constants/user-event";
import { validateInsurance } from "../tools/data-validation";

import Alert from "../components/alert";
import Spinner from "../components/spinner";

import { getDrivingDistanceLabel } from "../utils/insurance";
import { addSizeQuery } from "../utils/image";
import { validatePersonalNumber } from "../utils/validation";
import { htmlEncode } from "../utils/encode";

export interface IInsuranceInformationDefinitionProps
    extends IEcomContext,
        IEcomStore,
        IEcomLifecycle {}

interface IState {
    expectedDrivingDistanceIndex: number;
    hasRequestError: boolean;
}

const markedRenderer = new marked.Renderer();
const linkRenderer = markedRenderer.link;

markedRenderer.link = (href: any, title: any, text: any) => {
    const html = linkRenderer.call(markedRenderer, href, title, text);
    return html.replace(/<a/, '<a target="_blank"');
};

const drivingDistanceOptions = Object.keys(DrivingDistance);

const getIndexFromOption = (option: DrivingDistance): number => {
    return drivingDistanceOptions.indexOf(option);
};

class InsuranceInformationDefinition extends React.Component<
    IInsuranceInformationDefinitionProps,
    IState
> {
    constructor(props: IInsuranceInformationDefinitionProps) {
        super(props);

        this.handleExpectedDrivingDistanceChange = this.handleExpectedDrivingDistanceChange.bind(
            this
        );
        this.handleProceedClick = this.handleProceedClick.bind(this);
        this.handleProceedAfterUpdate = this.handleProceedAfterUpdate.bind(
            this
        );
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);

        this.state = {
            expectedDrivingDistanceIndex: this.props.data.insurance
                .expectedDrivingDistance
                ? getIndexFromOption(
                      this.props.data.insurance.expectedDrivingDistance
                  )
                : 0,
            hasRequestError: false,
        };
    }

    componentDidMount() {
        const insurancePersonalNumber = this.props.data.insurance
            .personalNumber;
        const customerPersonalNumber = this.props.data.customer.personalNumber;

        if (!insurancePersonalNumber && !!customerPersonalNumber) {
            this.props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
                type: "insurance",
                name: "personalNumber",
                value: customerPersonalNumber,
            });
        }
    }

    handleExpectedDrivingDistanceChange(
        e: React.ChangeEvent<HTMLSelectElement>
    ) {
        this.setState(
            {
                expectedDrivingDistanceIndex: e.target.selectedIndex,
            },
            () => {
                this.props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
                    type: "insurance",
                    name: "expectedDrivingDistance",
                    value:
                        drivingDistanceOptions[
                            this.state.expectedDrivingDistanceIndex
                        ],
                });
            }
        );
    }

    handleWantsToSeeInsuranceOptionsChange(
        wantsToSeeInsuranceOptions: boolean
    ) {
        this.props.dispatchStoreAction(
            StoreAction.UPDATE_NAMED_VALUE,
            {
                type: "insurance",
                name: "wantsToSeeInsuranceOptions",
                value: wantsToSeeInsuranceOptions,
            },
            () => {
                if (wantsToSeeInsuranceOptions) {
                    this.handleProceedClick();
                } else {
                    this.props.onIncompleteUserEvent(
                        UserEvent.INSURANCE_SKIPPED
                    );
                    this.props.onProceedToNextStep();
                }
            }
        );
    }

    handleProceedClick() {
        this.props.dispatchStoreAction(
            StoreAction.UPDATE_NAMED_VALUE,
            {
                type: "insurance",
                name: "expectedDrivingDistance",
                value:
                    drivingDistanceOptions[
                        this.state.expectedDrivingDistanceIndex
                    ],
            },
            (state: IEcomData) => {
                this.handleProceedAfterUpdate(state);
            }
        );
    }

    handleProceedAfterUpdate(state: IEcomData) {
        const isValidInsurance = validateInsurance(state.insurance);

        if (!isValidInsurance) {
            return this.props.dispatchStoreAction(
                StoreAction.INTERACT_SET_ALL_FOR_TYPE,
                "insurance"
            );
        }

        this.setState(
            {
                hasRequestError: false,
            },
            () => {
                this.props.onFetchInsuranceOptions((isSuccessful: boolean) => {
                    if (isSuccessful) {
                        this.props.onProceedToNextStep();
                    } else {
                        this.setState({ hasRequestError: true });
                    }
                });
            }
        );
    }

    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "insurance",
            name: e.target.name,
            value: e.target.value,
        });
    }

    handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        this.props.dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, {
            type: "insurance",
            name: e.target.name,
        });
    }

    render() {
        const optionValues = drivingDistanceOptions.map((o: DrivingDistance) =>
            getDrivingDistanceLabel(o)
        );

        const optionItems = optionValues.map((v, index) => (
            <option key={index}>{v}</option>
        ));
        const selectedValue =
            optionValues[this.state.expectedDrivingDistanceIndex];

        const hasPersonalNumberError =
            this.props.data.interact.insurance.personalNumber &&
            !validatePersonalNumber(this.props.data.insurance.personalNumber);

        const insuranceOption = this.props.orderOptions.getInsuranceOption();
        const scaledImage = addSizeQuery(insuranceOption.logo, 100, 60);

        let markdownEcomInsuranceText;

        if (insuranceOption.ecomInsuranceText) {
            const encodedEcomInsuranceText = htmlEncode(
                insuranceOption.ecomInsuranceText
            );
            markdownEcomInsuranceText = marked(encodedEcomInsuranceText, {
                renderer: markedRenderer,
            });
        }

        const onShowInsuranceAlternatives = () =>
            this.handleWantsToSeeInsuranceOptionsChange(true);
        const onSkipInsuranceAlternatives = () =>
            this.handleWantsToSeeInsuranceOptionsChange(false);

        return (
            <div className="page-main">
                <section className="page-section">
                    <div data-ecom-columnrow="">
                        <div className="column">
                            <h1 className="h6 no-margin">Försäkring</h1>
                        </div>

                        {scaledImage && (
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
                </section>

                <section className="page-section">
                    <div data-ecom-content="">
                        <p>
                            Vill du teckna försäkring via{" "}
                            {insuranceOption.title} på din nya bil?
                        </p>
                        {markdownEcomInsuranceText && (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: markdownEcomInsuranceText,
                                }}
                            />
                        )}
                        <p>
                            Skriv in ditt personnummer och din uppskattade
                            körsträcka för att se din försäkringskostnad. Vill
                            du teckna en försäkring via Volvia på din nya bil?
                            Ange din uppskattade körsträcka för att se din
                            försäkringskostnad. Därefter presenterar vi förslag
                            på försäkringar som passar dig och din nya bil. I
                            både hel- och halvförsäkring ingår trafikförsäkring
                            som är obligatoriskt att ha.
                        </p>
                    </div>
                </section>

                <section className="page-section">
                    <div data-ecom-form="">
                        <div
                            className={`form-group ${
                                hasPersonalNumberError ? " has-error" : ""
                            }`}
                        >
                            <label
                                data-ecom-inputlabel=""
                                htmlFor="insurance-input-personalnr"
                            >
                                Personnummer
                            </label>

                            <div data-ecom-inputtext="">
                                <input
                                    type="text"
                                    id="insurance-input-personalnr"
                                    name="personalNumber"
                                    placeholder="ÅÅÅÅMMDD-XXXX"
                                    value={
                                        this.props.data.insurance.personalNumber
                                    }
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleBlur}
                                />
                            </div>

                            <div className="form-alert">
                                Ange personnummer i formatet ÅÅÅÅMMDD-XXXX
                            </div>
                        </div>

                        <div className="form-group">
                            <label
                                data-ecom-inputlabel=""
                                htmlFor="insurance-input-mileage"
                            >
                                Uppskattad körsträcka per år
                            </label>
                            <div data-ecom-select="">
                                <select
                                    className="select"
                                    value={selectedValue}
                                    onChange={
                                        this.handleExpectedDrivingDistanceChange
                                    }
                                >
                                    {optionItems}
                                </select>
                            </div>
                        </div>

                        {this.state.hasRequestError && (
                            <div className="form-group">
                                <Alert message="Tyvärr hittades inga försäkringsalternativ för det angivna personnumret." />
                            </div>
                        )}
                    </div>
                </section>

                {!this.props.isWaitingForResponse && (
                    <section className="page-section">
                        <div className="repeat-m">
                            <button
                                data-ecom-button="full-width"
                                onClick={onShowInsuranceAlternatives}
                            >
                                Visa försäkringar
                            </button>
                        </div>
                        <div className="repeat-m">
                            <button
                                data-ecom-button="full-width light"
                                onClick={onSkipInsuranceAlternatives}
                            >
                                Hoppa över detta steg
                            </button>
                        </div>
                    </section>
                )}

                {this.props.isWaitingForResponse && (
                    <section className="page-section">
                        <div className="form-group">
                            <Spinner />
                        </div>
                    </section>
                )}
            </div>
        );
    }
}

export default InsuranceInformationDefinition;
