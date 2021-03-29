import React from "react";

interface IProps {
    label: string;
    title?: string;
    sections?: string[];
}

const HelperBox = ({ label, title, sections }: IProps) => {
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
                    {!!sections.length && (
                        <div data-ecom-content="" className="font-size-small">
                            {sections.map((section, index) => (
                                <p key={`helper-${label}-${index}`}>
                                    {section}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HelperBox;
