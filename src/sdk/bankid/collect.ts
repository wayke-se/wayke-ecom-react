import { bankid, IBankIdCollectResponse } from "@wayke-se/ecom";
import { IBankIdCollectSdkData } from "../../types";

export default (
    data: IBankIdCollectSdkData,
    callback: (response: IBankIdCollectResponse | Error | null) => void
) => {
    const request = bankid
        .newCollectRequest()
        .withOrderRef(data.orderRef)
        .build();

    bankid
        .collect(request)
        .then((response: IBankIdCollectResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
};
