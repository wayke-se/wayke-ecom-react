import React from "react";

export interface AlertProps {
    message: string;
}

export default (props: AlertProps) => {
    return (
        <div data-ecom-alert="error">
            <div className="alert-icon-section">
                <div className="alert-icon">
                    <i className="icon-exclamation no-margin" />
                </div>
            </div>
            <div className="alert-content">{props.message}</div>
        </div>
    );
};
