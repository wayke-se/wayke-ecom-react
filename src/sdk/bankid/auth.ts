import { bankid, IBankIdAuthResponse } from "@wayke-se/ecom";
import { IBankIdAuthSdkData } from "../../types";

export default (
    data: IBankIdAuthSdkData,
    callback: (response: IBankIdAuthResponse | null) => void
) => {
    const { method, ipAddress } = data;
    const request = bankid
        .newAuthRequest()
        .withIpAddress(ipAddress)
        .withMethod(method)
        .build();

    bankid
        .auth(request)
        .then((response: IBankIdAuthResponse) => {
            callback(response);
        })
        .catch((err: Error) => {
            // TODO Handle errors
            // eslint-disable-next-line no-console
            console.log(err);
            callback(null);
        });
};
