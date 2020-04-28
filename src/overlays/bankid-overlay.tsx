import React from "react";

import { IEcomContext } from "./../types";
import { isMobile } from "../utils/device";

import BankIdOverlay from "./base";

const getDefaultMessage = () => {
    return "För att hämta dina uppgifter, starta din BankID applikation på din andra enhet.";
};

interface IBankIdProps extends IEcomContext {
    onCancel: () => void;
}

export default (props: IBankIdProps) => {
    const {
        onCancel,
        hasIpAddress,
        onLookupIpAddress,
        bankIdAuth,
        onBankIdQrCodeAuth,
        bankIdCollect,
        onBankIdCollect,
    } = props;

    React.useEffect(() => {
        const processStarted = !!bankIdAuth;
        if (processStarted) {
            return;
        }

        if (!hasIpAddress) {
            onLookupIpAddress();
        } else if (!isMobile()) {
            onBankIdQrCodeAuth(() => {});
        }
    }, [hasIpAddress]);

    React.useEffect(() => {
        const noProcessStarted = !bankIdCollect;
        if (noProcessStarted) {
            return;
        }

        onBankIdCollect(() => {});
    }, [bankIdAuth]);

    React.useEffect(() => {
        setTimeout(() => {
            const noCurrentProceess = !bankIdCollect;
            if (noCurrentProceess) {
                return;
            }

            if (bankIdCollect.isPending()) {
                onBankIdCollect(() => {});
            } else if (bankIdCollect.shouldRenew()) {
                onBankIdQrCodeAuth(() => {});
            }
        }, 2000);
    }, [bankIdCollect]);

    const isQrCode = !!bankIdAuth && bankIdAuth.isQrCode();
    const qrCodeAsBase64 = !!bankIdAuth && bankIdAuth.getQrCode();
    const message = !!bankIdCollect
        ? bankIdCollect.getMessage()
        : getDefaultMessage();

    return (
        <BankIdOverlay
            onCancel={onCancel}
            isQrCode={isQrCode}
            qrCodeAsBase64={qrCodeAsBase64}
            message={message}
        />
    );
};
