import React from 'react';

import { IEcomLifecycle, IEcomStore, IEcomContext } from '../types';
import Alert from '../components/alert';

export interface ITradeInConfirmCarProps extends IEcomContext, IEcomStore, IEcomLifecycle {
};

class TradeInConfirmCar extends React.Component<ITradeInConfirmCarProps> {
    constructor(props: ITradeInConfirmCarProps) {
        super(props);
    }

    componentDidMount() {
        this.props.onFetchVehicleInformation();
    }

    render() {
        if (this.props.vehicleLookupError) {
            return <Alert message={`Din sökning på registreringsnummer ${this.props.data.tradeInCar.registrationNumber} gav tyvärr ingen träff. Prova på nytt med ett annat registreringsnummer.`} />
        }

        if (!this.props.vehicleLookup) {
            return <div></div>;
        }

        const vehicle = this.props.vehicleLookup.getVehicle();

        console.log(vehicle);

        return (
            <div className="page-main">
                <section className="page-section">
                    <h1 className="h6">Inbytesbil</h1>
                    <div data-ecom-content="">
                        <p>Är detta din inbytesbil?</p>
                    </div>
                </section>

                <section className="page-section">
                    <div data-ecom-box="">
                        <div data-ecom-label="">{this.props.data.tradeInCar.registrationNumber}</div>
                        <div className="m-t-half">
                            <span className="font-medium">Peugot 308 Sportswagon</span> 1.6 BlueHDI FAP Manual, 120hp, 2015 6-speed
                        </div>
                    </div>
                </section>

                <section className="page-section page-section-bottom">
                    <div data-ecom-buttonnav="">
                        <div className="button-nav-item" onClick={this.props.onShowTradeInCarDefinition}>
                            <div data-ecom-button="light full-width">
                                Ändra regnr
                            </div>
                        </div>
                        <div className="button-nav-item" onClick={this.props.onNextStepClick}>
                            <div data-ecom-button="full-width">
                                Ja
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
};

export default TradeInConfirmCar;