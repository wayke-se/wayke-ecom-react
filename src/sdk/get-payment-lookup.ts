import { payments, IPaymentLookupResponse } from "@wayke-se/ecom";
import { IPaymentLookupSdkData } from "../types";
import { validatePayment } from "../tools/data-validation";

export const getPaymentLookup = (
    data: IPaymentLookupSdkData,
    callback: (lookup: IPaymentLookupResponse | null) => void
) => {
    const isValidRequestData = validatePayment(
        data.ecomData,
        data.orderOptions,
        data.paymentLookup
    );

    if (!isValidRequestData) {
        return callback(null);
    }

    const builder = payments
        .newLookupRequest()
        .forVehicle(data.vehicleId)
        .withDownPayment(data.ecomData.loanDeposit)
        .withDuration(data.ecomData.loanDuration);

    const hasResidual = data.ecomData.loanResidual !== null;
    if (hasResidual) {
        builder.withResidualValue(data.ecomData.loanResidual);
    }

    if (data.dealerId) {
        builder.forDealer(data.dealerId);
    }

    const request = builder.build();

    payments
        .lookupPayment(request)
        .then((response: IPaymentLookupResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
};
