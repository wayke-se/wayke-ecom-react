import React from 'react';
import { IEcomExternalProps } from './types';
import UserEvent from './constants/user-event';

export interface IEcomHeaderProps extends IEcomExternalProps {
    canPressBackButton: boolean;
    onPreviousStepClick: () => void;
    onIncompleteUserEvent: (userEvent: UserEvent) => void;
};

const EcomHeader = (props: IEcomHeaderProps) => {
    const handleExitClick = () => {
        props.onIncompleteUserEvent(UserEvent.ORDER_CANCELLED);
        props.onExit();
    };

    const handleBackClick = () => {
        props.onIncompleteUserEvent(UserEvent.BACK_BUTTON_CLICKED);
        props.onPreviousStepClick();
    };

    return (
        <header data-ecom-header="">
            <div className="header">
                <div className="header-action">
                  { props.canPressBackButton &&
                      <button data-ecom-link="" title="Tillbaka" onClick={handleBackClick}>
                          <i className="icon-chevron-left m-r-half"></i>Tillbaka
                      </button>
                  }
                </div>
                <div className="header-action">
                    <button className="header-action-btn" title="Stäng" onClick={handleExitClick}>
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
