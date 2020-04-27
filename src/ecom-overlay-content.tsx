import React from "react";

import { IEcomContext } from "./types";

import OverlayType from "./constants/overlay-type";
import BankIdOverlay from "./overlays/bankid-overlay";

interface IOverlayProps extends IEcomContext {
    onHideOverlay: () => void;
    type: OverlayType;
}

const MissingOverlay = (props: { onHideOverlay: () => void }) => (
    <button data-ecom-button="full-width" onClick={props.onHideOverlay}>
        Tillbaka
    </button>
);

export default (props: IOverlayProps) => {
    const { onHideOverlay } = props;

    switch (props.type) {
        case OverlayType.BANK_ID:
            return <BankIdOverlay onCancel={onHideOverlay} {...props} />;
        default:
            return <MissingOverlay onHideOverlay={props.onHideOverlay} />;
    }
};
