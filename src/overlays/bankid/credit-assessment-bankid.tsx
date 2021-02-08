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
        this.renewSigning(prevState);
        this.onSigningStarted(prevProps);
        this.onStatusReceived(prevProps);
    }

    componentWillUnmount() {
        const { resetCreditAssessmentSigning } = this.props;
        resetCreditAssessmentSigning();
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
            signCreditAssessmentWithSameDevice,
        } = this.props;
        const { useQrCode } = this.state;

        if (useQrCode) {
            signCreditAssessmentWithQrCode();
        } else {
            signCreditAssessmentWithSameDevice();
        }
    }

    renewSigning(prevState: IState) {
        const { useQrCode } = this.state;
        const { useQrCode: prevUseQrCode } = prevState;

        const methodUpdated = useQrCode !== prevUseQrCode;
        const shouldRenewSigning = methodUpdated && this.shouldSign();

        if (shouldRenewSigning) {
            this.sign();
        }
    }

    onSigningStarted(prevProps: IBankIdProps) {
        const { creditAssessmentSigning: prevSigning } = prevProps;
        const {
            creditAssessmentSigning,
            getCreditAssessmentStatus,
        } = this.props;

        const signingStarted = !!creditAssessmentSigning;
        const signingIsNew = prevSigning !== creditAssessmentSigning;
        const newSigningStarted = signingStarted && signingIsNew;

        if (newSigningStarted) {
            getCreditAssessmentStatus();
        }
    }

    onStatusReceived(prevProps: IBankIdProps) {
        const { creditAssessmentStatus: prevStatus } = prevProps;
        const { creditAssessmentStatus } = this.props;

        const statusUpdated = prevStatus !== creditAssessmentStatus;
        const noNewStatusReceived = !this.hasOngoingProcess() || !statusUpdated;

        if (noNewStatusReceived) {
            return;
        }

        if (creditAssessmentStatus.isSigned()) {
            this.completeSigning();
        } else if (creditAssessmentStatus.hasPendingSigning()) {
            this.scheduleNewStatusCollect();
        } else if (creditAssessmentStatus.shouldRenewSigning()) {
            this.sign();
        }
    }

    // TODO Is this function needed?
    hasOngoingProcess() {
        const { creditAssessmentSigning, creditAssessmentStatus } = this.props;

        return !!creditAssessmentSigning && !!creditAssessmentStatus;
    }

    scheduleNewStatusCollect() {
        const { getCreditAssessmentStatus } = this.props;

        const cancellationToken = window.setTimeout(() => {
            if (this.hasOngoingProcess()) {
                getCreditAssessmentStatus();
            }
        }, 2000);
        this.setState({ cancellationToken });
    }

    completeSigning() {
        const {
            dispatchStoreAction,
            onHideOverlay,
            onProceedToNextStep,
        } = this.props;

        dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, {
            type: "customer",
            name: "isAuthenticated",
        });

        onHideOverlay();
        onProceedToNextStep();
    }

    cancel() {
        const { cancellationToken } = this.state;
        const { cancelCreditAssessmentSigning } = this.props;

        clearTimeout(cancellationToken);
        cancelCreditAssessmentSigning(this.onCancelled);
    }

    onCancelled() {
        const { onHideOverlay } = this.props;

        const useQrCode = !isMobile();
        this.setState({ useQrCode });

        onHideOverlay();
    }

    switchMethod() {
        const { cancellationToken } = this.state;
        const { cancelCreditAssessmentSigning } = this.props;

        clearTimeout(cancellationToken);
        cancelCreditAssessmentSigning(this.onCancelledForSwitch);
    }

    onCancelledForSwitch() {
        const { resetCreditAssessmentSigning } = this.props;
        const { useQrCode } = this.state;

        resetCreditAssessmentSigning();
        this.setState({ useQrCode: !useQrCode });
    }

    canLaunch() {
        const { useQrCode } = this.state;
        const { creditAssessmentSigning } = this.props;

        const canLaunch =
            !!creditAssessmentSigning &&
            !useQrCode &&
            creditAssessmentSigning.isSameDevice();
        return canLaunch;
    }

    launch() {
        const { creditAssessmentSigning } = this.props;
        if (this.canLaunch()) {
            window.open(creditAssessmentSigning.getAutoLaunchUrl(), "_blank");
        }
    }

    render() {
        const { useQrCode } = this.state;
        const {
            creditAssessmentSigning,
            creditAssessmentStatus,
            hasCreditAssessmentError,
        } = this.props;

        const hasQrCode =
            useQrCode &&
            !!creditAssessmentSigning &&
            creditAssessmentSigning.isQrCode();
        const qrCodeAsBase64 = hasQrCode && creditAssessmentSigning.getQrCode();
        const canLaunch = this.canLaunch();
        const hasOngoingProcess = this.hasOngoingProcess();
        const message = !!creditAssessmentStatus
            ? creditAssessmentStatus.getSigningMessage()
            : "";

        return (
            <BankIdPresenter
                onCancel={this.cancel}
                onSwitchMethod={this.switchMethod}
                hasQrCode={hasQrCode}
                qrCodeAsBase64={qrCodeAsBase64}
                canLaunch={canLaunch}
                onLaunch={this.launch}
                useQrCode={useQrCode}
                message={message}
                hasOngoingProcess={hasOngoingProcess}
                hasError={hasCreditAssessmentError}
            />
        );
    }
}

export default CreditAssessmentBankId;
