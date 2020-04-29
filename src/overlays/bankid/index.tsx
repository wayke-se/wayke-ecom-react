import React from "react";

import { IEcomContext, IEcomStore } from "../../types";
import { isMobile } from "../../utils/device";

import BankIdOverlay from "./base";
import StoreAction from "../../constants/store-action";

const getDefaultMessage = () => {
    return "För att hämta dina uppgifter, starta din BankID applikation på din andra enhet.";
};

interface IBankIdProps extends IEcomContext, IEcomStore {
    onHideOverlay: () => void;
    onProceedToNextStep: () => void;
}

export default (props: IBankIdProps) => {
    const {
        onHideOverlay,
        hasIpAddress,
        onLookupIpAddress,
        bankIdAuth,
        onBankIdQrCodeAuth,
        onBankIdSameDeviceAuth,
        bankIdCollect,
        onBankIdCollect,
        onBankIdCancel,
        dispatchStoreAction,
        onBankIdReset,
        onProceedToNextStep,
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
        } else {
            onBankIdSameDeviceAuth(() => {});
        }
    }, [hasIpAddress]);

    React.useEffect(() => {
        const noProcessStarted = !bankIdAuth;
        if (noProcessStarted) {
            return;
        }

        if (bankIdAuth.isSameDevice()) {
            window.open(bankIdAuth.getAutoLaunchUrl(), "_blank");
        }
        onBankIdCollect(() => {});
    }, [bankIdAuth]);

    const onComplete = () => {
        dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, {
            type: "customer",
            name: "isAuthenticated",
        });
        onBankIdReset();
        onHideOverlay();
        onProceedToNextStep();
    };

    const onCancel = () => {
        onBankIdCancel(() => {
            onBankIdReset();
            onHideOverlay();
        });
    };

    React.useEffect(() => {
        setTimeout(() => {
            const noCurrentProceess = !bankIdCollect;
            if (noCurrentProceess) {
                return;
            }

            // TODO Improve this
            if (bankIdCollect.isPending()) {
                onBankIdCollect(() => {});
            } else if (bankIdCollect.shouldRenew()) {
                onBankIdQrCodeAuth(() => {});
            } else if (bankIdCollect.isCompleted()) {
                props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
                    type: "customer",
                    name: "personalNumber",
                    value: bankIdCollect.getPersonalNumber(),
                });
                onComplete();
            }
        }, 2000);
    }, [bankIdCollect]);

    const isQrCode = !!bankIdAuth && bankIdAuth.isQrCode();
    const qrCodeAsBase64 = !!bankIdAuth && isQrCode && bankIdAuth.getQrCode();
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
