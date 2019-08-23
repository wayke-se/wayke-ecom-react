import { orders } from 'wayke-ecom';

export const getInitialData = (vehicleId, callback) => {
    const request = orders.newOptionsRequest()
        .forVehicle(vehicleId)
        .build();

    orders.getOptions(request)
        .then(callback)
        .catch((e) => {
            throw e;
        });
}