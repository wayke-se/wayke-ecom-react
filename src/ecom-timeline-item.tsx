import React from "react";

interface IItemProps {
    label: string;
    isActive: boolean;
    isInbetweenStepActive: boolean;
}

export default (props: IItemProps) => (
    <li
        className={`timeline-item ${props.isActive ? "is-active" : ""} ${
            props.isInbetweenStepActive ? "is-stepped" : ""
        }`}
    >
        <div className="timeline-indicator" />
        <div className="timeline-label">{props.label}</div>
    </li>
);
