import React from "react";

import { IEcomContext, IEcomStore } from "../../types";
import { isMobile } from "../../utils/device";

import BankIdPresenter from "./presenter";
import StoreAction from "../../constants/store-action";

interface IBankIdProps extends IEcomContext, IEcomStore {
    onHideOverlay: () => void;
    onProceedToNextStep: () => void;
}

interface IState {
    useQrCode: boolean;
    cancellationToken?: number;
}

class CreditAssessmentBankId extends React.Component<IBankIdProps, IState> {
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
        this.onCancelledForSwitch = this.onCancelledForSwitch.bind(this);
    }

    componentDidMount() {
        this.startSigning();
    }

    componentDidUpdate(prevProps: IBankIdProps, prevState: IState) {
        this.restartAuth(prevState);
        this.onAuthStarted(prevProps);
        this.onCollect(prevProps);
    }

    componentWillUnmount() {
        const { onBankIdReset } = this.props;
        onBankIdReset();
    }

    startSigning() {
        if (this.shouldSign()) {
            this.sign();
        }
    }

    shouldSign() {
        const {
            creditAssessmentSigning,
            pendingCreditAssessmentSignRequest,
        } = this.props;

        const signingNotStarted = !creditAssessmentSigning;
        const noPendingSigning = !pendingCreditAssessmentSignRequest;
        const shouldSign = signingNotStarted && noPendingSigning;
        return shouldSign;
    }

    sign() {
        const {
            signCreditAssessmentWithQrCode,
            onBankIdSameDeviceAuth,
        } = this.props;
        const { useQrCode } = this.state;

        if (useQrCode) {
            signCreditAssessmentWithQrCode();
        } else {
            onBankIdSameDeviceAuth();
        }
    }

    restartAuth(prevState: IState) {
        const { useQrCode } = this.state;
        const { useQrCode: prevUseQrCode } = prevState;

        const methodUpdated = useQrCode !== prevUseQrCode;
        const shouldReauth = methodUpdated && this.shouldSign();

        if (shouldReauth) {
            this.sign();
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
            this.sign();
        }
    }

    scheduleNewCollect() {
        const { onBankIdCollect } = this.props;

        const cancellationToken = window.setTimeout(() => {
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

        onBankIdReset();
        this.setState({ useQrCode: !useQrCode });
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

    render() {
        const { useQrCode } = this.state;
        const {
            creditAssessmentSigning,
            bankIdCollect,
            hasBankIdError,
        } = this.props;

        const hasQrCode =
            useQrCode &&
            !!creditAssessmentSigning &&
            creditAssessmentSigning.isQrCode();
        const qrCodeAsBase64 = hasQrCode && creditAssessmentSigning.getQrCode();
        const canLaunch = this.canLaunch();
        const hasOngoingProcess = this.hasOngoingProcess();

        return (
            <BankIdPresenter
                onCancel={this.cancel}
                onSwitchMethod={this.switchMethod}
                hasQrCode={hasQrCode}
                qrCodeAsBase64={qrCodeAsBase64}
                canLaunch={canLaunch}
                onLaunch={this.launch}
                useQrCode={useQrCode}
                bankIdCollect={bankIdCollect}
                hasOngoingProcess={hasOngoingProcess}
                hasError={hasBankIdError}
            />
        );
    }
}

export default CreditAssessmentBankId;
