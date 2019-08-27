import React from 'react';

import InsuranceOption from '../enums/insurance-option';
import { IEcomLifecycle, IEcomStore } from '../types';
import StoreAction from '../enums/store-action';

export interface IInsuranceTypeChooserProps extends IEcomStore, IEcomLifecycle {
};

const InsuranceTypeChooser = (props: IInsuranceTypeChooserProps) => {
    const handleInsuranceOptionClick = (insuranceOption: InsuranceOption) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'insurance',
            name: 'insuranceOption',
            value: insuranceOption
        }, () => {
            props.onNextStepClick();
        });
    };

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
                            <button className="option-list-action" onClick={() => handleInsuranceOptionClick(InsuranceOption.AUDI_INSURANCE)}>
                                <div data-ecom-columnrow="">
                                    <div className="column">
                                        <div className="option-list-action-title">Audi Försäkring</div>
                                        <div className="option-list-action-subtitle">Audi financial services</div>
                                    </div>
                                    <div className="column valign-top minimal">
                                        <img src="images/audi-logo.png" alt="Audi logotype" className="l-block" />
                                    </div>
                                </div>
                            </button>
                        </li>
                        <li className="option-list-item">
                            <button className="option-list-action" onClick={() => handleInsuranceOptionClick(null)}>
                                <div className="option-list-action-title">Hoppa över detta steg</div>
                                <div className="option-list-action-meta">Jag har egen försäkring</div>
                            </button>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default InsuranceTypeChooser;