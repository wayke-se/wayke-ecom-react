import React from 'react';
import { IEcomLifecycle, IEcomStore, IEcomContext } from '../types';
import StoreAction from '../enums/store-action';
import Alert from '../components/alert';

export interface IInsuranceAlternativeChooserProps extends IEcomContext, IEcomStore, IEcomLifecycle {
};

class InsuranceAlternativeChooser extends React.Component<IInsuranceAlternativeChooserProps> {
    constructor(props: IInsuranceAlternativeChooserProps) {
        super(props);

        this.handleHasAddedInsuranceClick = this.handleHasAddedInsuranceClick.bind(this);
    }

    componentDidMount() {
        this.props.onFetchInsuranceOptions();
    }

    handleHasAddedInsuranceClick(value: boolean) {
        this.props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'insurance',
            name: 'hasAddedInsurance',
            value
        }, () => {
            this.props.onNextStepClick();
        });
    }

    render() {
        if (this.props.insuranceOptionsError) {
            return <Alert message="Tyvärr kan vi inte visa försäkringar för det angivna personnumret." />;
        }

        if (!this.props.insuranceOptions) {
            return <div></div>;
        }

        const insuranceOption = this.props.insuranceOptions.getInsuranceOption();

        const min = this.props.data.insurance.expectedDrivingDistance.min;
        const max = this.props.data.insurance.expectedDrivingDistance.max;
        const drivingDistanceText = min + (max ? '-' + max : '+') + 'mil';

        return (
            <div className="page-main">
                <section className="page-section">
                    <h1 className="h6">Audi Försäkring</h1>
                    <div data-ecom-content="">
                        <p>Skriv in ditt personnummer och din uppskattade körsträcka för att se din försäkringskostna</p>
                    </div>
                </section>

                <section className="page-section">
                    <div data-ecom-columnrow="" className="font-size-small m-b-half">
                        <div className="column">
                            <div className="font-medium">Uppgifter</div>
                        </div>

                        <div className="column">
                            <button data-ecom-link="font-inerit" onClick={this.props.onShowInsuranceInformationDefinition}>Ändra</button>
                        </div>
                    </div>

                    <div className="l-inline-block m-r">
                        <i className="icon-profile m-r-half"></i>{this.props.data.insurance.personalNumber}
                    </div>

                    <div className="l-inline-block">
                        <i className="icon-mileage m-r-half"></i><span>{drivingDistanceText}</span>
                    </div>
                </section>

                <section className="page-section page-section-accent">
                    <div className="repeat-m-half">
                        <div data-ecom-box="light">
                            <h2 className="h6">{insuranceOption.price}{insuranceOption.unit}</h2>

                            <div data-ecom-content="">
                                <p>{insuranceOption.name}</p>
                            </div>

                            <div className="box-footer">
                                <div data-ecom-columnrow="">
                                    <div className="column font-size-small">
                                        <button data-ecom-link="action font-size-inherit" className="l-block">Mer information<i className="icon-chevron-down m-l-mini"></i></button>
                                    </div>

                                    <div className="column">
                                        <div data-ecom-button="small" onClick={() => this.handleHasAddedInsuranceClick(true)}>
                                            Välj
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="page-section page-section-bottom">
                    <div data-ecom-buttonnav="">
                        <div className="button-nav-item">
                            <div data-ecom-button="light full-width" onClick={() => this.handleHasAddedInsuranceClick(false)}>
                                Hoppa över detta steg
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default InsuranceAlternativeChooser;
