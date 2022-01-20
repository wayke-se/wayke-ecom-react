import React from "react";

import { formatPrice } from "./utils/helpers";

interface ICartItemAddon {
    title: string;
    price: number;
    unit: string;
}

interface ICartItemProps {
    title: string;
    description: string;
    price: number;
    valuation: number;
    unit: string;
    addons: ICartItemAddon[];
}

export default (props: ICartItemProps) => {
    const addonItems = props.addons.map((a, index) => (
        <div key={index}>
            {a.title} - {formatPrice(a.price)} {a.unit}
        </div>
    ));

    const hasAddons = addonItems.length > 0;
    const hasPrice = props.price !== null;
    const hasValuation = !hasPrice && !!props.valuation;

    return (
        <div className="cart-body-section">
            <div data-ecom-columnrow="">
                <div className="column">
                    <div className="font-medium">{props.title}</div>
                </div>
                {hasPrice && (
                    <div className="column">
                        {formatPrice(props.price)} {props.unit}
                    </div>
                )}
            </div>

            <div>{props.description}</div>

            {hasValuation && (
                <div className="text-dark-lighten">
                    Uppskattat värde:{" "}
                    {formatPrice(Math.round(props.valuation / 100) * 100)}{" "}
                    {props.unit}
                </div>
            )}

            {hasAddons && <div className="m-t-mini">{addonItems}</div>}
        </div>
    );
};
