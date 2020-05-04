const fixtures = require("../../../test/fixtures");

import React from "react";
import BankIdPresenter, { IBankIdPresenterProps } from "./presenter";
import BankIdOverlay from "./base";
import { shallow } from "enzyme";

describe("Render BankId Presenter", () => {
    describe("Given qr code", () => {
        let wrapper;

        beforeAll(() => {
            const props: IBankIdPresenterProps = fixtures.create(
                "IBankIdPresenterProps",
                (p: IBankIdPresenterProps) => {
                    p.useQrCode = true;
                    return p;
                }
            );
            wrapper = shallow(<BankIdPresenter {...props} />);
        });

        it("Should use qr code title", () => {
            const overlay = wrapper.find(BankIdOverlay);
            expect(overlay.props()).toHaveProperty(
                "title",
                "Öppna BankID och skanna QR-koden"
            );
        });

        it("Should use qr code switch description", () => {
            const overlay = wrapper.find(BankIdOverlay);
            expect(overlay.props()).toHaveProperty(
                "switchDescription",
                "Öppna BankID på den här enheten"
            );
        });

        it("Should use small logo dimensions", () => {
            const overlay = wrapper.find(BankIdOverlay);
            expect(overlay.props()).toHaveProperty("logoDimensions", {
                width: "32px",
                height: "32px",
            });
        });
    });

    describe("Given same device", () => {
        let wrapper;

        beforeAll(() => {
            const props: IBankIdPresenterProps = fixtures.create(
                "IBankIdPresenterProps",
                (p: IBankIdPresenterProps) => {
                    p.useQrCode = false;
                    return p;
                }
            );
            wrapper = shallow(<BankIdPresenter {...props} />);
        });

        it("Should use same device code title", () => {
            const overlay = wrapper.find(BankIdOverlay);
            expect(overlay.props()).toHaveProperty(
                "title",
                "Skriv in din säkerhetskod i BankID-appen"
            );
        });

        it("Should use same device code switch description", () => {
            const overlay = wrapper.find(BankIdOverlay);
            expect(overlay.props()).toHaveProperty(
                "switchDescription",
                "Mitt BankId är på en annan enhet"
            );
        });

        it("Should use large logo dimensions", () => {
            const overlay = wrapper.find(BankIdOverlay);
            expect(overlay.props()).toHaveProperty("logoDimensions", {
                width: "128px",
                height: "128px",
            });
        });
    });
});
