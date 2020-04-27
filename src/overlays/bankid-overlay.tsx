import React from "react";

import { IEcomContext } from "./../types";
import { isMobile } from "../utils/device";

interface IBankIdProps extends IEcomContext {
    onCancel: () => void;
}

const QrCode = (props: { qrCodeAsBase64: string }) => {
    const { qrCodeAsBase64 } = props;

    const [qrCodeSrc, setQrCodeSrc] = React.useState("");
    React.useEffect(() => {
        const src = `data:image/png;base64, ${qrCodeAsBase64}`;
        setQrCodeSrc(src);
    }, [qrCodeAsBase64]);

    return <img src={qrCodeSrc} alt="QR code" style={{ width: "128px" }} />;
};

export default (props: IBankIdProps) => {
    const {
        onCancel,
        bankIdAuth,
        onLookupIpAddress,
        ipAddress,
        onBankIdQrCodeAuth,
    } = props;

    React.useEffect(() => {
        onLookupIpAddress();
    }, []);

    React.useEffect(() => {
        if (!!ipAddress && !isMobile()) {
            onBankIdQrCodeAuth(() => {});
        }
    }, [ipAddress]);

    return (
        <div data-ecom-frame="">
            <div className="frame-body">
                <div data-ecom-page="justify-center" className="text-center">
                    <section className="page-section">
                        <h1 className="h6">Öppna BankID och skanna QR-koden</h1>
                        <div data-ecom-content="">
                            <p>
                                För att hämta dina uppgifter, starta din BankID
                                applikation på din andra enhet.
                            </p>
                        </div>
                    </section>
                    <section className="page-section">
                        {bankIdAuth?.isQrCode() && (
                            <QrCode qrCodeAsBase64={bankIdAuth.getQrCode()} />
                        )}
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
                        <div className="repeat-m">
                            <button data-ecom-link="">
                                Öppna BankID på den här enheten
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
};
