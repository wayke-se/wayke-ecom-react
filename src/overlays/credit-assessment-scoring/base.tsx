import React from "react";

interface IProps {
    onCancel: () => void;
}

export default ({ onCancel }: IProps) => (
    <div data-ecom-frame>
        <div className="frame-body">
            <div data-ecom-page="justify-center" className="text-center">
                <section className="page-section">
                    <h1 className="h6">Väntar på Volvofinans...</h1>
                    <div data-ecom-content>
                        <p>
                            Hämtar uppgifter från Volvofinans. Detta kan ta upp
                            till en minut.
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
