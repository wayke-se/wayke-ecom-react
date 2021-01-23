import { orders, IOrderOptionsResponse } from "@wayke-se/ecom";
import { IOrderOptionsSdkData } from "../types";

export const getOrderOptions = (
    data: IOrderOptionsSdkData,
    callback: (options: IOrderOptionsResponse | null) => void
) => {
    const request = orders.newOptionsRequest().forVehicle(data.vehicleId);

    if (data.dealerId) request.forDealer(data.dealerId);

    orders
        .getOptions(request.build())
        .then((response: IOrderOptionsResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
};
