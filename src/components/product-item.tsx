import React from "react";

import { IEcomStore } from "../types";

import { formatPrice } from "../utils/helpers";

interface IProductItemAddon {
    title: string;
    price: number;
    unit: string;
}

interface IProductItemProps extends IEcomStore {
    title: string;
    description: string;
    price: number;
    unit: string;
    addons: IProductItemAddon[];
}

export default (props: IProductItemProps) => {
    const addonItems = props.addons.map((a, index) => (
        <div key={index}>
            {a.title} - {a.price}
            {a.unit}
        </div>
    ));

    const hasAddons = addonItems.length > 0;
    const hasPrice = props.price !== null;

    return (
        <div className="product-card-content">
            <div data-ecom-columnrow="">
                <div className="column">
                    <div className="font-medium">{props.title}</div>
                </div>

                {hasPrice && (
                    <div className="column">
                        {formatPrice(props.price)}
                        {props.unit}
                    </div>
                )}
            </div>

            <div className="font-size-small">{props.description}</div>

            {hasAddons && (
                <div className="font-size-small m-t-mini">{addonItems}</div>
            )}
        </div>
    );
};
