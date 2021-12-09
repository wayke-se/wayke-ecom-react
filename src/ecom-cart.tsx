import React from "react";

import { PaymentType } from "@wayke-se/ecom";
import {
    IVehicle,
    IEcomStore,
    IEcomExternalProps,
    IEcomContext,
} from "./types";

import { formatPrice } from "./utils/helpers";
import {
    getPaymentMethodTitle,
    getLoanDetails,
    getLoanInformation,
} from "./utils/payment";
import { getVehicleFullTitle } from "./utils/trade-in-car";
import { getRetailerInformation } from "./utils/retailer";

import CartItem from "./ecom-cart-item";

export interface IEcomCartProps
    extends IEcomExternalProps,
        IEcomContext,
        IEcomStore {
    vehicle: IVehicle;
}

export default (props: IEcomCartProps) => {
    const [isExtended, setIsExtended] = React.useState(false);

    let displayRetailerName = true;
    if (
        !!props.orderOptions &&
        props.orderOptions.requiresDealerSelection() &&
        !props.dealer
    )
        displayRetailerName = false;

    const cartContent = [];

    const hasLoan =
        props.data.payment.paymentType &&
        props.data.payment.paymentType === PaymentType.Loan &&
        props.data.payment.hasAcceptedLoanDetails;
    const hasInsurance =
        props.data.insurance.wantsToSeeInsuranceOptions &&
        props.data.insurance.hasAddedInsurance &&
        props.data.insurance.personalNumber &&
        props.data.insurance.expectedDrivingDistance &&
        props.insuranceOptions !== null;
    const hasTradeIn =
        props.data.tradeInCar.wantsToDefineTradeIn &&
        props.data.tradeInCar.hasProvidedTradeInInfo &&
        props.data.tradeInCar.hasTradeInCar &&
        props.data.tradeInCar.registrationNumber &&
        props.vehicleLookup !== null;
    const hasAccessories = props.data.chosenAccessories.ids.length > 0;

    if (hasLoan) {
        const loanDetails = getLoanDetails(
            props.orderOptions,
            props.paymentLookup
        );
        const loanInformation = getLoanInformation(props.orderOptions);
        const loanPrice = loanDetails ? loanDetails.getCosts().monthlyCost : "";

        cartContent.push({
            title: getPaymentMethodTitle(PaymentType.Loan),
            description: loanInformation.name,
            price: loanPrice,
            unit: loanInformation.unit,
            addons: [],
        });
    }

    if (hasInsurance) {
        const insuranceOption = props.insuranceOptions.getInsuranceOption();
        const addons = insuranceOption.addons
            .filter((a) => props.data.insurance.addons.includes(a.name))
            .map((a) => ({
                title: a.title,
                price: a.monthlyPrice,
                unit: "kr/mån",
            }));

        cartContent.push({
            addons,
            title: "Försäkring",
            description: `${insuranceOption.brand.name} - ${insuranceOption.name}`,
            price: insuranceOption.price,
            unit: insuranceOption.unit,
        });
    }

    if (hasTradeIn) {
        const vehicleInformation = props.vehicleLookup.getVehicle();

        cartContent.push({
            title: "Inbytesbil",
            description: getVehicleFullTitle(
                props.data.tradeInCar.registrationNumber,
                vehicleInformation
            ),
            price: null,
            valuation: Math.round(vehicleInformation.valuation / 100) * 100,
            unit: "kr",
            addons: [],
        });
    }

    if (hasAccessories) {
        const accessories = props.orderOptions.getAccessories();
        const chosenAccessories = accessories.filter((a) =>
            props.data.chosenAccessories.ids.includes(a.id)
        );
        const addons = chosenAccessories.map((a) => {
            let totalPrice = a.price;
            if (a.salePrice !== undefined) totalPrice = a.salePrice;
            if (a.assemblyPrice !== undefined) totalPrice += a.assemblyPrice;
            

            return {
                title: a.name,
                price: totalPrice,
                unit: "kr",
            };
        });

        let accessoriesSumPrice = 0;
        chosenAccessories.map((a) => {
            accessoriesSumPrice += a.price;
            if (a.assemblyPrice) {
                accessoriesSumPrice += a.assemblyPrice;
            }
        });

        cartContent.push({
            addons,
            title: "Tillbehör",
            price: accessoriesSumPrice,
            unit: "kr",
        });
    }

    const items = cartContent.map((c, index) => (
        <CartItem key={index} {...c} />
    ));
    const hasContent = items.length > 0;

    const handleCartClick = () => {
        if (!hasContent) {
            return;
        }

        setIsExtended(!isExtended);
    };

    const retailerInformation = getRetailerInformation(props.orderOptions);

    return (
        <div data-ecom-footer="">
            <div
                data-ecom-cart=""
                className={isExtended && hasContent ? "is-extended" : ""}
            >
                <button
                    className={`cart-header ${
                        hasContent ? "" : "cursor-default"
                    }`}
                    onClick={handleCartClick}
                >
                    <div className="cart-header-img-section">
                        <div
                            className="cart-header-img"
                            style={{
                                backgroundImage: `url(${props.vehicle.imageUrl})`,
                            }}
                        />
                    </div>
                    <div className="cart-header-content-section">
                        <div className="cart-header-content-info">
                            {displayRetailerName && (
                                <div className="cart-seller">
                                    {retailerInformation.name}
                                </div>
                            )}
                            <div className="cart-header-title">
                                <span className="font-medium">
                                    {props.vehicle.title}
                                </span>{" "}
                                {props.vehicle.shortDescription}
                            </div>
                            <div className="cart-header-price">
                                {formatPrice(props.vehicle.price)} kr
                            </div>
                        </div>

                        {hasContent && (
                            <div className="cart-header-content-icon-container">
                                <div className="cart-header-content-icon" />
                            </div>
                        )}
                    </div>
                </button>

                {hasContent && <div className="cart-body">{items}</div>}
            </div>
        </div>
    );
};
