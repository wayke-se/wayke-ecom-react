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

    const [useQrCode, setUseQrCode] = React.useState(!isMobile());
    const [cancellationToken, setCancellationToken] = React.useState<
        NodeJS.Timeout
    >();

    const auth = () => {
        if (useQrCode) {
            onBankIdQrCodeAuth(() => {});
        }
    };

    React.useEffect(() => {
        const processStarted = !!bankIdAuth;
        if (processStarted) {
            return;
        }

        if (!hasIpAddress) {
            onLookupIpAddress();
            return;
        }

        const noProcessStarted = !bankIdAuth;
        if (noProcessStarted) {
            auth();
        }
    }, [hasIpAddress, bankIdAuth]);

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
        clearTimeout(cancellationToken);
        onBankIdCancel(() => {
            setUseQrCode(!isMobile());
            onBankIdReset();
            onHideOverlay();
        });
    };

    React.useEffect(() => {
        const token = setTimeout(() => {
            const noCurrentProceess = !bankIdCollect || !bankIdAuth;
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
        setCancellationToken(token);
    }, [bankIdCollect]);

    const onSwitchMethod = () => {
        clearTimeout(cancellationToken);
        onBankIdCancel(() => {
            setUseQrCode(!useQrCode);
            onBankIdReset();
        });
    };

    const hasQrCode = !!bankIdAuth && bankIdAuth.isQrCode();
    const qrCodeAsBase64 = !!bankIdAuth && hasQrCode && bankIdAuth.getQrCode();
    const canLaunch = !!hasIpAddress && !bankIdAuth && !useQrCode;
    const message =
        !!bankIdAuth && !!bankIdCollect
            ? bankIdCollect.getMessage()
            : getDefaultMessage();
    const switchMessage = useQrCode
        ? "Öppna BankID på den här enheten"
        : "Mitt BankId är på en annan enhet";

    const onLaunch = () => {
        if (canLaunch) {
            onBankIdSameDeviceAuth(() => {});
        }
    };

    return (
        <BankIdOverlay
            onCancel={onCancel}
            onSwitchMethod={onSwitchMethod}
            isQrCode={hasQrCode}
            qrCodeAsBase64={qrCodeAsBase64}
            canLaunch={canLaunch}
            onLaunch={onLaunch}
            message={message}
            switchMessage={switchMessage}
        />
    );
};
