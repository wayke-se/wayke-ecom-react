import { orders, IOrderOptionsResponse } from 'wayke-ecom';
import { IOrderOptionsSdkData } from '../types';

export const getOrderOptions = (data: IOrderOptionsSdkData, callback: (options: IOrderOptionsResponse) => void) => {
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