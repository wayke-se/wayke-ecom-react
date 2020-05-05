import { bankid, IBankIdAuthResponse } from "@wayke-se/ecom";
import { IBankIdAuthSdkData } from "../../types";

export default (
    data: IBankIdAuthSdkData,
    callback: (response: IBankIdAuthResponse | Error | null) => void
) => {
    const request = bankid
        .newAuthRequest()
        .withIpAddress(data.ipAddress)
        .withMethod(data.method)
        .build();

    bankid
        .auth(request)
        .then((response: IBankIdAuthResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
};
