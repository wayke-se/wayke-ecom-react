import React from 'react';
import { IEcomExternalProps } from './types';

export interface IEcomHeaderProps extends IEcomExternalProps {
    canPressBackButton: boolean;
    onPreviousStepClick: () => void;
};

const EcomHeader = (props: IEcomHeaderProps) => {
    return (
        <header data-ecom-header="">
            <div className="header">
                <div className="header-action">
                  { props.canPressBackButton &&
                      <button data-ecom-link="" title="Tillbaka" onClick={props.onPreviousStepClick}>
                          <i className="icon-chevron-left m-r-half"></i>Tillbaka
                      </button>
                  }
                </div>
                <div className="header-action">
                    <button className="header-action-btn" title="Stäng" onClick={props.onExit}>
                        <i className="icon-close no-margin"></i>
                    </button>
                </div>
                <div className="header-logo-container">
                    <img src={props.serviceLogotypeUrl} alt="Logotype" className="header-logo" />
                </div>
            </div>
        </header>
    );
};

export default EcomHeader;
