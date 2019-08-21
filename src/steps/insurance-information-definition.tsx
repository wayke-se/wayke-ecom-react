import React from 'react';

import { validateSSN } from '../utils/validation';
import { IEcomLifecycle, IInsuranceData, IInteractData, IExpectedDrivingDistance } from '../types';

export interface IInsuranceInformationDefinitionProps extends IEcomLifecycle {
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
        max: 2000
    },
    {
        min: 2000,
        max: 3000
    },
    {
        min: 3000,
        max: 4000
    },
    {
        min: 4000,
        max: 5000
    },
    {
        min: 5000,
        max: 6000
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

        this.state = {
            expectedDrivingDistance: this.props.insurance.expectedDrivingDistance ? getIndexFromOption(this.props.insurance.expectedDrivingDistance) : 0
        };
    }

    handleExpectedDrivingDistanceChange(e) {
        this.setState({
            expectedDrivingDistance: e.target.selectedIndex
        }, () => {
            this.props.onInsuranceExpectedDrivingDistanceChange(options[this.state.expectedDrivingDistance]);
        });
    }

    handleProceedClick() {
        this.props.onInsuranceExpectedDrivingDistanceChange(options[this.state.expectedDrivingDistance]);
        this.props.onNextStepClick();
    }

    render() {
        const optionValues = options.map(o => o.min + '-' + o.max + ' mil');
        const optionItems = optionValues.map((v, index) => <option key={index}>{v}</option>);

        const selectedValue = optionValues[this.state.expectedDrivingDistance];

        const hasPersonalNumberError = this.props.interact.insurance.personalNumber && !validateSSN(this.props.insurance.personalNumber);

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
                                    name="insurancePersonalNumber"
                                    placeholder="ÅÅÅÅMMDD-XXXX"
                                    value={this.props.insurance.personalNumber}
                                    onChange={this.props.onInputChange}
                                    onBlur={this.props.onInputBlur} />
                            </div>

                            <div className="alert">Fel format</div>
                        </div>

                        <div className="form-group">
                            <label data-am-inputlabel="" htmlFor="insurance-input-mileage">Uppskattad körsträcka per år</label>
                            <div data-am-select="">
                                <select className="select"
                                        name="insuranceExpectedDrivingDistance"
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