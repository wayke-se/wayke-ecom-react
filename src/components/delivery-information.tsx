import React from "react";

import { IEcomContext, IEcomExternalProps, IEcomStore } from "../types";
import {
    getDeliveryMethodTitle,
    getDeliveryDistance,
    getTotalDeliveryCost,
} from "../utils/delivery";
import { formatPrice } from "../utils/helpers";
import { DeliveryType } from "@wayke-se/ecom";

interface IDeliveryInfoType
    extends IEcomExternalProps,
        IEcomContext,
        IEcomStore {}

export default (props: IDeliveryInfoType) => {
    if (
        !props.data.interact.delivery.type ||
        props.data.delivery.type === DeliveryType.None
    )
        return null;

    const deliveryOptions = props.orderOptions.getDeliveryOptions() || [];
    const deliveryOption = deliveryOptions.find(
        option => option.type === props.data.delivery.type
    );

    if (!deliveryOption) return null;

    const address = props.bankIdCollect.isCompleted()
        ? props.bankIdCollect.getAddress()
        : null;

    const addressDistance = address !== null ? address.distance : undefined;
    const distance = getDeliveryDistance(addressDistance, deliveryOption);
    const totalDeliveryCost = getTotalDeliveryCost(
        addressDistance,
        deliveryOption
    );

    const hasUnitPrice =
        typeof deliveryOption.unitPrice === "number" &&
        deliveryOption.unitPrice > 0;

    return (
        <div className="repeat-m">
            <div data-ecom-productcard="">
                <div className="product-card-content-section">
                    <div className="product-card-content">
                        <div className="product-card-title">
                            <div className="product-card-heading">Leverans</div>
                        </div>
                        <div className="m-t-mini">
                            {getDeliveryMethodTitle(deliveryOption.type)}
                        </div>
                        <div className="m-t-mini text-dark-lighten">
                            {totalDeliveryCost && (
                                <>
                                    {formatPrice(totalDeliveryCost)} kr
                                    <span className="m-l-mini">
                                        (Beräknat på {distance}{" "}
                                        {deliveryOption.unit} á{" "}
                                        {formatPrice(deliveryOption.unitPrice)}{" "}
                                        kr/
                                        {deliveryOption.unit} och en
                                        startkostnad på{" "}
                                        {formatPrice(
                                            deliveryOption.startupCost
                                        )}{" "}
                                        kr)
                                    </span>
                                </>
                            )}
                            {!totalDeliveryCost && hasUnitPrice && (
                                <>
                                    Startkostnad:{" "}
                                    {formatPrice(deliveryOption.startupCost)} kr
                                    +{formatPrice(deliveryOption.unitPrice)} kr/
                                    {deliveryOption.unit}
                                </>
                            )}
                            {!hasUnitPrice &&
                                deliveryOption.startupCost > 0 && (
                                    <>
                                        {formatPrice(
                                            deliveryOption.startupCost
                                        )}{" "}
                                        kr
                                    </>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
