import React from "react";

interface IProps {
    label: string;
    forId?: string;
}

const HelperLabel = ({ label, forId }: IProps) => {
    return (
        <div data-ecom-helper-box="" className="m-t-half m-b-half">
            <label data-ecom-inputlabel="no-margin" htmlFor={forId}>
                {label}
            </label>
        </div>
    );
};

export default HelperLabel;
