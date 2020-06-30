import React from "react";

import QrCode from "./qr-code";
import LaunchButton from "./launch-button";
import Logo from "./logo";
import Spinner from "./spinner";

interface IProps {
    title: string;
    onCancel: () => void;
    onSwitchMethod: () => void;
    hasQrCode: boolean;
    qrCodeAsBase64: string | undefined;
    description: string;
    switchDescription: string;
    canLaunch: boolean;
    onLaunch: () => void;
    logoDimensions: { width: string; height: string };
    hasError: boolean;
}

export default ({
    title,
    onCancel,
    onSwitchMethod,
    hasQrCode,
    qrCodeAsBase64,
    description,
    switchDescription,
    canLaunch,
    onLaunch,
    logoDimensions,
    hasError,
}: IProps) => (
    <div data-ecom-frame="">
        <div className="frame-body">
            <div data-ecom-page="justify-center" className="text-center">
                <section className="page-section">
                    <h1 className="h6">{title}</h1>
                    <div data-ecom-content="">
                        <p>{description}</p>
                    </div>
                </section>
                <section className="page-section">
                    {hasQrCode && <QrCode qrCodeAsBase64={qrCodeAsBase64} />}
                </section>
                <section className="page-section">
                    <Logo dimensions={logoDimensions} />
                    {!hasError && <Spinner />}
                </section>
                <section className="page-section">
                    {canLaunch && <LaunchButton onLaunch={onLaunch} />}
                    <div className="repeat-m">
                        <button data-ecom-link="" onClick={onSwitchMethod}>
                            {switchDescription}
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
