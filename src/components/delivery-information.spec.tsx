const fixtures = require("../../test/fixtures");

import React from "react";
import renderer from "react-test-renderer";

import DeliveryInformation from "./delivery-information";
import { DeliveryType } from "@wayke-se/ecom";

describe("Order Summary: Delivery Information", () => {
    it("doesn't render if no delivery type has been chosen", () => {
        const props = {
            ...fixtures.create("IEcomExternalProps"),
            data: fixtures.create("IEcomData", (d) => {
                d.interact = {
                    delivery: false,
                };
                return d;
            }),
        };

        const rendered = renderer.create(<DeliveryInformation {...props} />);
        const instance = rendered.root;

        expect(instance.children.length).toEqual(0);
    });
    it("doesn't render if chosen delivery type is DeliveryType.None", () => {
        const props = {
            ...fixtures.create("IEcomExternalProps"),
            data: fixtures.create("IEcomData", (d) => {
                d.delivery = {
                    type: DeliveryType.None,
                };
                d.interact = {
                    delivery: true,
                };
                return d;
            }),
        };

        const rendered = renderer.create(<DeliveryInformation {...props} />);
        const instance = rendered.root;

        expect(instance.children.length).toEqual(0);
    });
    it("doesn't render if no delivery options are available", () => {
        const props = {
            ...fixtures.create("IEcomExternalProps"),
            data: fixtures.create("IEcomData", (d) => {
                d.delivery = {
                    type: DeliveryType.Delivery,
                };
                d.interact = {
                    delivery: true,
                };
                d.orderOptions = {
                    getOrderOptions: () => [],
                };
                return d;
            }),
        };

        const rendered = renderer.create(<DeliveryInformation {...props} />);
        const instance = rendered.root;

        expect(instance.children.length).toEqual(0);
    });
    it("doesn't render if chosen delivery options is missing", () => {
        const props = {
            ...fixtures.create("IEcomExternalProps"),
            data: fixtures.create("IEcomData", (d) => {
                d.delivery = {
                    type: DeliveryType.Delivery,
                };
                d.interact = {
                    delivery: true,
                };
                d.orderOptions = {
                    getOrderOptions: () => [
                        {
                            type: DeliveryType.Pickup,
                        },
                    ],
                };

                return d;
            }),
        };

        const rendered = renderer.create(<DeliveryInformation {...props} />);
        const instance = rendered.root;

        expect(instance.children.length).toEqual(0);
    });
});
