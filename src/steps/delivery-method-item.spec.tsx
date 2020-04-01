const fixtures = require("../../test/fixtures");

import React from "react";
import renderer from "react-test-renderer";

import DeliveryMethodItem from "./delivery-method-item";
import { DeliveryType } from "@wayke-se/ecom";
import CustomerInformationInputType from "../constants/customer-information-input-type";

describe("Delivery Method Item", () => {
    it("renders DeliveryType.Delivery disabled for unavailable distance", () => {
        const maxQuantity = 10;
        const value = maxQuantity + 1;
        const deliveryOption = fixtures.create("IDeliveryOption", {
            type: DeliveryType.Delivery,
            maxQuantity,
        });
        const address = fixtures.create("IAddress", {
            distance: fixtures.create("IDistance", {
                value,
                unit: deliveryOption.unit,
            }),
        });
        const customer = fixtures.create("ICustomerData", {
            inputType: CustomerInformationInputType.AUTOMATIC,
        });

        const data = {
            ...fixtures.create("IEcomExternalProps"),
            data: {
                customer,
            },
            address,
            deliveryOption,
        };
        const rendered = renderer.create(<DeliveryMethodItem {...data} />);
        const instance = rendered.root;

        expect(instance.findByType("button").props.disabled).toBeTruthy();
    });
    it("renders DeliveryType.Delivery disabled for non-automatic address", () => {
        const maxQuantity = 10;
        const value = maxQuantity - 1;
        const deliveryOption = fixtures.create("IDeliveryOption", {
            type: DeliveryType.Delivery,
            maxQuantity,
        });
        const address = fixtures.create("IAddress", {
            distance: fixtures.create("IDistance", {
                value,
                unit: deliveryOption.unit,
            }),
        });
        const customer = fixtures.create("ICustomerData", {
            inputType: CustomerInformationInputType.MANUAL,
        });

        const data = {
            ...fixtures.create("IEcomExternalProps"),
            data: {
                customer,
            },
            address,
            deliveryOption,
        };
        const rendered = renderer.create(<DeliveryMethodItem {...data} />);
        const instance = rendered.root;

        expect(instance.findByType("button").props.disabled).toBeTruthy();
    });
});
