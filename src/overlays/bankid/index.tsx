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
        this.onSwitch = this.onSwitch.bind(this);
    }

    componentDidMount() {
        this.lookupIpAddress();
        this.auth();
    }

    componentDidUpdate(prevProps: IBankIdProps) {
        this.auth();
        this.collectNewAuth(prevProps);
        this.onCollect(prevProps);
    }

    lookupIpAddress() {
        const { hasIpAddress, onLookupIpAddress } = this.props;

        if (!hasIpAddress) {
            onLookupIpAddress();
        }
    }

    auth() {
        const {
            bankIdAuth,
            onBankIdQrCodeAuth,
            pendingBankIdAuthRequest,
            hasIpAddress,
        } = this.props;
        const { useQrCode } = this.state;

        const authNotStarted = !bankIdAuth;
        const shouldAutoAuth = useQrCode;
        const noPendingAuth = !pendingBankIdAuthRequest;
        const shouldAuth =
            authNotStarted && shouldAutoAuth && noPendingAuth && hasIpAddress;

        if (shouldAuth) {
            onBankIdQrCodeAuth(() => {});
        }
    }

    collectNewAuth(prevProps: IBankIdProps) {
        const { bankIdAuth: prevAuth } = prevProps;
        const { bankIdAuth, onBankIdCollect, hasIpAddress } = this.props;

        const noIpAddress = !hasIpAddress;
        if (noIpAddress) {
            return;
        }

        const authNotStarted = !bankIdAuth;
        const authNotNew = prevAuth === bankIdAuth;
        const noNewlyStartedAuth = authNotStarted || authNotNew;
        if (noNewlyStartedAuth) {
            return;
        }

        const shouldAutoLaunch = bankIdAuth.isSameDevice();
        if (shouldAutoLaunch) {
            window.open(bankIdAuth.getAutoLaunchUrl(), "_blank");
        }

        onBankIdCollect(() => {});
    }

    onCollect(prevProps: IBankIdProps) {
        const { bankIdCollect: prevCollect } = prevProps;
        const { bankIdCollect } = this.props;

        const collectUpdated = prevCollect !== bankIdCollect;
        const shouldCollect = this.haveOngoingProcess() && collectUpdated;

        if (shouldCollect) {
            this.collect();
        }
    }

    haveOngoingProcess() {
        const { bankIdAuth, bankIdCollect } = this.props;

        return (
            !!bankIdAuth &&
            !!bankIdCollect &&
            bankIdAuth.getOrderRef() === bankIdCollect.getOrderRef()
        );
    }

    collect() {
        const { bankIdCollect, onBankIdQrCodeAuth } = this.props;

        if (bankIdCollect.isCompleted()) {
            this.onComplete();
        } else if (bankIdCollect.isPending()) {
            this.scheduleNewCollect();
        } else if (bankIdCollect.shouldRenew()) {
            onBankIdQrCodeAuth(() => {});
        }
    }

    scheduleNewCollect() {
        const { onBankIdCollect } = this.props;

        const cancellationToken = setTimeout(() => {
            if (this.haveOngoingProcess()) {
                onBankIdCollect(() => {});
            }
        }, 2000);
        this.setState({ cancellationToken });
    }

    onComplete() {
        const {
            dispatchStoreAction,
            bankIdCollect,
            onHideOverlay,
            onBankIdReset,
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
        onBankIdReset();
        onProceedToNextStep();
    }

    cancel() {
        const { cancellationToken } = this.state;
        const { onBankIdCancel } = this.props;

        clearTimeout(cancellationToken);
        onBankIdCancel(this.onCancelled);
    }

    onCancelled() {
        const { onBankIdReset, onHideOverlay } = this.props;

        const useQrCode = !isMobile();
        this.setState({ useQrCode });

        onBankIdReset();
        onHideOverlay();
    }

    switchMethod() {
        const { cancellationToken } = this.state;
        const { onBankIdCancel } = this.props;

        clearTimeout(cancellationToken);
        onBankIdCancel(this.onSwitch);
    }

    onSwitch() {
        const { onBankIdReset } = this.props;
        const { useQrCode } = this.state;

        this.setState({ useQrCode: !useQrCode });

        onBankIdReset();
    }

    canLaunch() {
        const { useQrCode } = this.state;
        const { hasIpAddress, bankIdAuth } = this.props;

        const canLaunch = hasIpAddress && !bankIdAuth && !useQrCode;
        return canLaunch;
    }

    launch() {
        const { onBankIdSameDeviceAuth } = this.props;

        if (this.canLaunch()) {
            onBankIdSameDeviceAuth(() => {});
        }
    }

    getSwitchMessage() {
        const { useQrCode } = this.state;
        const switchMessage = useQrCode
            ? "Öppna BankID på den här enheten"
            : "Mitt BankId är på en annan enhet";
        return switchMessage;
    }

    render() {
        const { bankIdAuth, bankIdCollect } = this.props;

        const hasQrCode = !!bankIdAuth && bankIdAuth.isQrCode();
        const qrCodeAsBase64 = hasQrCode && bankIdAuth.getQrCode();
        const canLaunch = this.canLaunch();
        const message = this.haveOngoingProcess()
            ? bankIdCollect.getMessage()
            : getDefaultMessage();
        const switchMessage = this.getSwitchMessage();

        return (
            <BankIdOverlay
                onCancel={this.cancel}
                onSwitchMethod={this.switchMethod}
                isQrCode={hasQrCode}
                qrCodeAsBase64={qrCodeAsBase64}
                canLaunch={canLaunch}
                onLaunch={this.launch}
                message={message}
                switchMessage={switchMessage}
            />
        );
    }
}

export default BankId;
