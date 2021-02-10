import React from "react";

interface IProps {
    texts: string[];
    onReturn: () => void;
}

export default ({ texts, onReturn }: IProps) => (
    <div data-ecom-frame>
        <div className="frame-body">
            <div data-ecom-page="justify-center" className="text-center">
                <section className="page-section">
                    <div data-ecom-alert="error">
                        <div className="alert-icon-section">
                            <div className="alert-icon">
                                <i className="icon-exclamation no-margin"></i>
                            </div>
                        </div>
                        <div className="alert-content">
                            {texts.map((text) => ({ text }))}
                        </div>
                    </div>
                </section>
                <section className="page-section">
                    <button data-ecom-link onClick={onReturn}>
                        Gå tillbaka
                    </button>
                </section>
            </div>
        </div>
    </div>
);
