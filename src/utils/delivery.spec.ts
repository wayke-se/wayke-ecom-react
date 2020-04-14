const fixtures = require("../../test/fixtures");

import { DeliveryType } from "@wayke-se/ecom";

import {
    PickupDeliveryTitle,
    HomeDeliveryTitle,
    getDeliveryMethodTitle,
    getDeliveryDistance,
    getTotalDeliveryCost,
} from "./delivery";

describe("getDeliveryMethodTitle()", () => {
    it("returns correct title for Pickup type", () => {
        const type = DeliveryType.Pickup;
        const title = getDeliveryMethodTitle(type);

        expect(title).toEqual(PickupDeliveryTitle);
    });
    it("returns correct title for Delivery type", () => {
        const type = DeliveryType.Delivery;
        const title = getDeliveryMethodTitle(type);

        expect(title).toEqual(HomeDeliveryTitle);
    });
});

describe("getDeliveryDistance()", () => {
    it("returns undefined for missing address distance", () => {
        const deliveryOption = fixtures.create("IDeliveryOption");
        const actual = getDeliveryDistance(undefined, deliveryOption);

        expect(actual).toBeUndefined();
    });
    it("returns distance for matching units", () => {
        const distance = fixtures.create("IDistance");
        const deliveryOption = fixtures.create("IDeliveryOption", {
            unit: distance.unit,
        });
        const actual = getDeliveryDistance(distance, deliveryOption);

        expect(actual).toBe(distance.value);
    });
    it("converts meters to kilometers", () => {
        const m = 4000;
        const distance = fixtures.create("IDistance", {
            value: m,
            unit: "m",
        });
        const deliveryOption = fixtures.create("IDeliveryOption", {
            unit: "km",
        });
        const actual = getDeliveryDistance(distance, deliveryOption);
        const expected = Math.round(m / 1000);

        expect(actual).toBe(expected);
    });
    it("converts kilometers to meters", () => {
        const km = 4;
        const distance = fixtures.create("IDistance", {
            value: km,
            unit: "km",
        });
        const deliveryOption = fixtures.create("IDeliveryOption", {
            unit: "m",
        });
        const actual = getDeliveryDistance(distance, deliveryOption);
        const expected = km * 1000;

        expect(actual).toBe(expected);
    });
});

describe("getTotalDeliveryCost()", () => {
    it("returns undefined for missing address distance", () => {
        const deliveryOption = fixtures.create("IDeliveryOption");
        const actual = getTotalDeliveryCost(undefined, deliveryOption);

        expect(actual).toBeUndefined();
    });
    it("returns undefined for missing delivery option unit price", () => {
        const distance = fixtures.create("IDistance");
        const deliveryOption = fixtures.create("IDeliveryOption", {
            unitPrice: undefined,
            unit: distance.unit,
        });
        const actual = getTotalDeliveryCost(distance, deliveryOption);

        expect(actual).toBeUndefined();
    });
    it("returns startup cost + (unit price * distance)", () => {
        const km = 4;
        const unitPrice = 10;
        const startupCost = 250;

        const distance = fixtures.create("IDistance", {
            value: km,
            unit: "km",
        });
        const deliveryOption = fixtures.create("IDeliveryOption", {
            startupCost: startupCost,
            unitPrice: 10,
            unit: "km",
        });
        const actual = getTotalDeliveryCost(distance, deliveryOption);
        const expected = startupCost + unitPrice * km;

        expect(actual).toBe(expected);
    });
});
