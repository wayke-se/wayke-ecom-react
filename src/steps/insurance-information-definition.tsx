import React from 'react';

import { validateSSN } from '../utils/validation';
import { IEcomLifecycle, IExpectedDrivingDistance, IEcomStore } from '../types';
import StoreAction from '../enums/store-action';

export interface IInsuranceInformationDefinitionProps extends IEcomStore, IEcomLifecycle {
};

interface IState {
    expectedDrivingDistance: number;
};

const options = [
    {
        min: 0,
        max: 1000
    },
    {
        min: 1000,
        max: 1500
    },
    {
        min: 1500,
        max: 2000
    },
    {
        min: 2000,
        max: 2500
    },
    {
        min: 2500
    }
];

const getIndexFromOption = (option: IExpectedDrivingDistance): number => {
    return options.indexOf(option);
};

class InsuranceInformationDefinition extends React.Component<IInsuranceInformationDefinitionProps, IState> {
    constructor(props: IInsuranceInformationDefinitionProps) {
        super(props);

        this.handleExpectedDrivingDistanceChange = this.handleExpectedDrivingDistanceChange.bind(this);
        this.handleProceedClick = this.handleProceedClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);

        this.state = {
            expectedDrivingDistance: this.props.data.insurance.expectedDrivingDistance ? getIndexFromOption(this.props.data.insurance.expectedDrivingDistance) : 0
        };
    }

    handleExpectedDrivingDistanceChange(e: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({
            expectedDrivingDistance: e.target.selectedIndex
        }, () => {
            this.props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
                type: 'insurance',
                name: 'expectedDrivingDistance',
                value: options[this.state.expectedDrivingDistance]
            });
        });
    }

    handleProceedClick() {
        this.props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'insurance',
            name: 'expectedDrivingDistance',
            value: options[this.state.expectedDrivingDistance]
        }, () => {
            this.props.onNextStepClick();
        });
    }

    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'insurance',
            name: e.target.name,
            value: e.target.value
        });
    }

    handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        this.props.dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, { type: 'insurance', name: e.target.name });
    }

    render() {
        const optionValues = options.map(o => o.min + (o.max ? '-' + o.max : '+') + ' mil');
        const optionItems = optionValues.map((v, index) => <option key={index}>{v}</option>);

        const selectedValue = optionValues[this.state.expectedDrivingDistance];

        const hasPersonalNumberError = this.props.data.interact.insurance.personalNumber && !validateSSN(this.props.data.insurance.personalNumber);

        return (
            <div className="page-main">
                <section className="page-section">
                    <h1 className="h6">Audi Försäkring</h1>
                    <div data-am-content="">
                        <p>Skriv in ditt personnummer och din uppskattade körsträcka för att se din försäkringskostna</p>
                    </div>
                </section>

                <section className="page-section">
                    <div data-am-form="">
                        <div className={`form-group ${hasPersonalNumberError ? ' has-error' : ''}`}>
                            <label data-am-inputlabel="" htmlFor="insurance-input-personalnr">Personnummer</label>

                            <div data-am-inputtext="">
                                <input type="text"
                                    id="insurance-input-personalnr"
                                    name="personalNumber"
                                    placeholder="ÅÅÅÅMMDD-XXXX"
                                    value={this.props.data.insurance.personalNumber}
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleBlur} />
                            </div>

                            <div className="alert">Fel format</div>
                        </div>

                        <div className="form-group">
                            <label data-am-inputlabel="" htmlFor="insurance-input-mileage">Uppskattad körsträcka per år</label>
                            <div data-am-select="">
                                <select className="select"
                                        value={selectedValue}
                                        onChange={this.handleExpectedDrivingDistanceChange}>
                                    {optionItems}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <div data-am-button="light full-width" onClick={this.handleProceedClick}>
                                Visa försäkringar
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
};

export default InsuranceInformationDefinition;