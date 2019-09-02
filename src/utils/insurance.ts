import { DrivingDistance } from 'wayke-ecom';

export const getDrivingDistanceLabel = (drivingDistance: DrivingDistance): string => {
    switch (drivingDistance) {
        case DrivingDistance.Between0And1000:
            return '0-1000 mil';

        case DrivingDistance.Between1000And1500:
            return '1000-1500 mil';

        case DrivingDistance.Between1500And2000:
            return '1500-2000 mil';

        case DrivingDistance.Between2000And2500:
            return '2000-2500 mil';

        case DrivingDistance.Over2500:
            return '2500+ mil';

        default:
            return '';
    }
};