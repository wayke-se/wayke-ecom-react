import React from "react";
import { IDeliveryOption, IAddress } from "@wayke-se/ecom";

import {
    IEcomContext,
    IEcomLifecycle,
    IEcomStore,
    IEcomExternalProps,
} from "../types";
import {
    getDeliveryMethodTitle,
    getDeliveryDistance,
    getTotalDeliveryCost,
    isAvailable,
} from "../utils/delivery";
import { formatPrice } from "../utils/helpers";
import CustomerInformationInputType from "../constants/customer-information-input-type";

interface IDeliveryMethodItemProps
    extends IEcomExternalProps,
        IEcomContext,
        IEcomStore,
        IEcomLifecycle {
    address: IAddress | null;
    deliveryOption: IDeliveryOption;
    onDeliveryOptionClick: (IDeliveryOption) => void;
}

export default ({
    data,
    deliveryOption,
    address,
    onDeliveryOptionClick,
}: IDeliveryMethodItemProps) => {
    const isAutomaticAddress =
        data.customer.inputType === CustomerInformationInputType.AUTOMATIC;

    if (!isAvailable(deliveryOption, address, isAutomaticAddress)) {
        return (
            <li className="option-list-item">
                <button className="option-list-action" disabled={true}>
                    <div data-ecom-columnrow="">
                        <div className="column">
                            <div className="option-list-action-title">
                                {getDeliveryMethodTitle(deliveryOption.type)}
                                <i className="icon-arrow-right m-l-half" />
                            </div>
                            <div className="option-list-action-meta">
                                Hemleverans ej möjlig
                            </div>
                        </div>
                    </div>
                </button>
            </li>
        );
    }

    const addressDistance = address !== null ? address.distance : undefined;
    const distance = getDeliveryDistance(addressDistance, deliveryOption);
    const totalDeliveryCost = getTotalDeliveryCost(
        addressDistance,
        deliveryOption
    );

    return (
        <li className="option-list-item">
            <button
                className="option-list-action"
                onClick={() => onDeliveryOptionClick(deliveryOption)}
            >
                <div data-ecom-columnrow="">
                    <div className="column">
                        <div className="option-list-action-title">
                            {getDeliveryMethodTitle(deliveryOption.type)}
                            <i className="icon-arrow-right m-l-half" />
                        </div>
                        <div className="option-list-action-meta">
                            {totalDeliveryCost && (
                                <>
                                    {formatPrice(totalDeliveryCost)} kr
                                    <span className="m-l-mini">
                                        (Beräknat på {distance}{" "}
                                        {deliveryOption.unit} á{" "}
                                        {formatPrice(deliveryOption.unitPrice)}{" "}
                                        kr/{deliveryOption.unit} och en
                                        startkostnad på{" "}
                                        {formatPrice(
                                            deliveryOption.startupCost
                                        )}{" "}
                                        kr)
                                    </span>
                                </>
                            )}
                            {!totalDeliveryCost && deliveryOption.unitPrice && (
                                <>
                                    Startkostnad:{" "}
                                    {formatPrice(deliveryOption.startupCost)} kr{" "}
                                    +{formatPrice(deliveryOption.unitPrice)} kr/
                                    {deliveryOption.unit}
                                </>
                            )}
                            {!deliveryOption.unitPrice && (
                                <>
                                    {formatPrice(deliveryOption.startupCost)} kr
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </button>
        </li>
    );
};
