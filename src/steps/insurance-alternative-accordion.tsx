import React from "react";

import { IInsuranceItem } from "@wayke-se/ecom";

export default (props: IInsuranceItem) => {
    const [isExtended, setIsExtended] = React.useState(false);

    const handleMoreInformationClick = () => {
        setIsExtended(!isExtended);
    };

    return (
        <li className={`accordion-item ${isExtended ? "is-open" : ""}`}>
            <button
                className="accordion-header"
                onClick={handleMoreInformationClick}
            >
                <div className="accordion-header-label">{props.name}</div>
                <div className="accordion-header-icon">
                    <i
                        className={`no-margin ${
                            isExtended ? "icon-chevron-up" : "icon-chevron-down"
                        }`}
                    />
                </div>
            </button>

            <div className="accordion-body">{props.description}</div>
        </li>
    );
};
