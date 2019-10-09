import { IVehicle } from '@wayke-se/ecom';

export const getVehicleTitle = (vehicle: IVehicle): string | null => {
    if (!vehicle) {
        return null;
    }

    return vehicle.manufacturer + ' ' + vehicle.modelSeries;
}

export const getVehicleDescription = (vehicle: IVehicle): string | null => {
    if (!vehicle) {
        return null;
    }

    return vehicle.modelName;
}

export const getVehicleFullTitle = (registrationNumber: string, vehicle: IVehicle): string | null => {
    if (!vehicle) {
        return null;
    }

    return registrationNumber + ' - ' + vehicle.manufacturer + ' ' + vehicle.modelSeries + ', ' + vehicle.modelName;
}