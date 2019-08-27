import { orders, IOrderOptionsResponse } from 'wayke-ecom';

export const getInitialData = (vehicleId: string, callback: (options: IOrderOptionsResponse) => void) => {
    const request = orders.newOptionsRequest()
        .forVehicle(vehicleId)
        .build();

    orders.getOptions(request)
        .then(callback)
        .catch((e) => {
            throw e;
        });
};