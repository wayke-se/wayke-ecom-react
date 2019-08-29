import { orders, insurances, vehicles, customers, IOrderOptionsResponse, IInsuranceOptionsResponse, IVehicleLookupResponse, IAddressLookupResponse, VehicleCondition, IAddress, PaymentType, DeliveryType, IOrderCreateResponse } from 'wayke-ecom';
import { IPaymentOption } from 'wayke-ecom/dist-types/orders/types';

export const getOrderOptions = (
        vehicleId: string,
        callback: (isSuccessful: boolean, options: IOrderOptionsResponse) => void
) => {
    const request = orders.newOptionsRequest()
        .forVehicle(vehicleId)
        .build();

    orders.getOptions(request)
        .then((response: IOrderOptionsResponse) => {
            callback(true, response);
        })
        .catch(() => {
            callback(false, null);
        });
};

export const getInsuranceOptions = (
        personalNumber: string,
        vehicleId: string,
        paymentType: IPaymentOption,
        drivingDistance: number,
        callback: (isSuccessful: boolean, options: IInsuranceOptionsResponse) => void
) => {
    const request = insurances.newInsuranceOptionsRequest()
                        .forCustomer(personalNumber)
                        .forVehicle(vehicleId)
                        .withPayment(paymentType)
                        .withDrivingDistance(drivingDistance)
                        .build();

    insurances.getOptions(request)
        .then((response: IInsuranceOptionsResponse) => {
            callback(true, response);
        })
        .catch(() => {
            callback(false, null);
        });
};

export const getVehicleLookup = (
        registrationNumber: string,
        callback: (isSuccessful: boolean, lookup: IVehicleLookupResponse) => void
) => {
    const request = vehicles.newLookupRequest()
        .withRegistrationNumber(registrationNumber)
        .build();

    vehicles.lookupVehicle(request)
        .then((response: IVehicleLookupResponse) => {
            callback(true, response);
        })
        .catch(() => {
            callback(false, null);
        });
};

export const getAddressLookup = (
        personalNumber: string,
        callback: (isSuccessful: boolean, lookup: IAddressLookupResponse) => void
) => {
    const request = customers.newAddressLookupRequest()
        .forCustomer(personalNumber)
        .build();

    customers.lookupAddress(request)
        .then((response: IAddressLookupResponse) => {
            callback(true, response);
        })
        .catch(() => {
            callback(false, null);
        });
};

export const createOrder = (
    customerAddress: IAddress,
    customerPersonalNumber: string,
    customerEmail: string,
    customerPhone: string,

    paymentType: PaymentType,
    paymentFinancingDeposit: number,
    paymentFinancingDuration: number,
    paymentResidualValue: number,

    insuranceExpectedDrivingDistance: number,
    insuranceAddOns: string[],

    tradeInRegistrationNumber: string,
    tradeInMilage: number,
    tradeInCondition: VehicleCondition,
    tradeInComment: string,

    vehicleId: string,
    deliveryType: DeliveryType,

    callback: (isSuccessful: boolean, response: IOrderCreateResponse) => void
) => {
    const customer = customers.newCustomer()
        .withAddress(customerAddress)
        .withPersonalNumber(customerPersonalNumber)
        .withEmail(customerEmail)
        .withPhoneNumber(customerPhone)
        .build();

    const payment = orders.newPayment()
        .withType(paymentType)
        .withDownPayment(paymentFinancingDeposit)
        .withDuration(paymentFinancingDuration)
        .withResidualValue(paymentResidualValue)
        .build();

    const insurance = orders.newInsurance()
        .withDrivingDistance(insuranceExpectedDrivingDistance)
        .withAddOns(insuranceAddOns)
        .build();

    const tradeIn = vehicles.newVehicleTrade()
        .forVehicle(tradeInRegistrationNumber)
        .withMileage(tradeInMilage)
        .withCondition(tradeInCondition)
        .withComment(tradeInComment)
        .build();

    const request = orders.newCreateRequest()
        .forVehicle(vehicleId)
        .withCustomer(customer)
        .withPayment(payment)
        .withDeliveryType(deliveryType)
        .withInsurance(insurance)
        .withTradeIn(tradeIn)
        .build();

    orders.create(request)
        .then((response: IOrderCreateResponse) => {
            callback(true, response);
        })
        .catch(() => {
            callback(false, null);
        });
}