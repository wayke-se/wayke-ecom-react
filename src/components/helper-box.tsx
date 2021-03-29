import React from "react";

interface IProps {
    label: string;
    title?: string;
    children?: React.ReactNode;
}

const HelperBox = ({ label, title, children }: IProps) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const iconClass = isExpanded
        ? "icon-helper-close no-margin"
        : "icon-helper-open no-margin";

    return (
        <div data-ecom-helper-box="" className="m-t-half m-b-half">
            <button
                title={label}
                className="helper-box-header"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="helper-box-title">{label}</div>
                <div className="helper-box-label">
                    <i className={iconClass} />
                </div>
            </button>
            {isExpanded && (
                <div className="content">
                    {!!title && (
                        <div className="font-medium m-b-half">{title}</div>
                    )}
                    <div data-ecom-content="" className="font-size-small">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HelperBox;
