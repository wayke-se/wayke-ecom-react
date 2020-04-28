import React from "react";

import { IEcomContext, IEcomStore } from "../../types";
import { isMobile } from "../../utils/device";

import BankIdOverlay from "./base";
import { AuthStatus } from "@wayke-se/ecom";
import StoreAction from "../../constants/store-action";

const getDefaultMessage = () => {
    return "För att hämta dina uppgifter, starta din BankID applikation på din andra enhet.";
};

interface IBankIdProps extends IEcomContext, IEcomStore {
    onCancel: () => void;
    onCompleted: () => void;
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
        onCompleted,
        dispatchStoreAction,
        onBankIdSuccess,
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
        const noProcessStarted = !bankIdAuth;
        if (noProcessStarted) {
            return;
        }

        onBankIdCollect(() => {});
    }, [bankIdAuth]);

    const onComplete = () => {
        onCancel();
        onCompleted();
        onBankIdSuccess();
        dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, {
            type: "customer",
            name: "isAuthenticated",
        });
    };

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
            } else if (bankIdCollect.getStatus() === AuthStatus.Complete) {
                onComplete();
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
