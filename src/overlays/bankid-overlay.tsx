import React from "react";

import { IEcomContext } from "./../types";
import { isMobile } from "../utils/device";

import BankIdOverlay from "./base";

interface IBankIdProps extends IEcomContext {
    onCancel: () => void;
}

export default (props: IBankIdProps) => {
    const {
        onCancel,
        bankIdAuth,
        onLookupIpAddress,
        hasIpAddress,
        onBankIdQrCodeAuth,
    } = props;

    React.useEffect(() => {
        if (!hasIpAddress) {
            onLookupIpAddress();
        } else if (!isMobile()) {
            onBankIdQrCodeAuth(() => {});
        }
    }, [hasIpAddress]);

    const isQrCode = !!bankIdAuth && bankIdAuth.isQrCode();
    const qrCodeAsBase64 = !!bankIdAuth && bankIdAuth.getQrCode();

    return (
        <BankIdOverlay
            onCancel={onCancel}
            isQrCode={isQrCode}
            qrCodeAsBase64={qrCodeAsBase64}
        />
    );
};
