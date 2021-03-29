import React from "react";

import { IInfoItem, IValidatableInfoItem } from "./types";

interface ITextInputProps extends IValidatableInfoItem {
    errorText: string;
    placeholder: string;
    wide?: boolean;
}

export const TextInput = ({
    value,
    displayError,
    onChange,
    onFinish,
    errorText,
    placeholder,
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
    options: string[];
}

export const DropDownInput = ({
    value,
    options,
    onChange,
}: IDropDownInputProps) => (
    <div className="form-group">
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
