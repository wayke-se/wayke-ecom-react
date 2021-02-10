import React from "react";

import { IInfoItem, IValidatableInfoItem } from "./types";

interface ITextInputProps extends IValidatableInfoItem {
    errorText: string;
    placeholder: string;
    label: string;
    wide?: boolean;
}

export const TextInput = ({
    value,
    displayError,
    onChange,
    onFinish,
    errorText,
    placeholder,
    label,
    wide,
}: ITextInputProps) => {
    let className = "form-group";
    if (!wide) {
        className += " is-half";
    }
    if (displayError) {
        className += " has-error";
    }

    return (
        <div className={className}>
            <label data-ecom-inputlabel htmlFor="finance-input-phone">
                {label}
            </label>
            <div data-ecom-inputtext>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onFinish}
                />
            </div>
            <div className="form-alert">{errorText}</div>
        </div>
    );
};

interface IDropDownInputProps extends IInfoItem {
    label: string;
    options: string[];
}

export const DropDownInput = ({
    value,
    label,
    options,
    onChange,
}: IDropDownInputProps) => (
    <div className="form-group">
        <label data-ecom-inputlabel>{label}</label>
        <div data-ecom-select>
            <select
                className="select"
                onChange={(e) => onChange(e.target.value)}
                value={value}
            >
                {options.map((option, index) => (
                    <option key={`${index}-${option}`}>{option}</option>
                ))}
            </select>
        </div>
    </div>
);
