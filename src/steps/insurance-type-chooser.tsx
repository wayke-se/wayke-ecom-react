import React from 'react';

import { IEcomContext, IEcomLifecycle, IEcomStore } from '../types';

import StoreAction from '../constants/store-action';
import { addSizeQuery } from '../utils/image';

export interface IInsuranceTypeChooserProps extends IEcomContext, IEcomStore, IEcomLifecycle {
};

const InsuranceTypeChooser = (props: IInsuranceTypeChooserProps) => {
    const handleInsuranceOptionClick = (wantsToSeeInsuranceOptions: boolean) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'insurance',
            name: 'wantsToSeeInsuranceOptions',
            value: wantsToSeeInsuranceOptions
        }, () => {
            props.onProceedToNextStep();
        });
    };

    const insuranceOption = props.orderOptions.getInsuranceOption();
    const scaledImage = addSizeQuery(insuranceOption.logo, 100, 60);

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Försäkring</h1>
                <div data-ecom-content="">
                    <p>Vill du teckna försäkring på din nya bil?</p>
                </div>
            </section>

            <section className="page-section">
                <div data-ecom-optionlist="">
                    <ul className="option-list">
                        <li className="option-list-item">
                            <button className="option-list-action" onClick={() => handleInsuranceOptionClick(true)}>
                                <div data-ecom-columnrow="">
                                    <div className="column">
                                        <div className="option-list-action-title">{insuranceOption.title}<i className="icon-arrow-right m-l-half"></i></div>
                                    </div>

                                    { scaledImage &&
                                        <div className="column minimal">
                                            <img src={scaledImage} alt="Logotype" className="l-block" />
                                        </div>
                                    }
                                </div>
                            </button>
                        </li>
                    </ul>
                </div>
            </section>

            <section className="page-section text-center" onClick={() => handleInsuranceOptionClick(false)}>
                <button data-ecom-link="action"><i className="icon-skip m-r-half"></i>Hoppa över detta steg</button>
            </section>
        </div>
    );
};

export default InsuranceTypeChooser;