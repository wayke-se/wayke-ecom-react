import { bankid, IBankIdCollectResponse } from "@wayke-se/ecom";
import { IBankIdCollectSdkData } from "../../types";

// TODO improve error handling.
export default (
    data: IBankIdCollectSdkData,
    callback: (response: IBankIdCollectResponse | Error | null) => void
) => {
    const request = bankid
        .newCollectRequest()
        .withOrderRef(data.orderRef)
        .withMethod(data.method)
        .build();

    bankid
        .collect(request)
        .then((response: IBankIdCollectResponse) => {
            callback(response);
        })
        .catch((err: Error) => {
            callback(err);
        });
};
