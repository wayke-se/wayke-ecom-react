import React from "react";

interface IBankIdProps {
    onCancel: () => void;
}

export default (props: IBankIdProps) => {
    const { onCancel } = props;
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
                        <img
                            src="/assets/toolkit/images/sample-qr.png"
                            alt="QR code"
                            style={{ width: "128px" }}
                        />
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
