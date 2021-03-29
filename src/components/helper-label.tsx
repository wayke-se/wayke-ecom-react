import React from "react";

interface IProps {
    label: string;
}

const HelperLabel = ({ label }: IProps) => {
    return (
        <div data-ecom-helper-box="" className="m-t-half m-b-half">
            <div className="helper-box-title">{label}</div>
        </div>
    );
};

export default HelperLabel;
