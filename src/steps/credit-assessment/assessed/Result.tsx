import React from "react";

const Success = () => (
    <div data-ecom-alert="success">
        <div className="alert-icon-section">
            <div className="alert-icon">
                <i className="icon-exclamation no-margin"></i>
            </div>
        </div>
        <div className="alert-content">
            <span className="font-medium">
                Grattis! Din låneansökan har beviljats.
            </span>{" "}
            Vi har fått de uppgifter som vi behöver och det kommer inte göras
            ytterligare kreditprövningar vid avtalsskrivning med handlaren.
        </div>
    </div>
);

const Failure = () => (
    <div data-ecom-alert="warning">
        <div className="alert-icon-section">
            <div className="alert-icon">
                <i className="icon-exclamation no-margin" />
            </div>
        </div>
        <div className="alert-content">
            <span className="font-medium">
                Tyvärr kommer inte detta lån att beviljas.
            </span>{" "}
            Testa att justera lånevillkoren. En ny kreditprövning kommer att
            göras med dina nya val.{" "}
            <button data-ecom-link="baseline">Justera nu</button>
        </div>
    </div>
);

interface IProps {
    decision?: string;
}

const Result = ({ decision }: IProps) => {
    // TODO Handle different decisions and recommendations.
    if (!!decision) {
        return <Success />;
    }
    return <Failure />;
};

export default Result;
