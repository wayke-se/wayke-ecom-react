import React from "react";

interface IProps {
    onCancel: () => void;
    financialProvider: string;
}

export default ({ onCancel, financialProvider }: IProps) => (
    <div data-ecom-frame>
        <div className="frame-body">
            <div data-ecom-page="justify-center" className="text-center">
                <section className="page-section">
                    <h1 className="h6">Väntar på {financialProvider}...</h1>
                    <div data-ecom-content>
                        <p>
                            Hämtar uppgifter från {financialProvider}. Vänta
                            kvar då det kan ta några sekunder.
                        </p>
                    </div>
                </section>
                <section className="page-section">
                    <div data-ecom-spinner="center third-party">
                        <div className="spinner" />
                    </div>
                </section>
                <section className="page-section">
                    <button data-ecom-link onClick={onCancel}>
                        Avbryt
                    </button>
                </section>
            </div>
        </div>
    </div>
);
