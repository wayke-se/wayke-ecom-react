import React from 'react';

import InsuranceOption from '../enums/insurance-option';

export interface IInsuranceTypeChooserProps {
};

const InsuranceTypeChooser = (props: IInsuranceTypeChooserProps) => {
    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Försäkring</h1>
                <div data-am-content="">
                    <p>Vill du teckna försäkring på din nya bil?</p>
                </div>
            </section>

            <section className="page-section">
                <div data-am-optionlist="">
                    <ul className="option-list">
                        <li className="option-list-item">
                            <button className="option-list-action" onClick={() => props.onInsuranceOptionChange(InsuranceOption.AUDI_INSURANCE)}>
                                <div data-am-columnrow="">
                                    <div className="column">
                                        <div className="option-list-action-title">Audi Försäkring</div>
                                        <div className="option-list-action-subtitle">Audi financial services</div>
                                    </div>
                                    <div className="column valign-top minimal">
                                        <img src="/assets/toolkit/images/audi-logo.png" alt="Audi logotype" className="l-block" />
                                    </div>
                                </div>
                            </button>
                        </li>
                        <li className="option-list-item">
                            <button className="option-list-action" onClick={() => props.onInsuranceOptionChange(null)}>
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