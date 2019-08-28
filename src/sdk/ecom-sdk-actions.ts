import { orders, insurances, IOrderOptionsResponse, PaymentType, IInsuranceOptionsResponse } from 'wayke-ecom';
import { IPaymentOption } from 'wayke-ecom/dist-types/orders/types';

//This is used for development purposes
class CustomResponse implements IOrderOptionsResponse {
    response = null;

    constructor(response: IOrderOptionsResponse) {
        this.response = response;
    }

    getPaymentOptions(): import("wayke-ecom/dist-types/orders/types").IPaymentOption[] {
        return this.response.getPaymentOptions();
    }
    getDeliveryOptions(): import("wayke-ecom/dist-types/orders/types").IDeliveryOption[] {
        return this.response.getDeliveryOptions();
    }
    getInsuranceOption(): import("wayke-ecom").IAvailableInsuranceOption {
        return this.response.getInsuranceOption();
    }
    getOrderConditions(): string {
        return this.response.getOrderConditions();
    }
    allowsTradeIn(): boolean {
        return this.response.allowsTradeIn();
    }
}

export const getInitialData = (vehicleId: string, callback: (options: IOrderOptionsResponse) => void) => {
    const request = orders.newOptionsRequest()
        .forVehicle(vehicleId)
        .build();

    orders.getOptions(request)
        .then((response: IOrderOptionsResponse) => {
            callback(new CustomResponse(response));
        })
        .catch((e) => {
            throw e;
        });
};

export const getInsuranceAlternatives = (
        personalNumber: string,
        vehicleId: string,
        paymentType: IPaymentOption,
        drivingDistance: number,
        callback: (options: IInsuranceOptionsResponse) => void
) => {
    const request = insurances.newInsuranceOptionsRequest()
                        .forCustomer(personalNumber)
                        .forVehicle(vehicleId)
                        .withPayment(paymentType)
                        .withDrivingDistance(drivingDistance)
                        .build();

    insurances.getOptions(request)
        .then(callback)
        .catch((e) => {
            throw e
        });
}