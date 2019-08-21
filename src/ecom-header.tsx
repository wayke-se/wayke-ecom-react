import React from 'react';

const EcomHeader = (props) => {
    return (
        <header data-am-header="">
            <div className="container">
                <div className="header">
                    { props.canPressBackButton &&
                        <div className="header-action">
                            <button data-am-link="" title="Tillbaka" onClick={props.onPreviousStepClick}>
                                <i className="icon-chevron-left m-r-half"></i>Tillbaka
                            </button>
                        </div>
                    }

                    <div className="header-action">
                        <a href="#" title="Till Wayke.se" data-am-link="">Till Wayke.se</a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default EcomHeader;