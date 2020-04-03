jest.mock("./sdk/get-order-options");

const fixtures = require("../test/fixtures");

import React from "react";
import renderer from "react-test-renderer";

import Ecom from "./index";

describe("Ecom Component", () => {
    it("renders with a spinner", () => {
        const props = fixtures.create("IEcomExternalProps");
        const rendered = renderer.create(<Ecom {...props} />);
        const instance = rendered.root;

        expect(
            instance.findByProps({ "data-ecom-spinner": "center" })
        ).not.toBeNull();
    });
});
