import { IVehicle } from '@wayke-se/ecom';

export const getVehicleTitle = (vehicle: IVehicle): string | null => {
    if (!vehicle) {
        return null;
    }

    return vehicle.manufacturer + ' ' + vehicle.modelName;
}

export const getVehicleDescription = (vehicle: IVehicle): string | null => {
    if (!vehicle) {
        return null;
    }

    return vehicle.modelSeries;
}

export const getVehicleFullTitle = (registrationNumber: string, vehicle: IVehicle): string | null => {
    if (!vehicle) {
        return null;
    }

    return registrationNumber + ' - ' + vehicle.manufacturer + ' ' + vehicle.modelName + ', ' + vehicle.modelSeries;
}