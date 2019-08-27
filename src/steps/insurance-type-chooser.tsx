import React from 'react';

import InsuranceOption from '../enums/insurance-option';
import StoreAction from '../enums/store-action';

import { IEcomContext, IEcomLifecycle, IEcomStore } from '../types';

import { addSizeQuery } from '../utils/image';

export interface IInsuranceTypeChooserProps extends IEcomContext, IEcomStore, IEcomLifecycle {
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

    const insuranceOption = props.options.getInsuranceOption();
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
                            <button className="option-list-action" onClick={() => handleInsuranceOptionClick(InsuranceOption.AUDI_INSURANCE)}>
                                <div data-ecom-columnrow="">
                                    <div className="column">
                                        <div className="option-list-action-title">{insuranceOption.title}</div>
                                        { insuranceOption.description && <div className="option-list-action-subtitle">{insuranceOption.description}</div> }
                                    </div>

                                    { scaledImage &&
                                        <div className="column valign-top minimal">
                                            <img src={scaledImage} alt="Audi logotype" className="l-block" />
                                        </div>
                                    }
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