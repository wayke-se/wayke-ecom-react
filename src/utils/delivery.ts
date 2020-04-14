import {
    DeliveryType,
    IDeliveryOption,
    IDistance,
    IAddress,
} from "@wayke-se/ecom";

export const PickupDeliveryTitle = "Hämtas hos återförsäljare";
export const HomeDeliveryTitle = "Hemleverans";

export const isAvailable = (
    deliveryOption: IDeliveryOption,
    address: IAddress,
    isAutomaticAddress: boolean
) => {
    if (deliveryOption.type === DeliveryType.Delivery && !isAutomaticAddress)
        return false;

    if (deliveryOption.type === DeliveryType.Delivery && address !== null) {
        if (!address.distance || !deliveryOption.maxQuantity) return true;

        const distance = getDeliveryDistance(address.distance, deliveryOption);
        return distance <= deliveryOption.maxQuantity;
    }

    return true;
};

export const getDeliveryMethodTitle = (type: DeliveryType) => {
    switch (type) {
        case DeliveryType.Pickup:
            return PickupDeliveryTitle;
        case DeliveryType.Delivery:
            return HomeDeliveryTitle;
        default:
            return "";
    }
};

export const getDeliveryDistance = (
    distance: IDistance | null,
    deliveryOption: IDeliveryOption
) => {
    if (!distance) return undefined;

    if (distance.unit === "m" && deliveryOption.unit === "km")
        return Math.round(distance.value / 1000);

    if (distance.unit === "km" && deliveryOption.unit === "m")
        return distance.value * 1000;

    return distance.value;
};

export const getTotalDeliveryCost = (
    distance: IDistance | null,
    deliveryOption: IDeliveryOption
) => {
    const deliveryDistance = getDeliveryDistance(distance, deliveryOption);
    if (!deliveryDistance) return undefined;

    if (!deliveryOption.unitPrice) return undefined;

    return (
        deliveryOption.startupCost + deliveryOption.unitPrice * deliveryDistance
    );
};
