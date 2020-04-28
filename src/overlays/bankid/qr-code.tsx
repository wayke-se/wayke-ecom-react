import React from "react";

interface IProps {
    qrCodeAsBase64: string;
}

export default (props: IProps) => {
    const { qrCodeAsBase64 } = props;

    const [qrCodeSrc, setQrCodeSrc] = React.useState("");
    React.useEffect(() => {
        const src = `data:image/png;base64, ${qrCodeAsBase64}`;
        setQrCodeSrc(src);
    }, [qrCodeAsBase64]);

    return <img src={qrCodeSrc} alt="QR code" style={{ width: "128px" }} />;
};
