import React from "react";

import { IInsuranceAddon } from "@wayke-se/ecom";
import { IEcomStore } from "../types";

import StoreAction from "../constants/store-action";

interface IAddonItemProps extends IInsuranceAddon, IEcomStore {
    id: string;
    isDisabled: boolean;
}

export default (props: IAddonItemProps) => {
    const [isExtended, setIsExtended] = React.useState(false);

    const handleMoreInformationClick = () => {
        setIsExtended(!isExtended);
    };

    const updateAddons = (newAddons: string[]) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "insurance",
            name: "addons",
            value: newAddons,
        });
    };

    const handleCheckChange = e => {
        const addons = [...props.data.insurance.addons];

        const index = addons.indexOf(props.name);
        const hasElement = index >= 0;

        if (e.target.checked && !hasElement) {
            addons.push(props.name);
            updateAddons(addons);
        } else if (!e.target.checked && hasElement) {
            addons.splice(index, 1);
            updateAddons(addons);
        }
    };

    const isChecked = props.data.insurance.addons.includes(props.name);

    return (
        <div
            data-ecom-borderbox=""
            className={`repeat-m-half ${props.isDisabled ? "bg-accent" : ""}`}
        >
            <div data-ecom-columnrow="">
                <div className="column">
                    <div data-ecom-inputselection="checkbox center-input">
                        <input
                            type="checkbox"
                            id={props.id}
                            disabled={props.isDisabled}
                            checked={isChecked}
                            onChange={handleCheckChange}
                        />
                        <label htmlFor={props.id}>
                            <span className="text">
                                <span className="l-block">{props.title}</span>
                                <span className="l-block font-size-small m-t-mini">
                                    <button
                                        data-ecom-link="font-size-inherit"
                                        onClick={handleMoreInformationClick}
                                    >
                                        Visa {isExtended ? "mindre" : "mer"}
                                    </button>
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
                <div className="column font-medium">
                    {props.monthlyPrice} kr/mån
                </div>
            </div>

            {isExtended && (
                <div data-ecom-content="" className="m-t-half">
                    <p>{props.description}</p>
                </div>
            )}
        </div>
    );
};
