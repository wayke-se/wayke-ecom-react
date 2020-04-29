import React from "react";

import { IEcomContext, IEcomStore } from "./types";

import OverlayType from "./constants/overlay-type";
import BankIdOverlay from "./overlays/bankid";

interface IOverlayProps extends IEcomContext, IEcomStore {
    onHideOverlay: () => void;
    onProceedToNextStep: () => void;
    type: OverlayType;
}

const MissingOverlay = (props: { onHideOverlay: () => void }) => (
    <button data-ecom-button="full-width" onClick={props.onHideOverlay}>
        Tillbaka
    </button>
);

export default (props: IOverlayProps) => {
    const { onHideOverlay, onProceedToNextStep } = props;

    switch (props.type) {
        case OverlayType.BANK_ID:
            return (
                <BankIdOverlay
                    onProceedToNextStep={onProceedToNextStep}
                    onHideOverlay={onHideOverlay}
                    {...props}
                />
            );
        default:
            return <MissingOverlay onHideOverlay={props.onHideOverlay} />;
    }
};
