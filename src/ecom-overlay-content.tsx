import React from "react";

import OverlayType from "./constants/overlay-type";
import BankIdOverlay from "./overlays/bankid-overlay";

interface IOverlayProps {
    onHideOverlay: () => void;
    type: OverlayType;
}

const MissingOverlay = (props: IOverlayProps) => (
    <button data-ecom-button="full-width" onClick={props.onHideOverlay}>
        Tillbaka
    </button>
);

export default (props: IOverlayProps) => {
    const { onHideOverlay } = props;

    switch (props.type) {
        case OverlayType.BANK_ID:
            return <BankIdOverlay onCancel={onHideOverlay} />;
        default:
            return <MissingOverlay {...props} />;
    }
};
