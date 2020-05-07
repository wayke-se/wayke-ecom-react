import React from "react";

import BankIdOverlay from "./base";
import { IBankIdCollectResponse } from "@wayke-se/ecom";

interface IProps {
    onCancel: () => void;
    onSwitchMethod: () => void;
    hasQrCode: boolean;
    qrCodeAsBase64: string | undefined;
    canLaunch: boolean;
    onLaunch: () => void;
    useQrCode: boolean;
    hasOngoingProcess: boolean;
    bankIdCollect?: IBankIdCollectResponse;
}

export default ({
    onCancel,
    onSwitchMethod,
    hasQrCode,
    qrCodeAsBase64,
    canLaunch,
    onLaunch,
    useQrCode,
    bankIdCollect,
    hasOngoingProcess,
}: IProps) => {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [switchDescription, setSwitchDescription] = React.useState("");

    const logoDimensions = useQrCode
        ? { width: "32px", height: "32px" }
        : { width: "128px", height: "128px" };

    React.useEffect(() => {
        const text = useQrCode
            ? "Öppna BankID och skanna QR-koden"
            : "Skriv in din säkerhetskod i BankID-appen";
        setTitle(text);
    }, [useQrCode]);

    React.useEffect(() => {
        const text = useQrCode
            ? "Öppna BankID på den här enheten"
            : "Mitt BankId är på en annan enhet";
        setSwitchDescription(text);
    }, [useQrCode]);

    React.useEffect(() => {
        if (hasOngoingProcess) {
            const message = bankIdCollect.getMessage();
            setDescription(message);
        } else if (useQrCode) {
            setDescription(
                "För att hämta dina uppgifter, starta din BankID applikation på din andra enhet."
            );
        } else {
            setDescription(
                "För att hämta dina uppgifter, starta din BankID applikation."
            );
        }
    }, [bankIdCollect, useQrCode]);

    return (
        <BankIdOverlay
            title={title}
            onCancel={onCancel}
            onSwitchMethod={onSwitchMethod}
            hasQrCode={hasQrCode}
            qrCodeAsBase64={qrCodeAsBase64}
            canLaunch={canLaunch}
            onLaunch={onLaunch}
            description={description}
            switchDescription={switchDescription}
            logoDimensions={logoDimensions}
        />
    );
};
