import React from "react";

interface IProps {
    hasError: boolean;
}

export default ({ hasError }: IProps) =>
    !hasError ? (
        <div className="repeat-m-half">
            <div data-ecom-spinner="center third-party">
                <div className="spinner"></div>
            </div>
        </div>
    ) : null;
