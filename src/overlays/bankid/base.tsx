import React from "react";

import QrCode from "./qr-code";
import LaunchButton from "./launch-button";

interface IProps {
    onCancel: () => void;
    onSwitchMethod: () => void;
    isQrCode: boolean;
    qrCodeAsBase64: string | undefined;
    message: string;
    switchMessage: string;
    canLaunch: boolean;
    onLaunch: () => void;
}

export default ({
    onCancel,
    onSwitchMethod,
    isQrCode,
    qrCodeAsBase64,
    message,
    switchMessage,
    canLaunch,
    onLaunch,
}: IProps) => (
    <div data-ecom-frame="">
        <div className="frame-body">
            <div data-ecom-page="justify-center" className="text-center">
                <section className="page-section">
                    <h1 className="h6">Öppna BankID och skanna QR-koden</h1>
                    <div data-ecom-content="">
                        <p>{message}</p>
                    </div>
                </section>
                <section className="page-section">
                    {isQrCode && <QrCode qrCodeAsBase64={qrCodeAsBase64} />}
                </section>
                <section className="page-section">
                    <div className="repeat-m-half">
                        <img
                            src="/assets/images/bankid/bankid-logo-32x32@2x.png"
                            srcSet="/assets/images/bankid/bankid-logo-32x32@2x.png 2x"
                            alt="BankID"
                        />
                    </div>
                    <div className="repeat-m-half">
                        <div data-ecom-spinner="center third-party">
                            <div className="spinner"></div>
                        </div>
                    </div>
                </section>
                <section className="page-section">
                    {canLaunch && <LaunchButton onLaunch={onLaunch} />}
                    <div className="repeat-m">
                        <button data-ecom-link="" onClick={onSwitchMethod}>
                            {switchMessage}
                        </button>
                    </div>
                    <div className="repeat-m">
                        <button data-ecom-link="" onClick={onCancel}>
                            Avbryt
                        </button>
                    </div>
                </section>
            </div>
        </div>
    </div>
);
