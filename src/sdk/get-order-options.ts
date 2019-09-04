import { orders, IOrderOptionsResponse } from '@wayke-se/ecom';
import { IOrderOptionsSdkData } from '../types';

export const getOrderOptions = (data: IOrderOptionsSdkData, callback: (options: IOrderOptionsResponse | null) => void) => {
    const request = orders.newOptionsRequest()
        .forVehicle(data.vehicleId)
        .build();

    orders.getOptions(request)
        .then((response: IOrderOptionsResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
};