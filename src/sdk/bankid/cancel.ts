import { bankid } from "@wayke-se/ecom";
import { IBankIdCancelSdkData } from "../../types";

export default (
    data: IBankIdCancelSdkData,
    callback: (response: boolean) => void
) => {
    const request = bankid
        .newCancelRequest()
        .withOrderRef(data.orderRef)
        .build();

    bankid
        .cancel(request)
        .then(callback)
        .catch(() => callback(false));
};
