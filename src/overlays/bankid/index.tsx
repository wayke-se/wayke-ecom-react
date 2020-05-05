import React from "react";

import { IEcomContext, IEcomStore } from "../../types";
import { isMobile } from "../../utils/device";

import BankIdOverlay from "./base";
import StoreAction from "../../constants/store-action";

interface IBankIdProps extends IEcomContext, IEcomStore {
    onHideOverlay: () => void;
    onProceedToNextStep: () => void;
}

interface IState {
    useQrCode: boolean;
    cancellationToken?: NodeJS.Timeout;
}

class BankId extends React.Component<IBankIdProps, IState> {
    constructor(props: IBankIdProps) {
        super(props);

        const useQrCode = !isMobile();
        this.state = {
            useQrCode,
            cancellationToken: null,
        };

        this.cancel = this.cancel.bind(this);
        this.switchMethod = this.switchMethod.bind(this);
        this.launch = this.launch.bind(this);
        this.onCancelled = this.onCancelled.bind(this);
        this.getSwitchMessage = this.getSwitchMessage.bind(this);
        this.onCancelledForSwitch = this.onCancelledForSwitch.bind(this);
    }

    componentDidMount() {
        this.lookupIpAddress();
        this.startAuth();
    }

    componentDidUpdate(prevProps: IBankIdProps) {
        this.startAuth();
        this.onAuthStarted(prevProps);
        this.onCollect(prevProps);
    }

    componentWillUnmount() {
        const { onBankIdReset } = this.props;
        onBankIdReset();
    }

    lookupIpAddress() {
        const { hasIpAddress, onLookupIpAddress } = this.props;

        if (!hasIpAddress) {
            onLookupIpAddress();
        }
    }

    startAuth() {
        const {
            bankIdAuth,
            pendingBankIdAuthRequest,
            hasIpAddress,
        } = this.props;

        const authNotStarted = !bankIdAuth;
        const noPendingAuth = !pendingBankIdAuthRequest;
        const shouldAuth = authNotStarted && noPendingAuth && hasIpAddress;

        if (shouldAuth) {
            this.auth();
        }
    }

    auth() {
        const { onBankIdQrCodeAuth, onBankIdSameDeviceAuth } = this.props;
        const { useQrCode } = this.state;

        if (useQrCode) {
            onBankIdQrCodeAuth();
        } else {
            onBankIdSameDeviceAuth();
        }
    }

    onAuthStarted(prevProps: IBankIdProps) {
        const { bankIdAuth: prevAuth } = prevProps;
        const { bankIdAuth, onBankIdCollect } = this.props;

        const authStarted = !!bankIdAuth;
        const authIsNew = prevAuth !== bankIdAuth;
        const newAuthStarted = authStarted && authIsNew;

        if (newAuthStarted) {
            onBankIdCollect();
        }
    }

    onCollect(prevProps: IBankIdProps) {
        const { bankIdCollect: prevCollect } = prevProps;
        const { bankIdCollect } = this.props;

        const collectUpdated = prevCollect !== bankIdCollect;
        const shouldCollect = this.hasOngoingProcess() && collectUpdated;

        if (shouldCollect) {
            this.collect();
        }
    }

    hasOngoingProcess() {
        const { bankIdAuth, bankIdCollect } = this.props;

        return (
            !!bankIdAuth &&
            !!bankIdCollect &&
            bankIdAuth.getOrderRef() === bankIdCollect.getOrderRef()
        );
    }

    collect() {
        const { bankIdCollect } = this.props;

        if (bankIdCollect.isCompleted()) {
            this.onComplete();
        } else if (bankIdCollect.isPending()) {
            this.scheduleNewCollect();
        } else if (bankIdCollect.shouldRenew()) {
            this.auth();
        }
    }

    scheduleNewCollect() {
        const { onBankIdCollect } = this.props;

        const cancellationToken = setTimeout(() => {
            if (this.hasOngoingProcess()) {
                onBankIdCollect();
            }
        }, 2000);
        this.setState({ cancellationToken });
    }

    onComplete() {
        const {
            dispatchStoreAction,
            bankIdCollect,
            onHideOverlay,
            onProceedToNextStep,
        } = this.props;

        dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, {
            type: "customer",
            name: "isAuthenticated",
        });
        dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "customer",
            name: "personalNumber",
            value: bankIdCollect.getPersonalNumber(),
        });

        onHideOverlay();
        onProceedToNextStep();
    }

    cancel() {
        const { cancellationToken } = this.state;
        const { onBankIdCancel } = this.props;

        clearTimeout(cancellationToken);
        onBankIdCancel(this.onCancelled);
    }

    onCancelled() {
        const { onHideOverlay } = this.props;

        const useQrCode = !isMobile();
        this.setState({ useQrCode });

        onHideOverlay();
    }

    switchMethod() {
        const { cancellationToken } = this.state;
        const { onBankIdCancel } = this.props;

        clearTimeout(cancellationToken);
        onBankIdCancel(this.onCancelledForSwitch);
    }

    onCancelledForSwitch() {
        const { onBankIdReset } = this.props;
        const { useQrCode } = this.state;

        this.setState({ useQrCode: !useQrCode });
        onBankIdReset();
    }

    canLaunch() {
        const { useQrCode } = this.state;
        const { bankIdAuth } = this.props;

        const canLaunch =
            !!bankIdAuth && !useQrCode && bankIdAuth.isSameDevice();
        return canLaunch;
    }

    launch() {
        const { bankIdAuth } = this.props;
        if (this.canLaunch()) {
            window.open(bankIdAuth.getAutoLaunchUrl(), "_blank");
        }
    }

    getSwitchMessage() {
        const { useQrCode } = this.state;
        const switchMessage = useQrCode
            ? "Öppna BankID på den här enheten"
            : "Mitt BankId är på en annan enhet";
        return switchMessage;
    }

    getTitle() {
        const { useQrCode } = this.state;
        return useQrCode
            ? "Öppna BankID och skanna QR-koden"
            : "Skriv in din säkerhetskod i BankID-appen";
    }

    getMessage() {
        const { bankIdCollect } = this.props;
        const { useQrCode } = this.state;

        if (this.hasOngoingProcess()) {
            return bankIdCollect.getMessage();
        } else if (useQrCode) {
            return "För att hämta dina uppgifter, starta din BankID applikation på din andra enhet.";
        }
        return "För att hämta dina uppgifter, starta din BankID applikation.";
    }

    getLogoDimensions() {
        const { useQrCode } = this.state;
        return useQrCode
            ? { width: "32px", height: "32px" }
            : { width: "128px", height: "128px" };
    }

    render() {
        const { bankIdAuth } = this.props;

        const hasQrCode = !!bankIdAuth && bankIdAuth.isQrCode();
        const qrCodeAsBase64 = hasQrCode && bankIdAuth.getQrCode();
        const canLaunch = this.canLaunch();
        const title = this.getTitle();
        const message = this.getMessage();
        const switchMessage = this.getSwitchMessage();
        const logoDimensions = this.getLogoDimensions();

        return (
            <BankIdOverlay
                title={title}
                onCancel={this.cancel}
                onSwitchMethod={this.switchMethod}
                isQrCode={hasQrCode}
                qrCodeAsBase64={qrCodeAsBase64}
                canLaunch={canLaunch}
                onLaunch={this.launch}
                message={message}
                switchMessage={switchMessage}
                logoDimensions={logoDimensions}
            />
        );
    }
}

export default BankId;
