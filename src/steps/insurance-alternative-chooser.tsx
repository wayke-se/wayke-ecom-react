import React from 'react';
import { IInsuranceData, IEcomLifecycle } from '../types';

export interface IInsuranceAlternativeChooserProps extends IEcomLifecycle {
};

const InsuranceAlternativeChooser = (props: IInsuranceAlternativeChooserProps) => {
    const insuranceAlternatives = [
        {
            id: 'ia1',
            price: '125kr/mån'
        },
        {
            id: 'ia2',
            price: '525kr/mån'
        },
        {
            id: 'ia3',
            price: '253kr/mån'
        },
    ];

    const insuranceAlternativeItems = insuranceAlternatives.map((i, index) => (
        <div className="repeat-m-half" key={index}>
            <div data-am-box="light">
                <h2 className="h6">{i.price}</h2>

                <div data-am-content="">
                    <p>Helförsäkring med finansiering via Audi financial services</p>
                </div>

                <div className="box-footer">
                    <div data-am-columnrow="">
                        <div className="column font-size-small">
                            <button data-am-link="action font-size-inherit" className="l-block">Mer information<i className="icon-chevron-down m-l-mini"></i></button>
                        </div>

                        <div className="column">
                            <div data-am-button="small" onClick={() => props.onInsuranceAlternativeChange(i.id)}>
                                Välj
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ));

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Audi Försäkring</h1>
                <div data-am-content="">
                    <p>Skriv in ditt personnummer och din uppskattade körsträcka för att se din försäkringskostna</p>
                </div>
            </section>

            <section className="page-section">
                <div data-am-columnrow="" className="font-size-small m-b-half">
                    <div className="column">
                        <div className="font-medium">Uppgifter</div>
                    </div>

                    <div className="column">
                        <button data-am-link="font-inerit" onClick={props.onShowInsuranceInformationDefinition}>Ändra</button>
                    </div>
                </div>

                <div className="l-inline-block m-r">
                    <i className="icon-profile m-r-half"></i>{props.insurance.personalNumber}
                </div>

                <div className="l-inline-block">
                    <i className="icon-mileage m-r-half"></i>{props.insurance.expectedDrivingDistance.min}-{props.insurance.expectedDrivingDistance.max} mil
                </div>
            </section>

            <section className="page-section page-section-accent">
                {insuranceAlternativeItems}
            </section>
        </div>
    );
};

export default InsuranceAlternativeChooser;